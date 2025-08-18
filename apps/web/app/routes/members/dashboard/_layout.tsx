import React, { Fragment, useEffect } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { Link, Outlet, useMatches, useOutletContext, useSearchParams } from 'react-router'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { WebUiAvatar, WebUiNavBox, WebUiSvgIcon } from '@nestled-template/web-ui'
import { useMeCountsQuery, useMySubstitutesQuery } from '@nestled-template/shared/sdk'
import { useGlobalCtx } from '@nestled-template/web'
import dayjs from 'dayjs'
import { clsx } from 'clsx'
import utc from 'dayjs/plugin/utc'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import Cookies from 'js-cookie'

dayjs.extend(utc)

type DashboardContextType = { refetchCounts: () => void }

export default function Members() {
  const { user } = useGlobalCtx()
  const { data: countData, refetch: refetchCounts } = useMeCountsQuery()
  // Using the proper mySubstitutes query
  const { data: substitutesData } = useMySubstitutesQuery({
    variables: { input: {} },
  })
  const substituteCount = substitutesData?.counters?.count ?? 0
  const [expanded, setExpanded] = React.useState(true)
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (user?.isLeader) {
      Cookies.set(
        '__leaderChapter',
        JSON.stringify({
          id: user?.chapter?.chapter?.id,
          name: user?.chapter?.chapter?.name,
        }),
      )
    }
  }, [user])

  useEffect(() => {
    if (searchParams.get('expanded') === 'false') {
      setExpanded(false)
    } else if (searchParams.get('expanded') === 'true') {
      setExpanded(true)
    }
  }, [searchParams])

  const path = matches.slice(-1)[0].pathname
  const me = user
  const counts = countData?.meCounts

  const dollarUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className={'lg:flex w-full'}>
      <div
        className={clsx(
          'flex flex-col p-6 bg-sky-600 w-full lg:w-1/2 2xl:w-5/12 ',
          expanded ? 'min-h-screen h-full' : '',
        )}
      >
        <div className={clsx(expanded ? '' : 'hidden lg:block')}>
          <div className={'flex items-center flex-col'}>
            <h1 className={'text-white text-3xl font-bold'}>Member Center Dashboard</h1>
            <h2 className={'text-white text-xl font-bold'}>Welcome, {me?.firstName}</h2>

            <Menu as="div" id={'new-items-menu'} className="relative inline-block text-left align">
              <div>
                <MenuButton
                  id={'menu-button'}
                  className="flex items-center rounded-full pl-1 pr-4 my-4 bg-gray-100 text-orange-500 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  <span className="sr-only">Open options</span>
                  <PlusCircleIcon className="h-12 w-12" aria-hidden="true" /> Actions ...
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
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/members/dashboard/new-biz"
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                          onClick={() => setExpanded(false)}
                        >
                          New $ in Biz
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/members/dashboard/new-referral"
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                          onClick={() => setExpanded(false)}
                        >
                          New Referral
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/members/dashboard/new-power-hour"
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                          onClick={() => setExpanded(false)}
                        >
                          New Power Hour
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/members/find-a-substitute"
                          className={clsx(
                            focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          Request a Substitute
                        </Link>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            <WebUiNavBox
              linkTo={`/members/dashboard`}
              active={path === '/members/dashboard'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'messages'} />

              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>
                  {counts?.messagesCount ?? 0}
                </h4>
                <p className={'text-lg text-white'}>Messages</p>
              </div>
            </WebUiNavBox>
            <WebUiNavBox
                      linkTo={`/members/dashboard/biz`}
        active={path === '/members/dashboard/biz'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'biz'} />

              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>$ In Biz</h4>
                <p className={'text-lg text-white leading-none'}>
                  {dollarUS.format(counts?.bizSum ?? 0)}
                </p>
              </div>
            </WebUiNavBox>
                                      <WebUiNavBox
              linkTo={`/members/dashboard/my-referrals`}
              active={path === '/members/dashboard/my-referrals'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'referrals-in'} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>
                  {counts?.myReferralsCount ?? 0}
                </h4>
                <p className={'text-lg text-white leading-none'}>My Referrals</p>
              </div>
            </WebUiNavBox>
                                      <WebUiNavBox
              linkTo={`/members/dashboard/referrals-sent`}
              active={path === '/members/dashboard/referrals-sent'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'referrals-out'} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>
                  {counts?.referralsSentCount ?? 0}
                </h4>
                <p className={'text-lg text-white leading-none'}>Referrals Sent</p>
              </div>
            </WebUiNavBox>
                                      <WebUiNavBox
              linkTo={`/members/dashboard/substitute-requests`}
              active={path === '/members/dashboard/substitute-requests'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'Substitute'} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>{substituteCount}</h4>
                <p className={'text-lg text-white leading-none'}>Substitute Requests</p>
              </div>
            </WebUiNavBox>
                                      <WebUiNavBox
              linkTo={`/members/dashboard/power-hours`}
              active={path === '/members/dashboard/power-hours'}
              onClick={() => setExpanded(false)}
            >
              <WebUiSvgIcon type={'PowerHour'} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>
                  {counts?.powerHoursCount ?? 0}
                </h4>
                <p className={'text-lg text-white leading-none'}>Power Hours</p>
              </div>
            </WebUiNavBox>

            <WebUiNavBox linkTo={`/members/member-awards`}>
              <WebUiSvgIcon type={'attendance'} size={'54'} />

              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-3xl font-semibold text-white'}>Biztastic</h4>
                <p className={'text-lg text-white leading-none'}>Member Awards</p>
              </div>
            </WebUiNavBox>
            <WebUiNavBox linkTo={`/members/my-profile`}>
              <WebUiAvatar size={'lg'} src={me?.avatarUrl || ''} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-lg font-semibold text-white leading-none'}>
                  {me?.firstName} {me?.lastName}
                </h4>
                <p className={'text-sm text-white leading-none'}>
                  Renews: {dayjs.utc(me?.renewalDate).format('M.D.YY')}
                </p>
              </div>
            </WebUiNavBox>
            <WebUiNavBox linkTo={`/members/chapter/${me?.chapter?.chapter?.id}`}>
              <WebUiSvgIcon type={'chapter'} size={50} />
              <div className={'min-w-[60%] max-w-[60%]'}>
                <h4 className={'text-lg font-semibold text-white leading-none'}>
                  {me?.chapter?.chapter?.name}
                </h4>
                {/*<p className={'text-sm text-white'}>{'Second Line of Text'}</p>*/}
              </div>
            </WebUiNavBox>
          </div>
        </div>

        <div className={`${expanded ? 'hidden' : 'flex lg:hidden'}`}>
          <h4 className={'text-white font-semibold inline-flex'} onClick={() => setExpanded(true)}>
            <ChevronLeftIcon className={'h-6 w-6 mr-4'} /> {' Back to Dashboard'}
          </h4>
        </div>
      </div>

      <div
        className={`h-full p-6 lg:p-8 bg-zinc-100 flex flex-grow flex-1 ${expanded ? 'hidden lg:flex' : ''}`}
      >
        <Outlet context={{ refetchCounts } satisfies DashboardContextType} />
      </div>
    </div>
  )
}

export function useDashboardContext() {
  return useOutletContext<DashboardContextType>()
}
