import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Accordion,
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Select,
  Text,
} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { t, Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { number } from 'prop-types'
import { Link as RouteLink, useHistory, useParams } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { DmarcReportSummaryGraph } from './DmarcReportSummaryGraph'

import { TrackerTable } from '../components/TrackerTable'
import { InfoBox, InfoPanel } from '../components/InfoPanel'
import { LoadingMessage } from '../components/LoadingMessage'
import { ErrorFallbackMessage } from '../components/ErrorFallbackMessage'
import { TrackerAccordionItem as AccordionItem } from '../components/TrackerAccordionItem'
import { months } from '../utilities/months'
import { useDocumentTitle } from '../utilities/useDocumentTitle'
import { DMARC_REPORT_GRAPH, PAGINATED_DMARC_REPORT } from '../graphql/queries'

export default function DmarcReportPage() {
  const { domainSlug, period, year } = useParams()
  const history = useHistory()
  const { i18n } = useLingui()

  useDocumentTitle(i18n._(t`DMARC Report for ${domainSlug}`))

  const currentDate = new Date()
  const [selectedPeriod, setSelectedPeriod] = useState(period)
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedDate, setSelectedDate] = useState(
    `${selectedPeriod}, ${selectedYear}`,
  )

  const [fullPassState, changeFullPassState] = useState({
    isVisible: false,
  })
  const [failDkimState, changeFailDkimState] = useState({
    isVisible: false,
  })
  const [failSpfState, changeFailSpfState] = useState({
    isVisible: false,
  })
  const [fullFailState, changeFullFailState] = useState({
    isVisible: false,
  })

  // Allows the use of forward/backward navigation
  if (selectedPeriod !== period) setSelectedPeriod(period)
  if (selectedYear !== year) setSelectedPeriod(year)
  if (selectedDate !== `${period}, ${year}`)
    setSelectedDate(`${period}, ${year}`)

  const {
    loading: graphLoading,
    error: graphError,
    data: graphData,
  } = useQuery(DMARC_REPORT_GRAPH, {
    variables: {
      domain: domainSlug,
    },
  })

  const {
    loading: tableLoading,
    error: tableError,
    data: tableData,
  } = useQuery(PAGINATED_DMARC_REPORT, {
    variables: {
      month: selectedPeriod,
      year: selectedYear,
      domain: domainSlug,
      first: 50,
      after: '',
    },
  })

  const options = [
    <option
      key="LAST30DAYS"
      value={`LAST30DAYS, ${currentDate.getFullYear().toString()}`}
    >
      {i18n._(t`Last 30 Days`)}
    </option>,
  ]

  // add dmarc date selection options
  for (let i = currentDate.getMonth(), j = 13; j > 0; i--, j--) {
    // handle previous year
    if (i < 0) {
      const value = `${months[months.length + i].toUpperCase()}, ${
        currentDate.getFullYear() - 1
      }`
      const translatedValue = `${months[months.length + i].toUpperCase()}, ${
        currentDate.getFullYear() - 1
      }`

      options.push(
        <option key={value} value={value}>
          {translatedValue}
        </option>,
      )
    }
    // handle current year
    else {
      const value = `${months[i].toUpperCase()}, ${currentDate.getFullYear()}`
      const translatedValue = `${months[
        i
      ].toUpperCase()}, ${currentDate.getFullYear()}`

      options.push(
        <option key={value} value={value}>
          {translatedValue}
        </option>,
      )
    }
  }

  // Show data for newly selected date
  const handleChange = (e) => {
    setSelectedDate(e.target.value)
    const [newPeriod, newYear] = e.target.value.split(', ')
    setSelectedPeriod(newPeriod)
    setSelectedYear(newYear)
    history.replace(
      `/domains/${domainSlug}/dmarc-report/${newPeriod}/${newYear}`,
    )
  }

  // Set DMARC bar graph Loading
  if (graphLoading || tableLoading) {
    return (
      <LoadingMessage>
        <Trans>DMARC Report</Trans>
      </LoadingMessage>
    )
  }

  if (!graphData?.findDomainByDomain?.hasDMARCReport) {
    return (
      <Box align="center" w="100%" px={4}>
        <Text textAlign="center" fontSize="3xl" fontWeight="bold">
          <span>{domainSlug} </span>
          <Trans>does not support aggregate data</Trans>
        </Text>
      </Box>
    )
  }

  // DMARC bar graph setup
  let graphDisplay

  // Display graph query error if found
  if (graphError) {
    graphDisplay = <ErrorFallbackMessage error={graphError} />
  }
  // Set graph display using data if data exists
  else if (graphData?.findDomainByDomain?.yearlyDmarcSummaries?.length > 0) {
    const strengths = {
      fullPass: i18n._(t`Pass`),
      fullPassPercentage: i18n._(t`Pass`),

      passSpfOnly: i18n._(t`Fail DKIM`),
      passSpfOnlyPercentage: i18n._(t`Fail DKIM`),

      passDkimOnly: i18n._(t`Fail SPF`),
      passDkimOnlyPercentage: i18n._(t`Fail SPF`),

      fail: i18n._(t`Fail`),
      failPercentage: i18n._(t`Fail`),
    }

    const formattedGraphData = {
      periods: graphData.findDomainByDomain.yearlyDmarcSummaries.map(
        (entry) => {
          return {
            month: entry.month,
            year: entry.year,
            ...entry.categoryTotals,
            ...entry.categoryPercentages,
          }
        },
      ),
    }
    formattedGraphData.strengths = strengths
    graphDisplay = (
      <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
        <DmarcReportSummaryGraph data={formattedGraphData} />
      </ErrorBoundary>
    )
  }
  // If no data exists for DMARC graph, display message saying so
  else {
    graphDisplay = (
      <Heading as="h3" size="lg">
        * <Trans>No data for the DMARC yearly report graph</Trans> *
      </Heading>
    )
  }

  const sourceIpAddress = {
    Header: i18n._(t`Source IP Address`),
    accessor: 'sourceIpAddress',
    style: { whiteSpace: 'nowrap' },
  }
  const envelopeFrom = {
    Header: i18n._(t`Envelope From`),
    accessor: 'envelopeFrom',
    style: { whiteSpace: 'nowrap' },
  }
  const dkimDomains = {
    Header: i18n._(t`DKIM Domains`),
    accessor: 'dkimDomains',
  }
  const dkimSelectors = {
    Header: i18n._(t`DKIM Selectors`),
    accessor: 'dkimSelectors',
  }
  const totalMessages = {
    Header: i18n._(t`Total Messages`),
    accessor: 'totalMessages',
    Cell: ({ value }) => value.toLocaleString(i18n.locale),
    style: { textAlign: 'right' },
  }
  const dnsHost = { Header: i18n._(t`DNS Host`), accessor: 'dnsHost' }
  const spfDomains = {
    Header: i18n._(t`SPF Domains`),
    accessor: 'spfDomains',
  }
  const headerFrom = {
    Header: i18n._(t`Header From`),
    accessor: 'headerFrom',
    style: { whiteSpace: 'nowrap' },
  }
  const guidance = { Header: i18n._(t`Guidance`), accessor: 'guidance' }
  const spfAligned = {
    Header: i18n._(t`SPF Aligned`),
    accessor: 'spfAligned',
  }
  const spfResults = {
    Header: i18n._(t`SPF Results`),
    accessor: 'spfResults',
  }
  const dkimAligned = {
    Header: i18n._(t`DKIM Aligned`),
    accessor: 'dkimAligned',
  }
  const dkimResults = {
    Header: i18n._(t`DKIM Results`),
    accessor: 'dkimResults',
  }
  const disposition = {
    Header: i18n._(t`Disposition`),
    accessor: 'disposition',
  }

  // Initial sorting category for detail tables
  const initialSort = [{ id: 'totalMessages', desc: true }]

  // DKIM Failure Table setup
  let dkimFailureTable

  // Set DKIM Failure Table Loading
  if (tableLoading) {
    dkimFailureTable = (
      <LoadingMessage>
        <Trans>DKIM Failure Table</Trans>
      </LoadingMessage>
    )
  }
  // DKIM Failure query no longer loading, check if data exists
  else if (
    tableData?.findDomainByDomain?.dmarcSummaryByPeriod?.detailTables
      ?.dkimFailure?.edges.length > 0
  ) {
    const dkimFailureColumns = [
      {
        Header: i18n._(t`DKIM Failures by IP Address`),
        hidden: true,
        columns: [
          sourceIpAddress,
          dnsHost,
          envelopeFrom,
          headerFrom,
          dkimDomains,
          dkimSelectors,
          dkimResults,
          dkimAligned,
          totalMessages,
          guidance,
        ],
      },
    ]

    // Convert boolean values to string and properly format
    const dkimFailureNodes = tableData.findDomainByDomain.dmarcSummaryByPeriod.detailTables.dkimFailure.edges.map(
      (edge) => {
        const node = { ...edge.node }
        node.dkimAligned = node.dkimAligned.toString()
        node.dkimDomains = node.dkimDomains.replace(/,/g, ', ')
        node.dkimSelectors = node.dkimSelectors.replace(/,/g, ', ')
        node.dkimResults = node.dkimResults.replace(/,/g, ', ')
        return node
      },
    )

    const failDkimInfoPanel = (
      <InfoPanel state={failDkimState}>
        <InfoBox
          title="Source IP Address"
          info="The IP address of sending server."
        />
        <InfoBox
          title="DNS Host"
          info="Host from reverse DNS of source IP address."
        />
        <InfoBox
          title="Envelope From"
          info="Domain from Simple Mail Transfer Protocol (SMTP) banner message."
        />
        <InfoBox
          title="Header From"
          info='The address/domain used in the "From" field.'
        />
        <InfoBox
          title="DKIM Domains"
          info="The domains used for DKIM validation."
        />
        <InfoBox
          title="DKIM Selectors"
          info="Pointer to a DKIM public key record in DNS."
        />
        <InfoBox
          title="DKIM Results"
          info="The results of DKIM verification of the message. Can be pass, fail, neutral, temp-error, or perm-error."
        />
        <InfoBox
          title="DKIM Aligned"
          info="Is DKIM aligned. Can be true or false."
        />
        <InfoBox
          title="Total Messages"
          info="The Total Messages from this sender."
        />
        <InfoBox
          title="Guidance"
          info="Details for a given guidance tag can be found on the wiki, see below."
        />
        <Divider borderColor="gray.500" />
        <Link
          isExternal
          href="https://github.com/canada-ca/tracker/wiki/Guidance-Tags"
        >
          https://github.com/canada-ca/tracker/wiki/Guidance-Tags
        </Link>
      </InfoPanel>
    )

    dkimFailureTable = (
      <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
        <TrackerTable
          data={dkimFailureNodes}
          columns={dkimFailureColumns}
          title={i18n._(t`DKIM Failures by IP Address`)}
          initialSort={initialSort}
          frontendPagination={true}
          infoPanel={failDkimInfoPanel}
          infoState={failDkimState}
          changeInfoState={changeFailDkimState}
          searchPlaceholder={i18n._(t`Search DKIM Failing Items`)}
        />
      </ErrorBoundary>
    )
  }
  // Display DKIM Failure if found
  else if (tableError) {
    dkimFailureTable = <ErrorFallbackMessage error={tableError} />
  }
  // If no data exists for DKIM Failure table, display message saying so
  else {
    dkimFailureTable = (
      <Heading as="h3" size="lg">
        * <Trans>No data for the DKIM Failures by IP Address table</Trans> *
      </Heading>
    )
  }

  // Fully Aligned Table setup
  let fullPassTable

  // Set Fully Aligned Table Loading
  if (tableLoading) {
    fullPassTable = (
      <LoadingMessage>
        <Trans>Fully Aligned Table</Trans>
      </LoadingMessage>
    )
  }
  // Full pass query no longer loading, check if data exists
  else if (
    tableData?.findDomainByDomain?.dmarcSummaryByPeriod?.detailTables?.fullPass
      ?.edges.length > 0
  ) {
    const fullPassColumns = [
      {
        Header: i18n._(t`Fully Aligned by IP Address`),
        hidden: true,
        columns: [
          sourceIpAddress,
          dnsHost,
          envelopeFrom,
          headerFrom,
          spfDomains,
          dkimDomains,
          dkimSelectors,
          totalMessages,
        ],
      },
    ]

    // Convert boolean values to string and properly format
    const fullPassNodes = tableData.findDomainByDomain.dmarcSummaryByPeriod.detailTables.fullPass.edges.map(
      (edge) => {
        const node = { ...edge.node }
        node.spfDomains = node.spfDomains.replace(/,/g, ', ')
        node.dkimDomains = node.dkimDomains.replace(/,/g, ', ')
        node.dkimSelectors = node.dkimSelectors.replace(/,/g, ', ')
        return node
      },
    )

    const fullPassInfoPanel = (
      <InfoPanel state={fullPassState}>
        <InfoBox
          title="Source IP Address"
          info="The IP address of sending server."
        />
        <InfoBox
          title="DNS Host"
          info="Host from reverse DNS of source IP address."
        />
        <InfoBox
          title="Envelope From"
          info="Domain from Simple Mail Transfer Protocol (SMTP) banner message."
        />
        <InfoBox
          title="Header From"
          info='The address/domain used in the "From" field.'
        />
        <InfoBox title="SPF Domains" info="Domains used for SPF validation." />
        <InfoBox
          title="DKIM Domains"
          info="Domains used for DKIM validation."
        />
        <InfoBox
          title="DKIM Selectors"
          info="Pointer to a DKIM public key record in DNS."
        />
        <InfoBox
          title="Total Messages"
          info="The Total Messages from this sender."
        />
      </InfoPanel>
    )

    fullPassTable = (
      <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
        <TrackerTable
          data={fullPassNodes}
          columns={fullPassColumns}
          title={i18n._(t`Fully Aligned by IP Address`)}
          initialSort={initialSort}
          frontendPagination={true}
          infoPanel={fullPassInfoPanel}
          infoState={fullPassState}
          changeInfoState={changeFullPassState}
          searchPlaceholder={i18n._(t`Search Fully Aligned Items`)}
        />
      </ErrorBoundary>
    )
  }
  // Display Fully Aligned Error if found
  else if (tableError) {
    fullPassTable = <ErrorFallbackMessage error={tableError} />
  }
  // If no data exists for Fully Aligned table, display message saying so
  else {
    fullPassTable = (
      <Heading as="h3" size="lg">
        * <Trans>No data for the Fully Aligned by IP Address table</Trans> *
      </Heading>
    )
  }

  // SPF Failure Table setup
  let spfFailureTable

  // Set SPF Failure Table Loading
  if (tableLoading) {
    spfFailureTable = (
      <LoadingMessage>
        <Trans>SPF Failure Table</Trans>
      </LoadingMessage>
    )
  }
  // SPF Failure query no longer loading, check if data exists
  else if (
    tableData?.findDomainByDomain?.dmarcSummaryByPeriod?.detailTables
      ?.spfFailure?.edges.length > 0
  ) {
    const spfFailureColumns = [
      {
        Header: i18n._(t`SPF Failures by IP Address`),
        hidden: true,
        columns: [
          sourceIpAddress,
          dnsHost,
          envelopeFrom,
          headerFrom,
          spfDomains,
          spfResults,
          spfAligned,
          totalMessages,
          guidance,
        ],
      },
    ]
    // Convert boolean values to string and properly format
    const spfFailureNodes = tableData.findDomainByDomain.dmarcSummaryByPeriod.detailTables.spfFailure.edges.map(
      (edge) => {
        const node = { ...edge.node }
        node.spfAligned = node.spfAligned.toString()
        node.spfDomains = node.spfDomains.replace(/,/g, ', ')
        return node
      },
    )

    const failSpfInfoPanel = (
      <InfoPanel state={failSpfState}>
        <InfoBox
          title="Source IP Address"
          info="The IP address of sending server."
        />
        <InfoBox
          title="DNS Host"
          info="Host from reverse DNS of source IP address."
        />
        <InfoBox
          title="Envelope From"
          info="Domain from Simple Mail Transfer Protocol (SMTP) banner message."
        />
        <InfoBox
          title="Header From"
          info='The address/domain used in the "From" field.'
        />
        <InfoBox title="SPF Domains" info="Domains used for SPF validation." />
        <InfoBox
          title="SPF Results"
          info="The results of DKIM verification of the message. Can be pass, fail, neutral, soft-fail, temp-error, or perm-error."
        />
        <InfoBox
          title="SPF Aligned"
          info="Is SPF aligned. Can be true or false."
        />
        <InfoBox
          title="Total Messages"
          info="The Total Messages from this sender."
        />
        <InfoBox
          title="Guidance"
          info="Details for a given guidance tag can be found on the wiki, see below."
        />
        <Divider borderColor="gray.500" />
        <Link
          isExternal
          href="https://github.com/canada-ca/tracker/wiki/Guidance-Tags"
        >
          https://github.com/canada-ca/tracker/wiki/Guidance-Tags
        </Link>
      </InfoPanel>
    )

    spfFailureTable = (
      <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
        <TrackerTable
          data={spfFailureNodes}
          columns={spfFailureColumns}
          title={i18n._(t`SPF Failures by IP Address`)}
          initialSort={initialSort}
          frontendPagination={true}
          infoPanel={failSpfInfoPanel}
          infoState={failSpfState}
          changeInfoState={changeFailSpfState}
          searchPlaceholder={i18n._(t`Search SPF Failing Items`)}
        />
      </ErrorBoundary>
    )
  }
  // Display SPF Failure if found
  else if (tableError) {
    spfFailureTable = <ErrorFallbackMessage error={tableError} />
  }
  // If no data exists for SPF Failure table, display message saying so
  else {
    spfFailureTable = (
      <Heading as="h3" size="lg">
        * <Trans>No data for the SPF Failures by IP Address table</Trans> *
      </Heading>
    )
  }

  // DMARC Failure Table setup
  let dmarcFailureTable

  // Set DMARC Failure Table Loading
  if (tableLoading) {
    dmarcFailureTable = (
      <LoadingMessage>
        <Trans>DMARC Failure Table</Trans>
      </LoadingMessage>
    )
  }
  // DMARC Failure query no longer loading, check if data exists
  else if (
    tableData?.findDomainByDomain?.dmarcSummaryByPeriod?.detailTables
      ?.dmarcFailure?.edges.length > 0
  ) {
    const dmarcFailureColumns = [
      {
        Header: i18n._(t`DMARC Failures by IP Address`),
        hidden: true,
        columns: [
          sourceIpAddress,
          dnsHost,
          envelopeFrom,
          headerFrom,
          spfDomains,
          dkimDomains,
          dkimSelectors,
          disposition,
          totalMessages,
        ],
      },
    ]

    // Convert boolean values to string and properly format
    const dmarcFailureNodes = tableData.findDomainByDomain.dmarcSummaryByPeriod.detailTables.dmarcFailure.edges.map(
      (edge) => {
        const node = { ...edge.node }
        node.spfDomains = node.spfDomains.replace(/,/g, ', ')
        node.dkimDomains = node.dkimDomains.replace(/,/g, ', ')
        node.dkimSelectors = node.dkimSelectors.replace(/,/g, ', ')
        return node
      },
    )

    const fullFailInfoPanel = (
      <InfoPanel state={fullFailState}>
        <InfoBox title="Source IP Address" info="The domain address." />
        <InfoBox
          title="DNS Host"
          info="Shows the total number of emails that have been sent by this domain during the selected time range."
        />
        <InfoBox
          title="Envelope From"
          info="Shows the percentage of emails from the domain that have passed both SPF and DKIM requirments."
        />
        <InfoBox
          title="Header From"
          info='The address/domain used in the "From" field.'
        />
        <InfoBox title="SPF Domains" info="Domains used for SPF validation." />
        <InfoBox
          title="DKIM Domains"
          info="The domains used for DKIM validation."
        />
        <InfoBox
          title="DKIM Selectors"
          info="Pointer to a DKIM public key record in DNS."
        />
        <InfoBox
          title="Disposition"
          info="The DMARC enforcement action that the receiver took, either none, quarantine, or reject."
        />
        <InfoBox
          title="Total Messages"
          info="The Total Messages from this sender."
        />
      </InfoPanel>
    )

    dmarcFailureTable = (
      <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
        <TrackerTable
          data={dmarcFailureNodes}
          columns={dmarcFailureColumns}
          title={i18n._(t`DMARC Failures by IP Address`)}
          initialSort={initialSort}
          frontendPagination={true}
          infoPanel={fullFailInfoPanel}
          infoState={fullFailState}
          changeInfoState={changeFullFailState}
          searchPlaceholder={i18n._(t`Search DMARC Failing Items`)}
        />
      </ErrorBoundary>
    )
  }
  // Display DMARC Failure if found
  else if (tableError) {
    dmarcFailureTable = <ErrorFallbackMessage error={tableError} />
  }
  // If no data exists for DMARC Failure table, display message saying so
  else {
    dmarcFailureTable = (
      <Heading as="h3" size="lg">
        * <Trans>No data for the DMARC Failures by IP Address table</Trans> *
      </Heading>
    )
  }

  const tableDisplay = (
    <ErrorBoundary FallbackComponent={ErrorFallbackMessage}>
      <Accordion allowMultiple defaultIndex={[0, 1, 2, 3]}>
        <AccordionItem buttonLabel="Fully Aligned by IP Address">
          {fullPassTable}
        </AccordionItem>
        <AccordionItem buttonLabel="DKIM Failures by IP Address">
          {dkimFailureTable}
        </AccordionItem>
        <AccordionItem buttonLabel="SPF Failures by IP Address">
          {spfFailureTable}
        </AccordionItem>
        <AccordionItem buttonLabel="DMARC Failures by IP Address">
          {dmarcFailureTable}
        </AccordionItem>
      </Accordion>
    </ErrorBoundary>
  )

  return (
    <Box width="100%" px="2" mx="auto" overflow="hidden" pb="4">
      <Box d={{ md: 'grid' }} gridTemplateColumns={{ md: '1fr 1fr 1fr' }}>
        <Box />
        <Heading as="h1" textAlign="center">
          {domainSlug.toUpperCase()}
        </Heading>
        <Link
          color="teal.600"
          whiteSpace="noWrap"
          my="auto"
          to={`/domains/${domainSlug}`}
          as={RouteLink}
          d="block"
          width="100%"
          textAlign={{ base: 'center', md: 'right' }}
        >
          <Trans>Guidance</Trans>
          <LinkIcon ml="4px" aria-hidden="true" />
        </Link>
      </Box>

      {graphDisplay}

      <Flex align="center" mb={2}>
        <Text
          as="label"
          htmlFor="data-date-range"
          fontWeight="bold"
          textAlign="center"
          mr={1}
        >
          <Trans>Showing data for period: </Trans>
        </Text>
        <Select
          id="data-date-range"
          aria-label="date range for table data"
          width="fit-content"
          onChange={(e) => handleChange(e)}
          value={selectedDate}
        >
          {options}
        </Select>
      </Flex>

      {tableDisplay}
    </Box>
  )
}

DmarcReportPage.propTypes = {
  // Need to allow summaryList ResponsiveContainer width as a set number for tests to work
  summaryListResponsiveWidth: number,
}