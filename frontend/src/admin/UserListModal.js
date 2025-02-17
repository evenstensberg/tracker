import React, { useRef } from 'react'
import {
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
  Select,
  Text,
} from '@chakra-ui/react'
import { t, Trans } from '@lingui/macro'
import { Formik } from 'formik'
import { useMutation } from '@apollo/client'
import { bool, func, string } from 'prop-types'

import { EmailField } from '../components/fields/EmailField'
import {
  UPDATE_USER_ROLE,
  INVITE_USER_TO_ORG,
  REMOVE_USER_FROM_ORG,
} from '../graphql/mutations'
import { createValidationSchema } from '../utilities/fieldRequirements'

export function UserListModal({
  isOpen,
  onClose,
  orgId,
  editingUserRole,
  editingUserName,
  editingUserId,
  orgSlug,
  orgName,
  mutation,
  permission,
}) {
  const toast = useToast()
  const initialFocusRef = useRef()

  const [addUser, { loading: _addUserLoading }] = useMutation(
    INVITE_USER_TO_ORG,
    {
      refetchQueries: ['PaginatedOrgAffiliations', 'FindAuditLogs'],
      awaitRefetchQueries: true,

      onError(error) {
        toast({
          title: t`An error occurred.`,
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onCompleted({ inviteUserToOrg }) {
        if (inviteUserToOrg.result.__typename === 'InviteUserToOrgResult') {
          toast({
            title: t`User invited`,
            description: t`Email invitation sent`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          onClose()
        } else if (inviteUserToOrg.result.__typename === 'AffiliationError') {
          toast({
            title: t`Unable to invite user.`,
            description: inviteUserToOrg.result.description,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        } else {
          toast({
            title: t`Incorrect send method received.`,
            description: t`Incorrect inviteUserToOrg.result typename.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        }
      },
    },
  )

  const [updateUserRole, { loading: _updateLoading, error: _updateError }] =
    useMutation(UPDATE_USER_ROLE, {
      refetchQueries: ['FindMyUsers', 'FindAuditLogs'],
      awaitRefetchQueries: true,

      onError(updateError) {
        toast({
          title: updateError.message,
          description: t`Unable to change user role, please try again.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onCompleted({ updateUserRole }) {
        if (updateUserRole.result.__typename === 'UpdateUserRoleResult') {
          toast({
            title: t`Role updated`,
            description: t`The user's role has been successfully updated`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
          onClose()
        } else if (updateUserRole.result.__typename === 'AffiliationError') {
          toast({
            title: t`Unable to update user role.`,
            description: updateUserRole.result.description,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        } else {
          toast({
            title: t`Incorrect send method received.`,
            description: t`Incorrect updateUserRole.result typename.`,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        }
      },
    })

  const [removeUser, { loading: _removeUserLoading }] = useMutation(
    REMOVE_USER_FROM_ORG,
    {
      refetchQueries: ['FindMyUsers', 'FindAuditLogs'],
      awaitRefetchQueries: true,

      onError(error) {
        toast({
          title: t`An error occurred.`,
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-left',
        })
      },
      onCompleted({ removeUserFromOrg }) {
        if (removeUserFromOrg.result.__typename === 'RemoveUserFromOrgResult') {
          onClose()
          toast({
            title: t`User removed.`,
            description: t`Successfully removed user ${removeUserFromOrg.result.user.userName}.`,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        } else if (removeUserFromOrg.result.__typename === 'AffiliationError') {
          toast({
            title: t`Unable to remove user.`,
            description: removeUserFromOrg.result.description,
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-left',
          })
        }
      },
    },
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent pb={4}>
        <Formik
          validateOnBlur={false}
          initialValues={{
            role: editingUserRole,
            email: editingUserName,
          }}
          validationSchema={createValidationSchema(['email'])}
          onSubmit={async (values) => {
            // Submit update role mutation
            if (mutation === 'update') {
              await updateUserRole({
                variables: {
                  orgId: orgId,
                  role: values.role,
                  userName: values.email,
                },
              })
            } else if (mutation === 'create') {
              await addUser({
                variables: {
                  orgId: orgId,
                  requestedRole: values.role,
                  userName: values.email,
                  preferredLang: 'ENGLISH',
                },
              })
            } else if (mutation === 'remove') {
              removeUser({
                variables: {
                  userId: editingUserId,
                  orgId: orgId,
                },
              })
            }
          }}
        >
          {({ handleSubmit, handleChange, isSubmitting }) => (
            <form id="form" onSubmit={handleSubmit}>
              <ModalHeader>
                {mutation === 'update' ? (
                  <Trans>Edit User</Trans>
                ) : mutation === 'remove' ? (
                  <Trans>Remove User</Trans>
                ) : (
                  <Trans>Add User</Trans>
                )}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {mutation === 'create' ? (
                  <EmailField />
                ) : (
                  <Stack isInline align="center" mb="2">
                    <Text fontWeight="bold">
                      <Trans>User: </Trans>
                    </Text>
                    <Text>{editingUserName}</Text>
                  </Stack>
                )}
                {orgName && (
                  <Stack isInline align="center" mb="2">
                    <Text fontWeight="bold">
                      <Trans>Organization: </Trans>
                    </Text>
                    <Text>{orgName}</Text>
                  </Stack>
                )}
                {mutation !== 'remove' && (
                  <Stack isInline align="center">
                    <FormLabel htmlFor="role" fontWeight="bold" mt="2">
                      <Trans>Role:</Trans>
                    </FormLabel>
                    <Select
                      w="auto"
                      id="role"
                      size="sm"
                      name="role"
                      defaultValue={editingUserRole}
                      onChange={handleChange}
                    >
                      {(editingUserRole === 'USER' ||
                        (permission === 'SUPER_ADMIN' &&
                          editingUserRole === 'ADMIN')) && (
                        <option value="USER">{t`USER`}</option>
                      )}
                      {(editingUserRole === 'USER' ||
                        editingUserRole === 'ADMIN') && (
                        <option value="ADMIN">{t`ADMIN`}</option>
                      )}
                      {(editingUserRole === 'SUPER_ADMIN' ||
                        (permission === 'SUPER_ADMIN' &&
                          ['super-admin', 'sa'].includes(orgSlug))) && (
                        <option value="SUPER_ADMIN">{t`SUPER_ADMIN`}</option>
                      )}
                    </Select>
                  </Stack>
                )}
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
}

UserListModal.propTypes = {
  isOpen: bool,
  onClose: func,
  orgId: string,
  editingUserRole: string,
  editingUserName: string,
  editingUserId: string,
  orgSlug: string,
  orgName: string,
  mutation: string,
  permission: string,
}
