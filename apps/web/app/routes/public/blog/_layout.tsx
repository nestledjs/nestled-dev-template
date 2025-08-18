import { Link, Outlet } from 'react-router'
import { WebUiContainer } from '@nestled-template/web-ui'

export default function BlogPost() {
  return (
    <WebUiContainer>
      <div className={'prose mx-auto max-w-4xl'}>
        <Outlet />
        <hr className={'max-w-xl mt-0 mb-4 mx-auto'} />
        <p>
          And hey, if you want to grow your business and build relationships within our{' '}
          <strong>COMMUNITY</strong> of small business owners and sales professionals focused on
          their businesses, community & personal <strong>GROWTH</strong> and on giving/receiving{' '}
          <strong>MENTORSHIP</strong> with other like-hearted people, then make sure to check out
          Biz to Biz networking groups!
        </p>
        <p>
          <Link to={'/'}>Learn more</Link> or contact us directly by email at{' '}
          <a href={'mailto:info@nestled-template.com'}>info@nestled-template.com</a>
        </p>
        <p className="font-bold text-center flex justify-center items-center">
          COMMUNITY <span className="text-xs mx-1 flex items-center">✼</span> GROWTH{' '}
          <span className="text-xs mx-1 flex items-center">✼</span> MENTORSHIP
        </p>
      </div>
    </WebUiContainer>
  )
}
