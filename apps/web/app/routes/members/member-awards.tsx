import React from 'react'
import {
  AwardListFragment,
  AwardQuery,
  ChapterMember,
  Role,
  useAwardsQuery,
} from '@nestled-template/shared/sdk'
import { WebContactCard } from '@nestled-template/web'
import { getQuarterFromDate } from '@nestled-template/shared/utils'

export default function MemberAwards() {
  const { data } = useAwardsQuery({
    variables: { input: { orderBy: 'awardedDate', orderDirection: 'desc' } },
  })
  type Award = AwardQuery['award']

  function hasRequiredContactFields(
    user: Award extends null ? null : NonNullable<Award>['user'],
  ): user is {
    id: string
    firstName: string
    lastName: string
    email: string
    company: string
    industry: string
    avatarUrl: string
    phone: string
    awards?: AwardListFragment[]
    role: Role
    chapter: ChapterMember
  } {
    return (
      !!user &&
      typeof (user as any).id === 'string' &&
      !!(user as any).firstName &&
      !!(user as any).lastName &&
      !!(user as any).email
    )
  }

  return (
    <div className="w-full">
      <h1 className={'text-center pt-8'}>The Biztastic Award Program</h1>
      <h4 className={'text-center pt-2 pb-8'}>Program Launched Q3 2024</h4>
      <div className={'prose mx-auto w-full max-w-5xl'}>
        <p className="mb-4">
          The Biztastic Award Program is designed to recognize and celebrate the outstanding
          contributions of the amazing members and leaders in the Biz community. This program aims
          to honor those who go above and beyond, inspiring us all to strive for excellence.
        </p>
        <p className="mb-4">
          Given that we've coined the term <strong>'Biztastic'</strong>, let's take a moment to
          define what this new word means ...
        </p>
        <p className="italic bg-gray-100 p-4 rounded mb-4">
          <strong>Biztastic:</strong> Demonstrating exceptional performance and inspiring others
          through actions and attitude.
        </p>
        <h3 className="text-xl font-semibold mb-2">Here are the Award Categories:</h3>
        <ul className="list-disc list-inside text-lg">
          <li className="mb-2">
            <strong>Biztastic Member Award:</strong> Recognizes members who demonstrate exceptional
            dedication, performance, and inspiration within the Biz community.
          </li>
          <li>
            <strong>Biztastic Leader Award:</strong> Honors leaders who show exemplary leadership,
            foster collaboration, and contribute significantly to the growth and success of their
            chapters, its members, and the Biz Community.
          </li>
        </ul>
        <div className={'w-full text-center'}>
          <a
            className={
              'bg-sky-400 no-underline text-lg px-3 py-2 rounded-md hover:bg-sky-500 text-white'
            }
            href={'/Biztastic Award Program Details.pdf'}
            target={'_blank'}
            rel="noreferrer"
          >
            See Full Program Details
          </a>

          <a
            className={
              'ml-12 bg-orange-500 no-underline text-lg px-3 py-2 rounded-md hover:bg-orange-400 text-white '
            }
            href={'https://forms.gle/77V5TMyUiazQQtXQ7'}
            target={'_blank'}
            rel="noreferrer"
          >
            Nominate a Member
          </a>
        </div>
      </div>
      <div className={'relative'}>
        <h2 className={'mx-auto text-center my-10'}>Our Award Recipients</h2>
        <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Awards */}
          <div className="flex flex-col items-center">
            <img
              className={'max-w-64 mb-12'}
              src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_member_jclq5z.png"
              alt="Biztastic Member Award"
            />
            <div className="flex flex-wrap justify-center w-full gap-4">
              {data?.awards
                ?.filter((award: Award) => award?.awardType?.name === 'Biztastic Member Award')
                .sort((a: Award, b: Award) => {
                  const aDate = a?.awardedDate ? new Date(a.awardedDate).getTime() : 0
                  const bDate = b?.awardedDate ? new Date(b.awardedDate).getTime() : 0
                  if (bDate !== aDate) return bDate - aDate
                  const aCreated = a?.createdAt ? new Date(a.createdAt).getTime() : 0
                  const bCreated = b?.createdAt ? new Date(b.createdAt).getTime() : 0
                  return bCreated - aCreated
                })
                .map((award: Award) => {
                  if (!hasRequiredContactFields(award?.user)) return null
                  const contact = { ...award.user, role: award.user.chapter.role }

                  return (
                    <div key={award.id} className="flex flex-col items-center">
                      <h4 className="mb-4 bg-sky-500 text-white py-1 px-4 rounded-full">
                        {getQuarterFromDate(award.awardedDate)}
                      </h4>
                      <WebContactCard contact={contact} />
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Vertical dividing line */}
          <div className="absolute hidden lg:block h-[60%] w-px bg-gray-200 left-1/2 top-[20%] transform -translate-x-1/2"></div>

          {/* Leader Awards */}
          <div className="flex flex-col items-center mt-8 lg:mt-0">
            <img
              className={'max-w-64 mb-12'}
              src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/biztastic_leader_ze66ka.png"
              alt="Biztastic Leader Award"
            />
            <div className="flex flex-wrap justify-center w-full gap-4">
              {data?.awards
                ?.filter((award: Award) => award?.awardType?.name === 'Biztastic Leader Award')
                .sort((a: Award, b: Award) => {
                  const aDate = a?.awardedDate ? new Date(a.awardedDate).getTime() : 0
                  const bDate = b?.awardedDate ? new Date(b.awardedDate).getTime() : 0
                  if (bDate !== aDate) return bDate - aDate
                  const aCreated = a?.createdAt ? new Date(a.createdAt).getTime() : 0
                  const bCreated = b?.createdAt ? new Date(b.createdAt).getTime() : 0
                  return bCreated - aCreated
                })
                .map((award: Award) => {
                  if (!hasRequiredContactFields(award?.user)) return null
                  const contact = { ...award.user, role: award.user.chapter.role }
                  return (
                    <div key={award.id} className="flex flex-col items-center">
                      <h4 className="mb-4 bg-orange-500 text-white py-1 px-4 rounded-full">
                        {getQuarterFromDate(award.awardedDate)}
                      </h4>
                      <WebContactCard contact={contact} />
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
