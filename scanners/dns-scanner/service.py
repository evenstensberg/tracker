import time
import json
import argparse, sys
import logging
import asyncio
import os
import signal
import traceback
import datetime as dt
from operator import itemgetter
from dotenv import load_dotenv
from concurrent.futures import TimeoutError
from dns_scanner import DMARCScanner, DKIMScanner
from nats.aio.client import Client as NATS

load_dotenv()

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

SUBSCRIBE_TO = os.getenv("SUBSCRIBE_TO", "domains.*")
PUBLISH_TO = os.getenv("PUBLISH_TO", "domains")
QUEUE_GROUP = os.getenv("QUEUE_GROUP", "dns")
SERVERLIST = os.getenv("NATS_SERVERS", "nats://localhost:4222")
SERVERS = SERVERLIST.split(",")


def to_json(msg):
    print(json.dumps(msg, indent=2))


async def run(loop):
    parser = argparse.ArgumentParser()

    # e.g. nats-sub hello -s nats://127.0.0.1:4222
    parser.add_argument("subject", default="domains", nargs="?")
    parser.add_argument("-s", "--servers", default=[], action="append")
    parser.add_argument("-q", "--queue", default="https")
    parser.add_argument("--creds", default="")
    args = parser.parse_args()

    nc = NATS()

    async def error_cb(e):
        print("Error:", e)

    async def closed_cb():
        print("Connection to NATS is closed.")
        await asyncio.sleep(0.1)
        loop.stop()

    async def reconnected_cb():
        print(f"Connected to NATS at {nc.connected_url.netloc}...")

    async def subscribe_handler(msg):
        subject = msg.subject
        reply = msg.reply
        data = msg.data.decode()
        print(
            "Received a message on '{subject} {reply}': {data}".format(
                subject=subject, reply=reply, data=data
            )
        )
        payload = json.loads(msg.data)

        domain = payload["domain"]
        domain_key = payload["domain_key"]
        user_key = payload["user_key"]
        shared_id = payload["shared_id"]
        selectors = payload["selectors"]

        try:
            # DMARC scan
            scanner = DMARCScanner(domain)
            start = time.time()

            future = scanner.run()
            scan_results = future.result()

            if len(selectors) != 0:
                # DKIM scan
                scanner = DKIMScanner(domain, selectors)
                start = time.time()

                future = scanner.run()
                scan_results["dkim"] = future.result()
            else:
                scan_results["dkim"] = {"error": "missing"}

        except TimeoutError:
            logging.error(
                f"Timeout while scanning {domain} (Aborted after {round(time.time()-start, 2)} seconds)"
            )
            await nc.publish(
                f"{PUBLISH_TO}.{domain_key}.dns",
                json.dumps(
                    {
                        "results": {
                            "dmarc": {"error": "missing"},
                            "spf": {"error": "missing"},
                            "mx": {"error": "missing"},
                            "dkim": {"error": "missing"},
                        },
                        "scan_type": "dns",
                        "user_key": user_key,
                        "domain_key": domain_key,
                        "shared_id": shared_id,
                    }
                ).encode(),
            )



        await nc.publish(
            f"{PUBLISH_TO}.{domain_key}.dns",
            json.dumps(
                {
                    "results": scan_results,
                    "scan_type": "dns",
                    "user_key": user_key,
                    "domain_key": domain_key,
                    "shared_id": shared_id,
                }
            ).encode(),
        )

    options = {
        "loop": loop,
        "error_cb": error_cb,
        "closed_cb": closed_cb,
        "reconnected_cb": reconnected_cb,
    }

    if len(args.creds) > 0:
        options["user_credentials"] = args.creds

    try:
        if len(args.servers) > 0:
            options["servers"] = [SERVERS]

        await nc.connect(**options)
    except Exception as e:
        print(e)
        show_usage_and_die()

    print(f"Connected to NATS at {nc.connected_url.netloc}...")

    def signal_handler():
        if nc.is_closed:
            return
        print("Disconnecting...")
        loop.create_task(nc.close())

    for sig in ("SIGINT", "SIGTERM"):
        loop.add_signal_handler(getattr(signal, sig), signal_handler)

    await nc.subscribe(SUBSCRIBE_TO, QUEUE_GROUP, subscribe_handler)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(loop))
    try:
        loop.run_forever()
    finally:
        loop.close()