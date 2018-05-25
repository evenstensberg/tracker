import io
import datetime
import csv
import typing
from flask_pymongo import PyMongo
from pulse.data import CSV_FIELDS, FIELD_MAPPING, LABELS

# These functions are meant to be the only ones that access the g.db.db
# directly. If we ever decide to migrate from tinyg.db.db, that can all be
# coordinated here.

db = PyMongo()

# Data loads should clear the entire database first.
def clear_database():
    db.cx.drop_database(db.db)


class Report:
    # report_date (string, YYYY-MM-DD)
    # https.eligible (number)
    # https.uses (number)
    # https.enforces (number)
    # https.hsts (number)
    # https.bod (number)

    # Initialize a report with a given date.
    @staticmethod
    def create(data: typing.Dict, copy: bool = True) -> None:
        if copy:
            return db.db.reports.insert_one(data.copy())
        return db.db.reports.insert_one(data)

    @staticmethod
    def report_time(report_date: str) -> datetime.datetime:
        return datetime.datetime.strptime(report_date, "%Y-%m-%d")

    @staticmethod
    # There's only ever one.
    def latest() -> typing.Dict:
        return db.db.reports.find_one({}, {'_id': False})


class Domain:
    # domain (string)
    # organization_slug (string)
    # is_parent (boolean)
    #
    # organization_name_en (string)
    # organization_name_fr (string)
    #
    # parent_domain (string)
    # sources (array of strings)
    #
    # live? (boolean)
    # redirect? (boolean)
    # canonical (string, URL)
    #
    # totals: {
    #   https: { ... }
    #   crypto: { ... }
    # }
    #
    # https: { ... }
    #

    @staticmethod
    def create(data: typing.Dict, copy: bool = True) -> None:
        if copy:
            return db.db.domains.insert_one(data.copy())
        return db.db.domains.insert_one(data)

    # Warning - This will add an _id element to all the documents inserted via this method
    @staticmethod
    def create_all(iterable: typing.Iterable[typing.Dict], copy: bool = False) -> None:
        if copy:
            return db.db.domains.insert_many(document.copy() for document in iterable)
        return db.db.domains.insert_many(iterable)

    @staticmethod
    def update(domain_name: str, data: typing.Dict) -> None:
        return db.db.domains.update_one(
            {'domain': domain_name},
            {'$set': data},
        )

    @staticmethod
    def add_report(domain_name: str, report_name: str, report: typing.Dict) -> None:
        return db.db.domains.update_one(
            {'domain': domain_name},
            {'$set': {report_name: report}}
        )

    @staticmethod
    def find(domain_name: str) -> typing.Dict:
        return db.db.domains.find_one({'domain': domain_name}, {'_id': False})

    # Useful when you want to pull in all domain entries as peers,
    # such as reports which only look at parent domains, or
    # a flat CSV of all hostnames that match a report.
    @staticmethod
    def eligible(report_name: str) -> typing.Iterable[typing.Dict]:
        return db.db.domains.find(
            {f'{report_name}.eligible': True}, {'_id': False}
        )

    # Useful when you have mixed parent/subdomain reporting,
    # used for HTTPS but not yet others.
    @staticmethod
    def eligible_parents(report_name: str) -> typing.Iterable[typing.Dict]:
        return db.db.domains.find(
            {f'{report_name}.eligible_zone': True, 'is_parent': True}, {'_id': False}
        )

    # Useful when you want to pull down subdomains of a particular
    # parent domain. Used for HTTPS expanded reports.
    @staticmethod
    def eligible_for_domain(domain: str, report_name: str) -> typing.Iterable[typing.Dict]:
        return db.db.domains.find(
            {f'{report_name}.eligible': True, 'base_domain': domain}, {'_id': False}
        )

    @staticmethod
    def all() -> typing.Iterable[typing.Dict]:
        return db.db.domains.find({}, {'_id': False})

    @staticmethod
    def to_csv(domains: typing.Iterable[typing.Dict], report_type: str) -> str:
        output = io.StringIO()
        writer = csv.writer(output, quoting=csv.QUOTE_NONNUMERIC)

        def value_for(value: typing.Union[str, list, bool]) -> str:
            # if it's a list, convert it to a list of strings and join
            if isinstance(value, list):
                value = [str(x) for x in value]
                value = ", ".join(value)
            elif isinstance(value, bool):
                value = {True: 'Yes', False: 'No'}[value]
            return value

        # initialize with a header row
        header = []

        # Common fields, and report-specific fields
        for category in ['common', report_type]:
            for field in CSV_FIELDS[category]:
                header.append(LABELS[category][field])
        writer.writerow(header)

        for domain in domains:
            row = []

            # Common fields, and report-specific fields
            for category in ['common', report_type]:

                # Currently, all report-specific fields use a mapping
                for field in CSV_FIELDS[category]:

                    # common fields are top-level on Domain objects
                    if category == 'common':
                        value = domain.get(field)
                    else:
                        value = domain[report_type].get(field)

                    # If a mapping exists e.g. 1 -> "Yes", etc.
                    if (
                            FIELD_MAPPING.get(category) and
                            FIELD_MAPPING[category].get(field) and
                            (FIELD_MAPPING[category][field].get(value) is not None)
                        ):
                        value = FIELD_MAPPING[category][field][value]

                    row.append(value_for(value))

            writer.writerow(row)

        return output.getvalue()


class Organization:
    # organization_slug (string)
    # organization_name (string)
    # total_domains (number)
    #
    # https {
    #   eligible (number)
    #   uses (number)
    #   enforces (number)
    #   hsts (number)
    #   modern (number)
    #   preloaded (number)
    # }
    #

    # An organization which had at least 1 eligible domain.
    @staticmethod
    def eligible(report_name: str) -> typing.Iterable[typing.Dict]:
        return db.db.organizations.find({f'{report_name}.eligible': {'$gt': 0}}, {'_id': False})

    # Create a new Agency record with a given name, slug, and total domain count.
    @staticmethod
    def create(data: typing.Dict, copy: bool = True) -> None:
        if copy:
            return db.db.organizations.insert_one(data.copy()) # Copy dictionary to prevent mutation side effect
        return db.db.organizations.insert_one(data)

    @staticmethod
    def create_all(iterable: typing.Iterable[typing.Dict], copy: bool = False) -> None:
        if copy:
            return db.db.organizations.insert_many(iterable)
        return db.db.organizations.insert_many(document.copy() for document in iterable)

    # For a given organization, add a report.
    @staticmethod
    def add_report(slug: str, report_name: str, report: typing.Dict) -> None:
        return db.db.organizations.update_one(
            {'slug': slug},
            {'$set': {report_name: report}}
        )

    @staticmethod
    def find(slug: str) -> typing.Dict:
        return db.db.organizations.find_one({'slug': slug}, {'_id': False})

    @staticmethod
    def all() -> typing.Iterable[typing.Dict]:
        return db.db.organizations.find({}, {'_id': False})
