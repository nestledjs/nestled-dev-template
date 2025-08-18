import React from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'

export default function DefaultDashboard() {
  return (
    <WebUiContainer>
      <div className={'prose max-w-5xl'}>
        <h1>Welcome to the Beta site for Biz to Biz</h1>
        <p>We will be updating this page on a regular basis with information on what is available for testing.</p>

        <div style={{ position: 'relative', paddingBottom: '62.5%', height: 0 }}>
          <iframe
            src="https://www.loom.com/embed/40416b28706949d289ef54b343267c58?sid=41427c73-7352-4666-82e8-a0690a29d464"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </div>

        <p>In this very first round, the things we want to test are:</p>
        <ul className={'list-disc text-lg marker:text-sky-500'}>
          <li>
            Logging in and out. Currently the my-profile page isn't built, so just clicking on your image at the bottom
            left will log you out.
          </li>
          <li>Other login features, like forgot your password and 'Remember me'</li>
          <li>
            On the member's dashboard, $ in Biz, My Referrals, and Referrals Sent should be showing correct list and
            update screens. Please confirm you see your correct data (filters coming soon)
          </li>
          <li>
            Make sure you can edit referrals and $ in Biz. Just try to change one thing and then change it back so you
            don't mess up your referral history - this is live data.
          </li>
        </ul>
      </div>
    </WebUiContainer>
  )
}
