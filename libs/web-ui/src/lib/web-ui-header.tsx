import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router'

interface WebUiHeaderNavProps {
  name: string
  href: string
}
interface WebUiHeaderProps {
  navigation: WebUiHeaderNavProps[]
  logo: string
  icon: string
  siteName: string
  isAuthenticated: boolean
}
export function WebUiHeader(props: Readonly<WebUiHeaderProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">{props.siteName}</span>
            <img className="h-8 w-auto" src={props.logo} alt={props.siteName} />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {props.navigation.map(item => (
            <Link key={item.name} to={item.href} className="leading-5 text-zinc-600">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <Link
            to="/join"
            className=" hidden lg:block rounded-md bg-orange-600 px-3 py-2 text-base text-white shadow-sm hover:bg-orange-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Join a Chapter
          </Link>
          {props?.isAuthenticated ? (
            <Link
              to="/members/dashboard"
              className=" hidden lg:block rounded-md bg-sky-600 px-3 py-2 text-base text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden lg:block lg:text-base lg:leading-6 lg:text-zinc-600"
            >
              Sign In
            </Link>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="transition-transform duration-1000 ease-out fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src={props.icon} alt="" />
            </Link>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 pt-6 pb-2">
                {props.navigation.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base text-zinc-600 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className={'py-6'}>
                <Link
                  to="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className=" -ml-1 rounded-md bg-orange-600 px-3 py-2.5 text-base text-white shadow-sm hover:bg-orange-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  Join a Chapter
                </Link>
              </div>
              <div className="py-6">
                {props?.isAuthenticated ? (
                  <Link
                    to="/members/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className=" -ml-1 rounded-md bg-sky-600 px-3 py-2.5 text-base text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 mt-3 block rounded-lg px-3 py-2.5 text-base text-zinc-600 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
