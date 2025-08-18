import { MeDocument, MeQuery, Role, useUpdateUserMutation } from '@nestled-template/shared/sdk'
import React, { useEffect, useState } from 'react'
import { cleanDatabaseOutput, cleanFormInput, usaStates } from '@nestled-template/shared/utils'
import toast from 'react-hot-toast'
import { WebUiContainer, WebUiLoading } from '@nestled-template/web-ui'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { bizTheme } from '@nestled-template/shared/styles'
import type { QueryRef } from '@apollo/client'
import { useApolloClient, useReadQuery } from '@apollo/client'
import { useMatches, useRevalidator } from 'react-router'

export default function EditMyProfile() {
  const [loading, setLoading] = useState(false)
  // Read from cache seeded by parent layout loader
  const matches = useMatches()
  const client = useApolloClient()
  const revalidator = useRevalidator()
  const meRef = (matches.find(m => (m.data as any)?.meRef)?.data as any)?.meRef as QueryRef<MeQuery>
  const { data } = useReadQuery<MeQuery>(meRef)
  const [updateUser] = useUpdateUserMutation()
  const [isOtherSelected, setIsOtherSelected] = useState(false)

  const [currentEmail, setCurrentEmail] = useState('')
  const [currentPhone, setCurrentPhone] = useState('')
  const [currentCell, setCurrentCell] = useState('')
  const [currentAddress, setCurrentAddress] = useState('')
  const [currentAddress2, setCurrentAddress2] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [currentState, setCurrentState] = useState('')
  const [currentZip, setCurrentZip] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [addressChanges, setAddressChanges] = useState(false)
  const [vet, setVet] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setVet((data?.me as any)?.vet ?? false)
  }, [data?.me])

  useEffect(() => {
    if (!initialized) return
    if (
      isEquivalent((data?.me as any)?.phone, currentPhone) &&
      isEquivalent(data?.me?.email, currentEmail) &&
      isEquivalent((data?.me as any)?.cell, currentCell) &&
      isEquivalent((data?.me as any)?.address, currentAddress) &&
      isEquivalent((data?.me as any)?.address2, currentAddress2) &&
      isEquivalent((data?.me as any)?.city, currentCity) &&
      isEquivalent((data?.me as any)?.state, currentState) &&
      isEquivalent((data?.me as any)?.postcode, currentZip)
    ) {
      setAddressChanges(false)
    } else {
      setAddressChanges(true)
    }
  }, [
    data?.me,
    currentAddress,
    currentAddress2,
    currentCell,
    currentEmail,
    currentPhone,
    currentZip,
    currentCity,
    currentState,
    vet,
    initialized,
  ])

  const me = data?.me
  const isAdmin = (me as any)?.role === Role.Admin

  // Create form fields using FormFieldClass
  const updateAccountFields = [
    // Section: Personal Details
    FormFieldClass.content('hdrPersonal', {
      content: <h3 className="text-lg font-semibold mt-6 mb-2">Personal Details</h3>,
    }),
    // Personal Details
    FormFieldClass.text('firstName', { label: 'First name', disabled: !isAdmin }),
    FormFieldClass.text('lastName', { label: 'Last name', disabled: !isAdmin }),
    FormFieldClass.email('email', { label: 'Email', required: true }),
    FormFieldClass.textArea('bio', { label: 'Short Bio' }),
    FormFieldClass.phone('phone', { label: 'Phone' }),
    FormFieldClass.phone('cell', { label: 'Cell' }),
    FormFieldClass.text('address', { label: 'Address' }),
    FormFieldClass.text('address2', { label: 'Address 2' }),
    FormFieldClass.text('city', { label: 'City' }),
    FormFieldClass.text('postcode', { label: 'Postcode' }),
    FormFieldClass.select('state', {
      label: 'State / Province',
      required: true,
      options: usaStates,
    }),

    // Section: Military Status
    FormFieldClass.content('hdrMilitary', {
      content: <h3 className="text-lg font-semibold mt-6 mb-2">Military Status</h3>,
    }),
    FormFieldClass.checkbox('vet', { label: 'Have you ever served in the military?' }),
    FormFieldClass.checkbox('activeDuty', {
      label: 'Active Duty?',
      showWhen: values => values.vet === true,
    }),
    FormFieldClass.text('militaryBranch', {
      label: 'Military Branch Served',
      showWhen: values => values.vet === true,
    }),

    // Section: Social Media
    FormFieldClass.content('hdrSocial', {
      content: <h3 className="text-lg font-semibold mt-6 mb-2">Social Media</h3>,
    }),
    FormFieldClass.text('facebook', { label: 'Facebook' }),
    FormFieldClass.text('twitter', { label: 'Twitter' }),
    FormFieldClass.text('instagram', { label: 'Instagram' }),
    FormFieldClass.text('linkedin', { label: 'LinkedIn' }),
    FormFieldClass.text('youtube', { label: 'YouTube' }),
    FormFieldClass.text('website', { label: 'Website' }),

    // Section: Business
    FormFieldClass.content('hdrBusiness', {
      content: <h3 className="text-lg font-semibold mt-6 mb-2">Business</h3>,
    }),
    FormFieldClass.text('company', { label: 'Company', disabled: !isAdmin }),
    FormFieldClass.text('industry', { label: 'Industry', disabled: !isAdmin }),

    // Section: Notification Preferences
    FormFieldClass.content('hdrNotifications', {
      content: <h3 className="text-lg font-semibold mt-6 mb-2">Notification Preferences</h3>,
    }),
    FormFieldClass.checkbox('notifyByEmail', { label: 'I want to receive email notifications' }),
    FormFieldClass.checkbox('notifyBySMS', {
      label: 'I want to receive text message notifications',
    }),
    FormFieldClass.checkbox('substitute', { label: 'I am available as a substitute' }),

    // Contact Change Reason (conditional)
    ...(addressChanges
      ? [
          FormFieldClass.select('contactChangeReason', {
            label: 'Reason for change',
            required: addressChanges,
            options: [
              { label: 'Choose a reason', value: '' },
              {
                label: 'New company representative attending chapter meetings',
                value: 'new-company-representative-attending-chapter-meetings',
              },
              { label: "Attending member's name changed", value: 'attending-members-name-changed' },
              { label: "Company's name changed", value: 'companys-name-changed' },
              { label: 'Moved', value: 'moved' },
              { label: 'Basic data update', value: 'basic-data-update' },
              { label: 'Other', value: 'other' },
            ],
          }),
          FormFieldClass.textArea('contactChangeOther', {
            label: 'Other Reason:',
            hidden: !isOtherSelected,
            required: isOtherSelected,
          }),
        ]
      : []),

    // Submit button
    FormFieldClass.button('submit', { text: 'Update Profile', loading: loading, type: 'submit' }),
  ]

  useEffect(() => {
    setCurrentEmail(data?.me?.email ?? '')
    setCurrentPhone((data?.me as any)?.phone ?? '')
    setCurrentCell((data?.me as any)?.cell ?? '')
    setCurrentAddress((data?.me as any)?.address ?? '')
    setCurrentAddress2((data?.me as any)?.address2 ?? '')
    setCurrentCity((data?.me as any)?.city ?? '')
    setCurrentState((data?.me as any)?.state ?? '')
    setCurrentZip((data?.me as any)?.postcode ?? '')
    setIsOtherSelected(false)
    setInitialized(Boolean(data?.me))
  }, [data?.me])

  function isEquivalent(
    value1: string | null | undefined,
    value2: string | null | undefined,
  ): boolean {
    const normalizedValue1 = value1 === null || value1 === undefined ? '' : value1
    const normalizedValue2 = value2 === null || value2 === undefined ? '' : value2

    return normalizedValue1 === normalizedValue2
  }

  function defaultValues() {
    if (data?.me) {
      const cleaned = cleanDatabaseOutput(data.me, updateAccountFields, [
        'avatarUrl',
        'name',
        'chapter',
        'isLeader',
        'testimonialsFrom',
        'testimonialsTo',
      ])
      // Ensure the state matches select option values. If the state is a label, map to its value code.
      const stateVal = cleaned.state
      if (typeof stateVal === 'string') {
        let norm = stateVal.trim()
        // Handle values like "US-AL" → "AL"
        if (norm.includes('-')) {
          const parts = norm.split('-')
          norm = parts[parts.length - 1]
        }
        const upper = norm.toUpperCase()
        const byValue = usaStates.find(s => s.value === upper)
        if (byValue) {
          cleaned.state = byValue.value
        } else {
          const byLabel = usaStates.find(s => s.label.toLowerCase() === norm.toLowerCase())
          if (byLabel) cleaned.state = byLabel.value
        }
      }
      // Explicitly set checkbox defaults so they always appear in defaultValues
      const rawVet = (data.me as any)?.vet
      cleaned.vet =
        typeof rawVet === 'boolean'
          ? rawVet
          : typeof rawVet === 'string'
            ? ['true', '1', 'yes', 'y'].includes(rawVet.toLowerCase())
            : typeof rawVet === 'number'
              ? rawVet === 1
              : false

      return cleaned
    }
    return undefined
  }

  async function handleSubmit(values: any) {
    if (!data?.me?.id) {
      toast.error('User not found')
      return
    }

    setLoading(true)
    setShowMessage(false)

    const cleanedValues = cleanFormInput(values, updateAccountFields)

    if (addressChanges) {
      setShowMessage(true)
    }

    try {
      await updateUser({
        variables: {
          userId: data.me.id,
          input: {
            ...cleanedValues,
          },
        },
      })
      // Keep SSR/client in sync
      await client.refetchQueries({ include: [MeDocument] })
      revalidator.revalidate()
      window.scrollTo(0, 0)
      toast.success('Account updated')
      setLoading(false)
    } catch (err: unknown) {
      console.error('UpdateUser error:', err)
      toast.error(`There was an error. Please report this issue.`)
      setLoading(false)
    }
  }

  return loading ? (
    <WebUiLoading />
  ) : (
    <WebUiContainer>
      {/* Email change notice */}
      {!isEquivalent(data?.me?.email, currentEmail) && currentEmail && (
        <div className="rounded-md bg-blue-50 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className={'text-sm font-bold text-sky-700'}>
                Please remember that changing your email will also change your login credentials
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address change notice */}
      {showMessage && (
        <div className="rounded-md bg-yellow-50 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Your changes have been updated!
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className={'text-sm'}>
                  <strong>Please note:</strong> If this update is due to a new company
                  representative attending chapter meetings, the attending member's name changed, or
                  the company's name changed, a member update form is required. A member of the Biz
                  A-Team will email the form to the address in your member profile via Adobe Sign
                  within the next 1 - 2 business days. This form must be completed to update the
                  additional legal information for your membership including; member name, company
                  name and industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        theme={bizTheme}
        id="edit-profile-form"
        fields={updateAccountFields}
        submit={handleSubmit}
        defaultValues={defaultValues()}
        key={data?.me?.id ?? 'loading'}
      />
    </WebUiContainer>
  )
}
