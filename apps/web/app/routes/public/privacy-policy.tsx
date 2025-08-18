import { useEffect } from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'

export default function PrivacyPolicy() {
  useEffect(() => {
    const s = document.createElement('script')
    const tag = document.getElementsByTagName('script')[0]
    s.src = 'https://cdn.iubenda.com/iubenda.js'
    tag?.parentNode?.insertBefore(s, tag)
  }, [])

  return (
    <WebUiContainer>
      <a
        href="https://www.iubenda.com/privacy-policy/40104750"
        className="iubenda-white no-brand iubenda-noiframe iubenda-embed iubenda-noiframe iub-body-embed"
        title="Privacy Policy"
      >
        Privacy Policy
      </a>
    </WebUiContainer>
  )
}
