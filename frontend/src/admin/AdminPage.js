import React, { useCallback, useState } from 'react'
import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { t, Trans } from '@lingui/macro'
import { useQuery } from '@apollo/client'
import { Link as RouteLink } from 'react-router-dom'
import { useLingui } from '@lingui/react'

import { AdminPanel } from './AdminPanel'
import { OrganizationInformation } from './OrganizationInformation'

import { ADMIN_AFFILIATIONS, IS_USER_SUPER_ADMIN } from '../graphql/queries'
import { Dropdown } from '../components/Dropdown'
import { ErrorFallbackMessage } from '../components/ErrorFallbackMessage'
import { useDebouncedFunction } from '../utilities/useDebouncedFunction'

export default function AdminPage() {
  const [selectedOrg, setSelectedOrg] = useState('none')
  const [orgDetails, setOrgDetails] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const toast = useToast()
  const { i18n } = useLingui()

  const memoizedSetDebouncedSearchTermCallback = useCallback(() => {
    setDebouncedSearchTerm(searchTerm)
  }, [searchTerm])

  useDebouncedFunction(memoizedSetDebouncedSearchTermCallback, 500)

  const { loading, error, data } = useQuery(ADMIN_AFFILIATIONS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      first: 100,
      orderBy: { field: 'NAME', direction: 'ASC' },
      isAdmin: true,
      includeSuperAdminOrg: true,
      search: debouncedSearchTerm,
    },
    onError: (error) => {
      const [_, message] = error.message.split(': ')
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-left',
      })
    },
  })

  const { data: isSA } = useQuery(IS_USER_SUPER_ADMIN, {
    onError: (error) => {
      const [_, message] = error.message.split(': ')
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-left',
      })
    },
  })

  if (error) {
    return <ErrorFallbackMessage error={error} />
  }

  let dropdown
  let options = []

  if (loading) {
    dropdown = (
      <Dropdown
        label={i18n._(t`Organization: `)}
        labelDirection="row"
        options={[]}
        placeholder={i18n._(t`Select an organization`)}
        onSearch={(val) => setSearchTerm(val)}
        searchValue={searchTerm}
      />
    )
  } else {
    options = []
    data.findMyOrganizations?.edges.forEach((edge) => {
      const { slug, name, id } = edge.node
      options.push({ label: name, value: { slug: slug, id: id } })
    })
    dropdown = (
      <Dropdown
        label={i18n._(t`Organization: `)}
        labelDirection="row"
        options={options}
        placeholder={i18n._(t`Select an organization`)}
        onSearch={(val) => setSearchTerm(val)}
        searchValue={searchTerm}
        onChange={(opt) => {
          setOrgDetails(opt.value)
          setSelectedOrg(opt.label)
        }}
      />
    )
  }

  return (
    <Stack spacing={10} w="100%" px={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justifyContent="space-between"
      >
        {dropdown}
        <Button
          variant="primary"
          ml={{ base: '0', md: 'auto' }}
          w={{ base: '100%', md: 'auto' }}
          mt={{ base: 2, md: 0 }}
          as={RouteLink}
          to="/create-organization"
        >
          <AddIcon mr={2} aria-hidden="true" />
          <Trans>Create Organization</Trans>
        </Button>
      </Flex>
      {selectedOrg !== 'none' ? (
        <>
          <OrganizationInformation
            orgSlug={orgDetails.slug}
            mb="1rem"
            removeOrgCallback={setSelectedOrg}
            // set key, this resets state when switching orgs (closes editing box)
            key={orgDetails.slug}
          />
          <AdminPanel
            orgSlug={orgDetails.slug}
            orgId={orgDetails.id}
            permission={isSA?.isUserSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN'}
            mr="4"
          />
        </>
      ) : (
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          <Trans>Select an organization to view admin options</Trans>
        </Text>
      )}
    </Stack>
  )
}
