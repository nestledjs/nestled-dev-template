import React from 'react'
import { PublicSubmitFormInput, useSubmitFormMutation } from '@nestled-template/shared/sdk'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router'
import { Form, FormFieldClass, RenderFormField } from '@nestledjs/forms'
import { bizTheme } from '@nestled-template/shared/styles'

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  questions: string
}

export default function Contact() {
  const [submitForm, { loading }] = useSubmitFormMutation()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const isSubmittingRef = React.useRef(false)
  const navigate = useNavigate()

  const handleSubmit = React.useCallback(
    async (values: ContactFormData) => {
      // Extra robust double-submission prevention using ref
      if (isSubmitting || loading || isSubmittingRef.current) {
        console.log('Submission already in progress, ignoring...')
        return
      }

      console.log('Starting form submission...')
      setIsSubmitting(true)
      isSubmittingRef.current = true

      try {
        const formInput: PublicSubmitFormInput = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          questions: values.questions,
        }

        console.log('Calling submitForm mutation...')
        await submitForm({
          variables: {
            input: formInput,
          },
        })

        console.log('Submission successful, navigating...')
        // Reset state before navigation
        setIsSubmitting(false)
        isSubmittingRef.current = false
        navigate('/request-received')
      } catch (error) {
        console.error('Form submission failed:', error)
        setIsSubmitting(false) // Reset if there's an error
        isSubmittingRef.current = false
      }
    },
    [isSubmitting, loading, submitForm, navigate],
  )

  const fields = [
    FormFieldClass.text('firstName', {
      label: 'First Name',
      required: true,
      wrapperClassName: 'col-span-1',
    }),
    FormFieldClass.text('lastName', {
      label: 'Last Name',
      required: true,
      wrapperClassName: 'col-span-1',
    }),
    FormFieldClass.email('email', {
      label: 'Email Address',
      required: true,
      wrapperClassName: 'col-span-1',
    }),
    FormFieldClass.phone('phone', {
      label: 'Mobile Phone',
      required: true,
      wrapperClassName: 'col-span-1',
    }),
    FormFieldClass.textArea('questions', {
      label: 'Message',
      required: true,
      wrapperClassName: 'col-span-2',
    }),
    FormFieldClass.button('submit', {
      label: 'Submit',
      text: isSubmitting ? 'Sending...' : 'Get in Touch!',
      loading: loading || isSubmitting,
      type: 'submit',
      disabled: isSubmitting,
    }),
  ]

  return (
    <div className="relative isolate bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-slate-100 ring-1 ring-gray-900/10 lg:w-1/2"></div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Need Further Assistance?
            </h2>
            <p className={'text-base text-slate-800 mt-6'}>
              Please reach out and a member of the Biz A-Team will be happy to help!
            </p>

            <dl className="mt-4 mb-6 space-y-4 text-base leading-7 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-gray-900" href="tel:+1 877-224-9224">
                    +1 877-224-9224
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-gray-900" href="mailto:info@nestled-template.com">
                    info@nestled-template.com
                  </a>
                </dd>
              </div>
            </dl>
            <Link className={'text-sky-700'} to={'/directory/chapters'}>
              Or click here to find a chapter near you
            </Link>
          </div>
        </div>
        <Form
          id="contact-form"
          className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48"
          theme={bizTheme}
          submit={handleSubmit}
          defaultValues={{ firstName: '', lastName: '', email: '', phone: '', questions: '' }}
        >
          <div className="grid grid-cols-2 gap-4">
            {fields.map(field => (
              <RenderFormField key={field.key} field={field} />
            ))}
          </div>
        </Form>
      </div>
    </div>
  )
}
