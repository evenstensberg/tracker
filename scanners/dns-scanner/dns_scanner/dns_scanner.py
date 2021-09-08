import os
import sys
import logging
import nacl
import base64
import tldextract
import dkim
from checkdmarc import *
from dns import resolver
from dkim import dnsplug, crypto, KeyFormatError
from dkim.util import InvalidTagValueList
from pebble import concurrent

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

TIMEOUT = int(os.getenv("SCAN_TIMEOUT", "80"))


class DMARCScanner():
    domain = None


    def __init__(self, target_domain):
        self.domain = target_domain


    @concurrent.process(timeout=TIMEOUT)
    def run(self):

        # Single-item list to pass off to check_domains function.
        domain_list = list()
        domain_list.append(self.domain)

        try:
            # Perform "checkdmarc" scan on provided domain.
            scan_result = json.loads(json.dumps(check_domains(domain_list, skip_tls=True)))
        except (DNSException, SPFError, DMARCError) as e:
            logging.error(f"Failed to check the given domains for DMARC/SPF records. ({e})")
            return {
                "dmarc": {"error": "missing"},
                "spf": {"error": "missing"},
                "mx": {"error": "missing"},
            }

        if scan_result["dmarc"].get("record", "null") == "null":
            return {
                "dmarc": {"error": "missing"},
                "spf": {"error": "missing"},
                "mx": {"error": "missing"},
            }

        for rua in scan_result["dmarc"].get("tags", {}).get("rua", {}).get("value", []):
            try:
                # Retrieve 'rua' tag address.
                rua_addr = rua["address"]

                # Extract the domain from the address string (e.g. 'dmarc@cyber.gc.ca' -> 'cyber.gc.ca').
                rua_domain = rua_addr.split("@", 1)[1]

                # Extract organizational domain from original domain (e.g. 'tracker.cyber.gc.ca' -> 'cyber.gc.ca')
                extract = tldextract.TLDExtract(include_psl_private_domains=True)
                extract.update()
                parsed_domain = extract(self.domain)
                org_domain = ".".join([parsed_domain.domain, parsed_domain.suffix])

                # Extract organizational domain from 'rua' domain
                parsed_rua_domain = extract(rua_domain)
                rua_org_domain = ".".join([parsed_rua_domain.domain, parsed_rua_domain.suffix])

                # If the report destination's organizational does not differ from the provided domain's organizational domain, assert reports are being accepted.
                if rua_org_domain == org_domain:
                    rua["accepting"] = True
                else:
                    try:
                        # Request txt record to ensure that "rua" domain accepts DMARC reports.
                        rua_scan_result = resolver.query(
                            f"{self.domain}._report._dmarc.{rua_domain}", "TXT"
                        )
                        rua_txt_value = (
                            rua_scan_result.response.answer[0][0].strings[0].decode("UTF-8")
                        )
                        # Assert external reporting arrangement has been authorized if TXT containing version tag with value "DMARC1" is found.
                        scan_result["dmarc"]["tags"]["rua"]["accepting"] = (
                            rua_txt_value == "v=DMARC1"
                        )
                    except (DNSException, SPFError, DMARCError, resolver.NXDOMAIN) as e:
                        logging.error(f"Failed to validate external reporting arrangement between rua address={rua_domain} and domain={self.domain}: {e}")
                        rua["accepting"] = "undetermined"
            except (TypeError, KeyError) as e:
                logging.error(f"Error occurred while attempting to validate rua address for domain={self.domain}: {e}")

        for ruf in scan_result["dmarc"].get("tags", {}).get("ruf", {}).get("value", []):
            try:
                # Retrieve 'ruf' tag address.
                ruf_addr = ruf["address"]

                # Extract the domain from the address string (e.g. 'dmarc@cyber.gc.ca' -> 'cyber.gc.ca').
                ruf_domain = ruf_addr.split("@", 1)[1]

                # Extract organizational domain from original domain (e.g. 'tracker.cyber.gc.ca' -> 'cyber.gc.ca')
                extract = tldextract.TLDExtract(include_psl_private_domains=True)
                extract.update()
                parsed_domain = extract(self.domain)
                org_domain = ".".join([parsed_domain.domain, parsed_domain.suffix])

                # Extract organizational domain from 'ruf' domain
                parsed_ruf_domain = extract(ruf_domain)
                ruf_org_domain = ".".join([parsed_ruf_domain.domain, parsed_ruf_domain.suffix])

                # If the report destination's organizational does not differ from the provided domain's organizational domain, assert reports are being accepted.
                if ruf_org_domain == org_domain:
                    ruf["accepting"] = True
                else:
                    try:
                        # Request txt record to ensure that "ruf" domain accepts DMARC reports.
                        ruf_scan_result = resolver.query(
                            f"{self.domain}._report._dmarc.{ruf_domain}", "TXT"
                        )
                        ruf_txt_value = (
                            ruf_scan_result.response.answer[0][0].strings[0].decode("UTF-8")
                        )
                        # Assert external reporting arrangement has been authorized if TXT containing version tag with value "DMARC1" is found.
                        scan_result["dmarc"]["tags"]["ruf"]["accepting"] = (
                            ruf_txt_value == "v=DMARC1"
                        )
                    except (DNSException, SPFError, DMARCError, resolver.NXDOMAIN) as e:
                        logging.error(f"Failed to validate external reporting arrangement between ruf address={ruf_domain} and domain={self.domain}: {e}")
                        ruf["accepting"] = "undetermined"
            except (TypeError, KeyError) as e:
                logging.error(f"Error occurred while attempting to validate ruf address for domain={self.domain}: {e}")

        return scan_result


class DKIMScanner():
    domain = None
    selectors = None


    def __init__(self, target_domain, target_selectors):
        self.domain = target_domain
        self.selectors = target_selectors


    def bitsize(x):
        """Return size of long in bits."""
        return len(bin(x)) - 2


    def load_pk(name, s=None):
        """
        Load the corresponding public key from DNS records
        :param name: Domain name
        :param s: TXT record from DNS
        :return: tuple (pk, keysize, ktag)
            WHERE
            pk: public key value
            keysize: size of public key
            ktag: key type (RSA, etc.)
        """
        if not s:
            raise KeyFormatError("missing public key: %s" % name)
        try:
            if type(s) is str:
                s = s.encode("ascii")
            pub = dkim.util.parse_tag_value(s)
        except InvalidTagValueList as e:
            raise KeyFormatError(e)
        try:
            if pub[b"k"] == b"ed25519":
                pk = nacl.signing.VerifyKey(pub[b"p"], encoder=nacl.encoding.Base64Encoder)
                keysize = 256
                ktag = b"ed25519"
        except KeyError:
            pub[b"k"] = b"rsa"
        if pub[b"k"] == b"rsa":
            try:
                pk = crypto.parse_public_key(base64.b64decode(pub[b"p"]))
                keysize = bitsize(pk["modulus"])
            except KeyError:
                raise KeyFormatError(f"incomplete public key: {s}")
            except (TypeError, UnparsableKeyError) as e:
                raise KeyFormatError(f"could not parse public key ({pub[b'p']}): {e}")
            ktag = b"rsa"
        return pk, keysize, ktag


    @concurrent.process(timeout=TIMEOUT)
    def run(self):

        record = {}

        for selector in self.selectors:
            record[selector] = {}
            try:
                # Retrieve public key from DNS
                pk_txt = dnsplug.get_txt_dnspython(f"{selector}._domainkey.{self.domain}")

                pk, keysize, ktag = load_pk(f"{selector}._domainkey.{self.domain}", pk_txt)

                # Parse values and convert to dictionary
                pub = dkim.util.parse_tag_value(pk_txt)

                txt_record = {}

                key_val = pub[b"p"].decode("ascii")

                for key in pub:
                    if key.decode("ascii") == "t":
                        record[selector]["t_value"] = pub[key]

                for key, val in pub.items():
                    txt_record[key.decode("ascii")] = val.decode("ascii")

                record[selector]["txt_record"] = txt_record
                record[selector]["public_key_value"] = key_val
                record[selector]["key_size"] = keysize
                record[selector]["key_type"] = ktag.decode("ascii")
                record[selector]["public_key_modulus"] = pk["modulus"]
                record[selector]["public_exponent"] = pk["publicExponent"]

            except Exception as e:
                logging.error(
                    f"Failed to perform DomainKeys Identified Mail scan on given domain: {self.domain}, (selector: {selector}): {str(e)}"
                )
                record[selector] = {"error": "missing"}


        return record