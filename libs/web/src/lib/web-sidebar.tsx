import React, {
  createElement,
  ForwardRefExoticComponent,
  Fragment,
  ReactElement,
  ReactNode,
  RefAttributes,
  SVGProps,
  useState,
  useEffect,
} from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { Link, Outlet, useMatches } from 'react-router'
import { useApolloClient } from '@apollo/client'
import { useEmulateUserMutation, User, UsersDocument } from '@nestled-template/shared/sdk'
import Cookies from 'js-cookie'
import { useAtom } from 'jotai/index'
import { leaderSelectedChapterAtom } from './global-storage'
import { getMobileSidebarHeaderText } from './mobile-sidebar-header'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'

export interface NavigationItem {
  name: string
  href: string
  icon:
    | ((props: IconProps) => ReactElement)
    | ForwardRefExoticComponent<
        Omit<SVGProps<SVGSVGElement>, 'ref'> & {
          title?: string
          titleId?: string
        } & RefAttributes<SVGSVGElement>
      >

  current: boolean
  hide?: boolean
}

interface IconProps {
  className: string
  'aria-hidden': boolean | undefined
}

function navigation(
  path: string,
  role: string,
  notificationCount: number,
  isLeader: boolean,
): NavigationItem[] {
  return [
    {
      name: role === 'Admin' ? 'Dashboard' : 'Member Center',
      href: '/members/dashboard?expanded=true',
      icon: HomeIcon,
      current: path.includes('dashboard'),
    },
    {
      name: 'Chapters',
      href: '/members/chapters',
      icon: UsersIcon,
      current: path.includes('chapters'),
    },
    {
      name: 'Members',
      href: '/members/members',
      icon: UserIcon,
      current: path.includes('members'),
    },
    {
      name: role === 'Admin' ? 'Resources' : 'Biz Connect Hub',
      href: 'https://resources.nestled-templatenow.com',
      icon: DocumentDuplicateIcon,
      current: false,
    },
    {
      name: 'Support',
      href: '/members/support',
      icon: QuestionMarkCircleIcon,
      current: path.includes('support'),
    },
    {
      name: 'Messages',
      href: '/members/dashboard?expanded=false',
      icon: (props: IconProps) => (
        <span className="relative inline-block">
          <BellIcon {...props} />
          {notificationCount > 0 ? (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
          ) : null}
        </span>
      ),
      current: false,
    },
    {
      name: 'Reports',
      href: role === 'Admin' ? '/admin/reports' : '/members/leaders',
      icon: role === 'Admin' ? ChartPieIcon : ChartBarIcon,
      current: role === 'Admin' ? path.includes('admin/reports') : path.includes('leaders'),
      hide: !(isLeader || role === 'Admin'),
    },
    {
      name: "Leaders' Reports",
      href: '/leaders',
      icon: ChartBarIcon,
      current: path.includes('leaders'),
      hide: role !== 'Admin',
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: PencilSquareIcon,
      current:
        path === '/admin' || (path.startsWith('/admin/') && !path.startsWith('/admin/reports')),
      hide: role !== 'Admin',
    },
    {
      name: 'Log Out',
      href: '/logout',
      icon: ArrowRightStartOnRectangleIcon,
      current: false,
    },
  ]
}

interface WebUiSidebarProps {
  logoIcon: string
  userAvatar?: string
  userName?: string
  role?: string
  user?: User
  isLeader?: boolean
  activeUser?: User
  children: ReactNode
}

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  setSidebarOpen: (open: boolean) => void
}

function NavigationLink({
  href,
  children,
  className,
  setSidebarOpen,
}: Readonly<NavigationLinkProps>) {
  const isExternal = /^https?:\/\//.test(href)

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setSidebarOpen(false)}
      >
        {children}
      </a>
    )
  } else {
    return (
      <Link to={href} className={className} onClick={() => setSidebarOpen(false)}>
        {children}
      </Link>
    )
  }
}

function SidebarNavigationList({
  items,
  setSidebarOpen,
  sidebarExpanded,
  activeUser,
  restoreAdminUser,
  role,
  setOpenEmulate,
}: Readonly<{
  items: NavigationItem[]
  setSidebarOpen: (open: boolean) => void
  sidebarExpanded?: boolean
  activeUser?: User
  restoreAdminUser?: () => void
  role?: string
  setOpenEmulate?: (open: boolean) => void
}>) {
  return (
    <ul className="-mx-2 space-y-2">
      {items.map(item => (
        <li key={item.name} className={clsx(item?.hide ? 'hidden' : '')}>
          <NavigationLink
            href={item.href}
            className={clsx(
              item.current
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
            )}
            setSidebarOpen={setSidebarOpen}
          >
            {typeof item.icon === 'function'
              ? item.icon({ className: 'h-6 w-6 shrink-0', 'aria-hidden': true })
              : createElement(item.icon, {
                  className: 'h-6 w-6 shrink-0',
                  'aria-hidden': true,
                })}
            {sidebarExpanded === undefined || sidebarExpanded ? item.name : null}
          </NavigationLink>
        </li>
      ))}
      {role === 'Admin' && !activeUser && setOpenEmulate ? (
        <li>
          <button
            className={clsx(
              'text-zinc-400 hover:text-white hover:bg-zinc-800',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
            )}
            onClick={() => setOpenEmulate(true)}
          >
            <UserIcon className={'h-6 w-6 shrink-0'} aria-hidden="true" />
            {sidebarExpanded === undefined || sidebarExpanded ? 'Emulate User' : null}
          </button>
        </li>
      ) : null}
      {activeUser && restoreAdminUser ? (
        <li>
          <button
            className={clsx(
              'text-zinc-400 hover:text-white hover:bg-zinc-800',
              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
            )}
            onClick={restoreAdminUser}
          >
            <ArrowLeftEndOnRectangleIcon className={'h-6 w-6 shrink-0'} aria-hidden="true" />
            {sidebarExpanded === undefined || sidebarExpanded ? 'Restore User' : null}
          </button>
        </li>
      ) : null}
    </ul>
  )
}

function SidebarProfileSection({
  userAvatar,
  userName,
  sidebarExpanded,
  setSidebarExpanded,
}: Readonly<{
  userAvatar?: string
  userName?: string
  sidebarExpanded: boolean
  setSidebarExpanded: (expanded: boolean) => void
}>) {
  return (
    <ul className="-mx-2 space-y-1">
      <li>
        <Link
          to={'/settings/profile'}
          className={clsx(
            'flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-zinc-800',
            sidebarExpanded ? '' : 'justify-center',
          )}
        >
          {userAvatar ? (
            <img className="h-8 w-8 rounded-full bg-zinc-800" src={userAvatar} alt={userName} />
          ) : (
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
          <span className="sr-only">Your profile</span>
          {sidebarExpanded ? <span aria-hidden="true">{userName}</span> : null}
        </Link>
      </li>
      <li>
        <span
          className={clsx(
            'flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-zinc-800',
            sidebarExpanded ? 'justify-end' : 'justify-center',
          )}
        >
          {sidebarExpanded ? (
            <ArrowLeftCircleIcon className={'h-8 w-8'} onClick={() => setSidebarExpanded(false)} />
          ) : (
            <ArrowRightCircleIcon className={'h-8 w-8'} onClick={() => setSidebarExpanded(true)} />
          )}
          <span className="sr-only">Expand Sidebar</span>
        </span>
      </li>
    </ul>
  )
}

export function WebSidebar(props: Readonly<WebUiSidebarProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const notificationCount = 0
  const matches = useMatches()
  const path = matches.slice(-1)[0].pathname
  const [emulateUserMutation] = useEmulateUserMutation()
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null)
  const [openEmulate, setOpenEmulate] = useState(false)
  const [, setActiveChapter] = useAtom(leaderSelectedChapterAtom)
  const apolloClient = useApolloClient()

  useEffect(() => {
    setIsClient(true)
  }, [])

  async function emulateUser(userId: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[WebSidebar emulateUser] start', { userId, hasPropsUser: !!props?.user })
    }
    if (!props?.user) {
      console.warn('[WebSidebar emulateUser] no props.user, aborting')
      return
    }

    // Use minimal data to avoid cookie size limits
    const minimalUserData = {
      id: props.user?.id,
      firstName: props.user?.firstName,
      lastName: props.user?.lastName,
      role: props.user?.role,
    }
    const minimalUserJson = JSON.stringify(minimalUserData)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[WebSidebar emulateUser] minimalUser prepared', minimalUserData)
    }

    const getCookieDomain = () => {
      const hostname = window.location.hostname
      // If localhost or an IP address, do not set domain
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]' ||
        /^[0-9.]+$/.test(hostname)
      ) {
        return undefined
      }
      // Otherwise, set the domain to the root domain (e.g., .example.com)
      const parts = hostname.split('.')
      if (parts.length >= 2) {
        return '.' + parts.slice(-2).join('.')
      }
      return hostname
    }

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieDomain = getCookieDomain()
    const cookieOptions = {
      path: '/',
      sameSite: 'lax' as const,
      secure: isProduction, // Only set secure: true in production
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('[WebSidebar emulateUser] cookie options', {
        isProduction,
        cookieDomain,
        cookieOptions,
      })
    }

    // Set the original user cookie for emulation state
    try {
      Cookies.set('__originalUser', minimalUserJson, cookieOptions)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSidebar emulateUser] set __originalUser cookie')
      }
    } catch (e) {
      console.error('[WebSidebar emulateUser] failed setting __originalUser cookie', e)
    }

    try {
      Cookies.remove('__leaderChapter')
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSidebar emulateUser] removed __leaderChapter cookie')
      }
    } catch (e) {
      console.error('[WebSidebar emulateUser] failed removing __leaderChapter cookie', e)
    }
    setActiveChapter(null)
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSidebar emulateUser] invoking emulateUserMutation', { userId })
      }
      const emulatedUser = await emulateUserMutation({ variables: { input: { userId: userId } } })
      if (process.env.NODE_ENV !== 'production') {
        console.log('[WebSidebar emulateUser] emulateUserMutation result', emulatedUser)
      }

      if (emulatedUser?.data?.loggedIn?.user) {
        const emulatedUserJson = JSON.stringify(emulatedUser.data.loggedIn.user)
        try {
          Cookies.set('__user', emulatedUserJson, cookieOptions)
          if (process.env.NODE_ENV !== 'production') {
            console.log('[WebSidebar emulateUser] set __user cookie for emulated user')
          }
        } catch (e) {
          console.error('[WebSidebar emulateUser] failed setting __user cookie', e)
        }

        try {
          await apolloClient.clearStore()
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[WebSidebar emulateUser] clearStore failed (continuing):', e)
          }
        }
        // Give cookies time to be persisted by the browser before a hard navigation
        setTimeout(() => {
          const cacheBuster = Date.now()
          const target = `/members/dashboard?__r=${cacheBuster}`
          if (process.env.NODE_ENV !== 'production') {
            console.log('[WebSidebar emulateUser] redirecting to', target)
          }
          window.location.replace(target)
        }, 200)
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[WebSidebar emulateUser] mutation completed without user in payload')
        }
      }
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (process.env.NODE_ENV !== 'production') {
        console.error('[WebSidebar emulateUser] error', e)
      }
      return { success: false, error: message }
    }
  }

  async function restoreAdminUser() {
    if (props?.activeUser) {
      const originalUserJson = Cookies.get('__originalUser')
      if (originalUserJson) {
        try {
          const originalUser = JSON.parse(originalUserJson)
          Cookies.remove('__leaderChapter')
          setActiveChapter(null)
          const restoredUser = await emulateUserMutation({
            variables: { input: { userId: originalUser.id } },
          })
          if (restoredUser?.data?.loggedIn?.user) {
            Cookies.set('__user', JSON.stringify(restoredUser.data.loggedIn.user))
            Cookies.remove('__originalUser')
            try {
              await apolloClient.clearStore()
            } catch (e) {
              console.warn('[WebSidebar restoreAdminUser] clearStore failed (continuing):', e)
            }
            // Redirect based on the original user's role
            if (originalUser.role === 'Admin') {
              window.location.href = '/admin'
            } else {
              window.location.href = '/members/dashboard'
            }
          }
        } catch (e: unknown) {
          console.error((e as Error).message)
          return { success: false, error: (e as Error).message }
        }
      }
    }
  }

  const headerText = getMobileSidebarHeaderText(path)
  const navItems = navigation(
    path,
    props?.role ?? 'Member',
    notificationCount,
    props?.isLeader ?? false,
  )

  return (
    <>
      {/* Openable sidebar for mobile */}
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 pb-2 ring-1 ring-white/10">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/">
                      <img className="h-8 w-auto" src={props.logoIcon} alt="Biz to Biz Now" />
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    {isClient ? (
                      <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <SidebarNavigationList
                            items={navItems}
                            setSidebarOpen={setSidebarOpen}
                            activeUser={props?.activeUser}
                            restoreAdminUser={restoreAdminUser}
                            role={props?.role}
                            setOpenEmulate={setOpenEmulate}
                          />
                        </li>
                      </ul>
                    ) : null}
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 bg-zinc-900 lg:flex ${
          sidebarExpanded ? 'lg:w-60' : 'lg:w-24 lg:items-center lg:justify-center'
        } lg:flex-col `}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-8">
          <div
            className={clsx(
              'flex h-16 shrink-0 items-center',
              sidebarExpanded ? '' : 'justify-center',
            )}
          >
            <Link to="/">
              <img className="h-8 w-auto" src={props.logoIcon} alt="Biz to Biz Now" />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            {isClient ? (
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <SidebarNavigationList
                    items={navItems}
                    setSidebarOpen={setSidebarOpen}
                    sidebarExpanded={sidebarExpanded}
                    activeUser={props?.activeUser}
                    restoreAdminUser={restoreAdminUser}
                    role={props?.role}
                    setOpenEmulate={setOpenEmulate}
                  />
                </li>
                <li className="-mx-6 mt-auto">
                  <SidebarProfileSection
                    userAvatar={props?.userAvatar}
                    userName={props?.userName}
                    sidebarExpanded={sidebarExpanded}
                    setSidebarExpanded={setSidebarExpanded}
                  />
                </li>
              </ul>
            ) : null}
          </nav>
        </div>
      </div>

      {/* Top bar for mobile */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-zinc-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-zinc-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">{headerText}</div>
        {isClient ? (
          <a href="/settings/profile">
            {props?.userAvatar ? (
              <img
                className="h-8 w-8 rounded-full bg-zinc-800"
                src={props.userAvatar}
                alt={props?.userName}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <span className="sr-only">Your profile</span>
          </a>
        ) : (
          <div className="h-8 w-8 rounded-full bg-zinc-800" />
        )}
      </div>

      <main
        className={clsx(
          sidebarExpanded ? 'lg:pl-60' : 'lg:pl-24',
          'flex flex-col lg:flex-row bg-zinc-100 flex-grow min-h-full',
        )}
      >
        <Outlet />
        <EmulateUserDialog
          openEmulate={openEmulate}
          setOpenEmulate={setOpenEmulate}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          emulateUser={emulateUser}
        />
      </main>
    </>
  )
}

function EmulateUserDialog({
  openEmulate,
  setOpenEmulate,
  selectedPerson,
  setSelectedPerson,
  emulateUser,
}: Readonly<{
  openEmulate: boolean
  setOpenEmulate: (val: boolean) => void
  selectedPerson: User | null
  setSelectedPerson: React.Dispatch<React.SetStateAction<User | null>>
  emulateUser: (userId: string) => void
}>) {
  function handleEmulateClick() {
    try {
      console.log('[EmulateUserDialog] button clicked', {
        selectedId: selectedPerson?.id,
        hasEmulate: typeof emulateUser === 'function',
      })
      if (!selectedPerson?.id) {
        alert('Please select a user to emulate.')
        return
      }
      emulateUser(selectedPerson.id)
    } catch (e) {
      console.error('[EmulateUserDialog] emulate click error', e)
    }
  }
  return (
    <Transition show={openEmulate} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenEmulate}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Choose a User to Emulate
                    </DialogTitle>
                    <div className="mt-4 text-left">
                      <Form
                        theme={formTheme}
                        id="emulate-user-form"
                        fields={[
                          FormFieldClass.searchSelectApollo('userId', {
                            label: 'Choose a User to Emulate',
                            dataType: 'users',
                            document: UsersDocument,
                            searchFields: ['firstName', 'lastName'],
                            selectOptionsFunction: (items: any[]) =>
                              items.map((u: any) => ({
                                value: u.id,
                                label: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.id,
                              })),
                            required: true,
                          }),
                          FormFieldClass.button('submit', { text: 'Emulate User', fullWidth: true }),
                        ]}
                        submit={(val: any) => {
                          if (!val?.userId) {
                            alert('Please select a user to emulate.')
                            return
                          }
                          emulateUser(val.userId)
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6" />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
