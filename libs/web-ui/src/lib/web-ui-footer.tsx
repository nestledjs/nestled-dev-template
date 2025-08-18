import { WebUiContainer } from './web-ui-container'
import { Link } from 'react-router'

export function WebUiFooter() {
  return (
    <WebUiContainer center>
      <div className={'flex flex-col items-center justify-center sm:flex-row'}>
        <span className={'text-sm'}>
          © {new Date().getFullYear()} Biz to Biz Now. All rights reserved.
        </span>

        <Link className={'text-sm sm:ml-2 text-sky-600'} to="/privacy-policy">
          Privacy Policy
        </Link>

        {/*<Link className={'text-sm sm:ml-2 text-sky-600'} to="/privacy-policy">*/}
        {/*  Terms & Conditions*/}
        {/*</Link>*/}
      </div>
    </WebUiContainer>
  )
}
