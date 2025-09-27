import { WebUiContainer } from './web-ui-container'
import { Link } from 'react-router'

export function WebUiFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-zinc-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/60">
      <WebUiContainer center>
        <div className="flex w-full flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {year} <span className="font-semibold text-zinc-800 dark:text-zinc-100">Your Company</span>. All rights reserved.
          </p>
          <nav className="flex items-center gap-4">
            <Link className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" to="/public/about">
              About
            </Link>
            <a className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" href="mailto:hello@example.com">
              Contact
            </a>
          </nav>
        </div>
      </WebUiContainer>
    </footer>
  )
}
