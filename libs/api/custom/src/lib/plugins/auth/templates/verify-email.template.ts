export function emailVerificationEmail({
  email,
  firstName,
  token,
  appName,
  siteUrl,
}: {
  email: string
  firstName?: string | null
  token: string
  appName: string
  siteUrl: string
}) {
  const subject = `[${appName}] Please verify your email`
  const url = `${siteUrl}/verify-email?token=${token}`

  const text = [
    `Hi ${firstName ?? 'There'},\n`,
    `Welcome! Please verify your email by visiting the link below.\n`,
    `${url}\n`,
    `Thanks,\n`,
    `The ${appName} Team\n`,
  ].join('')

  const html = [
    `<p>Hi ${firstName ?? 'There'},</p>`,
    `<p>Welcome! Please verify your email by clicking the link below.</p>`,
    `<p><a href="${url}">Verify Your Email</a></p>`,
    `<p>Thanks,<br />The ${appName} Team</p>`,
  ].join('')

  return {
    to: email,
    subject,
    html,
    text,
  }
}


