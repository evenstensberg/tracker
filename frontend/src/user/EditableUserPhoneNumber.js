import React, { useRef, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { PhoneIcon } from '../theme/Icons'
import { Formik } from 'formik'
import { t, Trans } from '@lingui/macro'
import { useMutation } from '@apollo/client'
import { string } from 'prop-types'

import { PhoneNumberField } from '../components/fields/PhoneNumberField'

import { AuthenticateField } from '../components/fields/AuthenticateField'
import { createValidationSchema } from '../utilities/fieldRequirements'
import { SET_PHONE_NUMBER, VERIFY_PHONE_NUMBER } from '../graphql/mutations'
import { EditIcon } from '@chakra-ui/icons'

export function EditableUserPhoneNumber({ detailValue, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const initialFocusRef = useRef()
  const verifyRef = useRef()

  const [phoneCodeSent, setPhoneCodeSent] = useState(false)

  const [setPhoneNumber, { error: _setPhoneNumberError }] = useMutation(
    SET_PHONE_NUMBER,
    {
      onError: ({ message }) => {
        toast({
          title: t`An error occurred while updating your phone number.`,
          description: message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onCompleted({ setPhoneNumber }) {
        if (setPhoneNumber.result.__typename === 'SetPhoneNumberResult') {
          setPhoneCodeSent(true)
        } else if (setPhoneNumber.result.__typename === 'SetPhoneNumberError') {
          toast({
            title: t`Unable to update your phone number, please try again.`,
            description: setPhoneNumber.result.description,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        } else {
          toast({
            title: t`Incorrect send method received.`,
            description: t`Incorrect setPhoneNumber.result typename.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          console.log('Incorrect setPhoneNumber.result typename.')
        }
      },
    },
  )

  const [verifyPhoneNumber, { error: __verifyPhoneNumberError }] = useMutation(
    VERIFY_PHONE_NUMBER,
    {
      onError: ({ message }) => {
        toast({
          title: t`An error occurred while verifying your phone number.`,
          description: message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onCompleted({ verifyPhoneNumber }) {
        if (verifyPhoneNumber.result.__typename === 'VerifyPhoneNumberResult') {
          toast({
            title: t`Changed User Phone Number`,
            description: t`You have successfully updated your phone number.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          onClose()
          setPhoneCodeSent(false)
        } else if (
          verifyPhoneNumber.result.__typename === 'VerifyPhoneNumberError'
        ) {
          toast({
            title: t`Unable to verify your phone number, please try again.`,
            description: verifyPhoneNumber.result.description,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        } else {
          toast({
            title: t`Incorrect send method received.`,
            description: t`Incorrect verifyPhoneNumber.result typename.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          console.log('Incorrect verifyPhoneNumber.result typename.')
        }
      },
    },
  )

  const setPhoneModal = (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent pb="4">
        <Formik
          key="setPhoneNumberFormKey"
          validateOnBlur={false}
          initialValues={{
            phoneNumber: '',
          }}
          validationSchema={createValidationSchema(['phoneNumber'])}
          onSubmit={async (values) => {
            // Submit update detail mutation
            await setPhoneNumber({
              variables: {
                phoneNumber: '+' + values.phoneNumber,
              },
            })
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form id="form" onSubmit={handleSubmit}>
              <ModalHeader>
                <Trans>Edit Phone Number</Trans>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing="4" p="6">
                  {detailValue && (
                    <Stack>
                      <Heading as="h3" size="sm">
                        <Trans>Current Phone Number:</Trans>
                      </Heading>

                      <Text>{detailValue}</Text>
                    </Stack>
                  )}

                  <PhoneNumberField
                    name="phoneNumber"
                    label={t`New Phone Number:`}
                  />
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  type="submit"
                  mr="4"
                >
                  <Trans>Confirm</Trans>
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )

  const verifyPhoneModal = (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent pb="4">
        <Formik
          key="verifyPhoneNumberFormKey"
          validateOnBlur={false}
          initialValues={{
            twoFactorCode: '',
          }}
          validationSchema={createValidationSchema(['twoFactorCode'])}
          onSubmit={async (values) => {
            // Submit update detail mutation
            await verifyPhoneNumber({
              variables: {
                twoFactorCode: parseInt(values.twoFactorCode),
              },
            })
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form id="form" onSubmit={handleSubmit}>
              <ModalHeader>
                <Trans>Verify</Trans>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing="4" p="6">
                  <AuthenticateField
                    mb="4"
                    sendMethod={'verifyPhone'}
                    ref={verifyRef}
                  />
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="primary"
                  isLoading={isSubmitting}
                  type="submit"
                  mr="4"
                >
                  <Trans>Confirm</Trans>
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )

  const modalContent = phoneCodeSent ? verifyPhoneModal : setPhoneModal

  return (
    <Box {...props}>
      <Heading as="h3" size="md" mb="1">
        <Trans>Phone Number:</Trans>
      </Heading>

      <Flex
        align="center"
        borderWidth="1px"
        borderColor="gray.500"
        rounded="md"
        p="1"
      >
        <PhoneIcon mr="2" ml="1" boxSize="1.2rem" aria-hidden="true" />
        {detailValue ? (
          <Text>{detailValue}</Text>
        ) : (
          <Trans>No current phone number</Trans>
        )}
        <Button
          aria-label="Edit User Phone Number"
          variant="primary"
          ml="auto"
          onClick={onOpen}
          fontSize="sm"
          px="3"
        >
          <EditIcon color="white" mr="2" boxSize="1rem" />
          <Trans>Edit</Trans>
        </Button>
      </Flex>
      {modalContent}
    </Box>
  )
}

EditableUserPhoneNumber.propTypes = {
  detailValue: string,
}
