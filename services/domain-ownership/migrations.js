const makeMigrations = ({ databaseName, rootPass }) => [
  {
    type: 'database',
    databaseName,
    users: [{ username: 'root', passwd: rootPass }],
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'users',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'organizations',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'domains',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'dkim',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'dmarc',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'spf',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'https',
  },
  {
    type: 'documentcollection',
    databaseName,
    name: 'ssl',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'affiliations',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'claims',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'domainsDKIM',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'domainsDMARC',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'domainsSPF',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'domainsHTTPS',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'domainsSSL',
  },
  {
    type: 'edgecollection',
    databaseName,
    name: 'ownership',
  },
]

module.exports = {
  makeMigrations,
}