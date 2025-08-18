import { Award } from '@nestled-template/shared/sdk'
import clsx from 'clsx'

export function getQuarterFromDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() // getMonth() returns 0-based month (0 for January, 11 for December)

  const quarter = Math.floor(month / 3) + 1

  return `Q${quarter} ${year}`
}

export function copyToClipboard(embedCode: string) {
  navigator.clipboard
    .writeText(embedCode)
    .then(() => {
      alert('Embed code copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy embed code: ', err)
    })
}

export function renderAward(award: Award, memberId?: string) {
  switch (award?.awardType?.name) {
    case 'Biztastic Leader Award':
      return (
        <button
          key={award.id}
          onClick={
            memberId
              ? () =>
                  copyToClipboard(
                    `<a href="https://nestled-templatenow.com/directory/member/${memberId}"><img src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_leader_logo_dgdp20.png" alt="Biztastic Leader Award" /></a>`,
                  )
              : undefined
          }
          className={'flex flex-col justify-center items-center'}
        >
          <div> {getQuarterFromDate(award.awardedDate)}</div>
          <img
            src={
              memberId
                ? 'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_leader_logo_dgdp20.png'
                : 'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_leader_ze66ka.png'
            }
            alt="Biztastic Leader Award"
            className={clsx(memberId ? 'cursor-pointer' : '', 'max-w-52')}
          />
        </button>
      )
    case 'Biztastic Member Award':
      return (
        <button
          key={award.id}
          onClick={
            memberId
              ? () =>
                  copyToClipboard(
                    `<a href="https://nestled-templatenow.com/directory/member/${memberId}"><img src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_member_logo_xxstot.png" alt="Biztastic Member Award" /></a>`,
                  )
              : undefined
          }
          className={'flex flex-col justify-center items-center'}
        >
          <div className={'-mb-2'}> {getQuarterFromDate(award.awardedDate)}</div>
          <img
            src={
              memberId
                ? 'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_member_logo_xxstot.png'
                : 'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/v1726766589/awards/biztastic_member_jclq5z.png'
            }
            alt="Biztastic Member Award"
            className={clsx(memberId ? 'cursor-pointer' : '', 'max-w-52')}
          />
        </button>
      )
    case 'Biztastic Longevity Award':
      return <div key={award.id}>Biztastic Longevity Award</div>
    default:
      return
  }
}
