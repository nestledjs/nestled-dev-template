import React, { Fragment, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { WebUiLoading, WebUiAvatar } from '@nestled-template/web-ui'
import {
  Role,
  useUserQuery
} from '@nestled-template/shared/sdk'
import { useGlobalCtx } from '@nestled-template/web'
import { ensureHttpsProtocol } from '@nestled-template/shared/utils'
import {
  BriefcaseIcon,
  ChevronDownIcon,
  ClockIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  PencilIcon,
  PhoneIcon,
  ShareIcon,
  StarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import {
  ShareActionModal,
  ReferralActionModal,
  PowerHourActionModal,
  TestimonialActionModal
} from '@nestled-template/web'

export default function MemberProfile() {
  const params = useParams()
  const { user: currentUser } = useGlobalCtx()
  const [expanded, setExpanded] = React.useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const [referralOpen, setReferralOpen] = useState(false)
  const [powerHourOpen, setPowerHourOpen] = useState(false)
  const [testimonialOpen, setTestimonialOpen] = useState(false)

  const { data, loading } = useUserQuery({
    variables: {
      userId: params.memberId ?? 'NoId',
    },
    skip: !params.memberId,
  })

  const user = data?.user
  const isAdmin = currentUser?.role === Role.Admin

  if (loading) {
    return <WebUiLoading />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Member not found</div>
      </div>
    )
  }

  return (
    <div className={'lg:flex w-full'}>
      <div className={'p-6 bg-sky-600 w-full lg:w-4/12 2xl:w-3/12 2xl:p-10 h-full lg:min-h-screen text-center'}>
        <div className={`${expanded ? '' : 'hidden lg:block'}`}>
          {isAdmin && user?.id ? (
            <div className={'w-64 h-64 rounded-full overflow-hidden mx-auto relative'}>
              {/* TODO: Implement WebUiImageUpload when available */}
              <WebUiAvatar
                src={user?.avatarUrl || ''}
                size={'xxl'}
                name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                placeholder={'initials'}
              />
              <PencilIcon className={'text-white absolute bottom-2 left-1/2 -ml-3 h-6 w-6 pointer-events-none'} />
            </div>
          ) : (
            <WebUiAvatar
              src={user?.avatarUrl || ''}
              size={'xxl'}
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              placeholder={'initials'}
            />
          )}

          <div>
            <h1 className={'font-sans text-white mt-6'}>
              {user?.firstName} {user?.lastName}
            </h1>
            <h3 className={'font-sans text-zinc-200 mb-4'}>{user?.company}</h3>

            {/* TODO: Implement WebUiSocialLinks when available */}

            <Menu as="div" className="relative inline-block text-left mt-6">
              <div>
                <MenuButton
                  key={'actions'}
                  id={`${user?.id}-actions`}
                  className="bg-white rounded-lg p-2 pl-4 hover:bg-gray-200 transition duration-150 flex items-center space-x-2"
                >
                  <span>Member Actions</span>
                  <ChevronDownIcon className="w-6 h-6" />
                </MenuButton>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          key={'share-contact'}
                          onClick={() => setShareOpen(true)}
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm w-full text-left',
                          )}
                        >
                          <ShareIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Share Contact
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          key={'send-referral'}
                          onClick={() => setReferralOpen(true)}
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm w-full text-left',
                          )}
                        >
                          <PaperAirplaneIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Send a Referral
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          key={'power-hour'}
                          onClick={() => setPowerHourOpen(true)}
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm w-full text-left',
                          )}
                        >
                          <ClockIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Add Power Hour
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          key={'give-testimonial'}
                          onClick={() => setTestimonialOpen(true)}
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm w-full text-left',
                          )}
                        >
                          <StarIcon
                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Give a Testimonial
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            <div className={'grid md:grid-cols-2 lg:grid-cols-1'}>
              <ul className={'text-white space-y-4 mt-8'}>
                <li className="flex items-center space-x-3 py-2">
                  <UserGroupIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{user?.chapter?.chapter?.name}</div>
                  </div>
                </li>
                <li className="flex items-center space-x-3 py-2">
                  <BriefcaseIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{user?.industry}</div>
                  </div>
                </li>
              </ul>

              <ul className={'text-white space-y-4 mt-4 md:mt-8 lg:mt-4'}>
                {user?.website ? (
                  <li className="flex items-center space-x-3 py-2">
                    <GlobeAltIcon className={'h-6 w-6 text-white'} />
                    <div>
                                              <a className="text-lg text-zinc-200" target="_blank" href={ensureHttpsProtocol(user?.website)} rel="noopener noreferrer">
                        {user?.website}
                      </a>
                    </div>
                  </li>
                ) : null}
                <li className="flex items-center space-x-3 py-2">
                  <EnvelopeIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <a className="text-lg text-zinc-200" href={`mailto:${user?.email}`}>
                      {user?.email}
                    </a>
                  </div>
                </li>
                {user?.phone ? (
                  <li className="flex items-center space-x-3 py-2">
                    <PhoneIcon className={'h-6 w-6 text-white'} />
                    <div>
                      <a href={`tel:${user?.phone}`} className="text-lg text-zinc-200">
                        {user?.phone}
                      </a>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className={`${expanded ? 'hidden' : 'flex lg:hidden'}`}>
          <h4 className={'text-white font-semibold inline-flex'} onClick={() => setExpanded(true)}>
            <ChevronLeftIcon className={'h-6 w-6 mr-4'} /> {' Back to Dashboard'}
          </h4>
        </div>
      </div>

      <div className={`bg-zinc-100 flex flex-col flex-grow flex-1`}>
        <Outlet />
      </div>

      <ShareActionModal member={user as any ?? {}} open={shareOpen} setOpen={setShareOpen} />
      <ReferralActionModal member={user as any ?? {}} open={referralOpen} setOpen={setReferralOpen} />
      <PowerHourActionModal member={user as any ?? {}} open={powerHourOpen} setOpen={setPowerHourOpen} />
      <TestimonialActionModal member={user as any ?? {}} open={testimonialOpen} setOpen={setTestimonialOpen} />
    </div>
  )
}
