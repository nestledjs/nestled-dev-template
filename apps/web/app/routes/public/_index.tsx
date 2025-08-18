import React from 'react'
import { WebUiButton, WebUiContainer, WebUiCta } from '@nestled-template/web-ui'
import {
  CalendarIcon,
  CheckBadgeIcon,
  FaceSmileIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { Link } from 'react-router'

export default function PublicIndex() {
  const stats = [
    { id: 1, name: 'Since', value: '2006' },
    { id: 2, name: 'States', value: '5' },
    { id: 3, name: 'Members Served', value: '10,000 +' },
  ]

  const features = [
    {
      name: 'Strategic Weekly Meetings',
      description:
        'One hour and fifteen minute weekly meetings with your networking group to learn, grow, and exchange leads.',
      icon: CalendarIcon,
      color: 'orange',
    },
    {
      name: 'Non-Compete Exclusive Spots',
      description:
        "You'll be the only person in your industry in your chapter, meaning that you won't have to compete for business within the chapter.",
      icon: CheckBadgeIcon,
      color: 'blue',
    },
    {
      name: 'Mentorship & Skills Development',
      description:
        'Biz members all have unique skills and talents.  We promote mentorship and sharing to help each other expand our knowledge in a wide variety of professional and personal skills development trainings, giving you and your business an edge above your competitors.',
      icon: PresentationChartBarIcon,
      color: 'blue',
    },
    {
      name: 'A Positive Community',
      description:
        'Be part of a supportive group of business owners who are focused on building relationships and helping each other grow.',
      icon: FaceSmileIcon,
      color: 'orange  ',
    },
  ]

  return (
    <div className={'overflow-x-hidden'}>
      <WebUiContainer blur={'bottom-left'} hideOverflow={true}>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="mx-auto flex-auto justify-center items-center lg:mx-0  lg:pr-16">
              <h1 className="serif text-center lg:text-left text-4xl tracking-tight text-zinc-900 sm:text-6xl">
                Strong Communities,
                <br />
                <span className={'text-sky-600'}>Stronger Businesses</span>
              </h1>
              <p className="text-center lg:text-left mt-6 text-lg leading-8 text-zinc-600">
                Join our vibrant community of entrepreneurs and gain access to powerful connections,
                expert guidance, warm leads, and a supportive network dedicated to helping your
                business thrive.
              </p>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6 ">
                <WebUiButton linkTo={'/directory/chapters'}>Find a chapter</WebUiButton>
                <WebUiButton linkTo={'/#features'} buttonType={'Soft'}>
                  Learn more
                </WebUiButton>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 grid grid-cols-12 lg:grid-cols-5 gap-4 ">
            <Link
              to={`/directory/member/candice-freeman`}
              className="col-span-2 bg-green-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/cjpiqqiyf0ak90105kv35zrrs/kagynx0tjxwhgscz9n1v')]"
            />
            <Link
              to={`/directory/member/cora-desantis`}
              className="col-span-2 bg-blue-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/undefined/a3zdzmgocvxymbg2yrgw')]"
            />

            <Link
              to={`/directory/member/gary-swenson-cmb`}
              className="lg:col-start-2 col-span-2 bg-yellow-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/gary-swenson-cmb/f0frhbwbl27pbzfkv0nn')]"
            />
            <Link
              to={`/directory/member/mitch-roberts`}
              className="col-span-2 bg-red-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/mitch-roberts/e9ty4pb7lxlqogyeksqb')]"
            />

            <Link
              to={`/directory/member/toni-weinzierl`}
              className="col-span-2 bg-purple-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/clg42s9iu004htj0klbobdgup/exfkadjnbq2cvh3gkl8y')]"
            />
            <Link
              to={`/directory/member/william-mcleod`}
              className="col-span-2 bg-pink-300 aspect-square rounded-md bg-center bg-cover bg-[url('https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/w_250/f_auto/v1609177151/user_avatars/william-mcleod/mwrhm0yunmp7elpww5t8')]"
            />
          </div>
        </div>
      </WebUiContainer>

      <WebUiContainer id={'stats'}>
        <div className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Proven Strategies for Long Term Growth
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  We've been having a blast growing with our members.
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
                {stats.map(stat => (
                  <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                    <dt className="text-sm font-semibold leading-6 text-zinc-600">{stat.name}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-sky-600">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </WebUiContainer>

      <img
        id={'features'}
        alt={'Our Team'}
        className={'w-full'}
        src={
          'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693759818/public_site/TeamPicture_lpbzdb.png'
        }
      />

      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className={'space-y-6'}>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How does Biz to Biz help your business grow?
              </h2>
              <p>
                Our chapters combine community building, mentorship, powerful networking and lead
                generation opportunities derived from a strategic agenda that we have developed for
                more than a decade.
              </p>
            </div>
            <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:-mt-64">
              {features.map(feature => (
                <div
                  key={feature.name}
                  className={clsx(
                    feature.color === 'blue' ? 'bg-sky-50' : 'bg-orange-50',
                    'p-6 rounded-lg',
                  )}
                >
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
                    <div
                      className={clsx(
                        'mb-6 flex h-10 w-10 items-center justify-center rounded-lg',
                        feature.color === 'blue' ? 'bg-orange-500' : 'bg-sky-600',
                      )}
                    >
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 text-lg leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white pb-16 pt-24 sm:py-24 ">
        <div className="bg-sky-600 pb-20 sm:pb-24 xl:pb-0">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row ">
            <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
              <div className="relative aspect-[3/2] h-full md:-mx-8 xl:mx-0 xl:aspect-[2/3]">
                <img
                  className="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover object-top shadow-2xl"
                  src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693771973/public_site/pam-artmann1_d5hffv.png"
                  alt="Pam Artmann - Biz to Biz"
                />
              </div>
            </div>
            <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
              <figure className="relative isolate pt-6 sm:pt-12">
                <svg
                  viewBox="0 0 162 128"
                  fill="none"
                  aria-hidden="true"
                  className="absolute left-0 top-0 -z-10 h-32 stroke-white/20"
                >
                  <path
                    id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                  />
                  <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x={86} />
                </svg>
                <blockquote className="text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                  <p>
                    As a long time Biz to Biz member, I have truly valued the experience over the
                    years... My Biz to Biz group is my business family, my work church and I
                    couldn't imagine not seeing everyone every week. They motivate me to grow both
                    personally and professionally. The time that I invest each week is well spent.
                  </p>
                </blockquote>
                <figcaption className="mt-8 text-base">
                  <div className="font-semibold text-white">Pam Artmann</div>
                  <div className="mt-1 text-zinc-200">Edina Realty</div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>

      <WebUiContainer blur={'bottom-right'}>
        <WebUiCta
          title1={'Ready to dive in?'}
          title2={"Join us as a guest to see what it's all about."}
          link1={
            <WebUiButton linkTo={'/directory/chapters'} buttonType="Primary" size="lg">
              Find a Chapter
            </WebUiButton>
          }
          link2={
            <WebUiButton linkTo={'/about'} buttonType={'Transparent'}>
              Learn More <span aria-hidden="true">→</span>
            </WebUiButton>
          }
        />
      </WebUiContainer>

      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-sky-600">
                  YOUR SUCCESS DRIVES EVERYTHING WE DO
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Our Process
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We believe it is our responsibility to empower you as an entrepreneur, small
                  business owner or sales professional.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Biz to Biz has a refined and intentional strategy that makes it possible to find
                  like-minded individuals and have the mentorship and skills development you need to
                  thrive.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  With over 10,000 members served in our networking groups since we were founded in
                  2006, we have helped small businesses build a trusted network of business referral
                  partners making it easier to reach new customers. Our groups are known for their
                  welcoming environments and for providing real support that produces real results.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Biz to Biz has created networking groups designed to bring you and your business
                  invaluable tools and a growth-minded community to empower you to be successful.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"></dl>
              </div>
            </div>
            <img
              src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693774190/public_site/Elk_River_Connections_lzobyx.jpg"
              alt="Biz to Biz Meeting - Elk River Connections"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>

      <WebUiContainer className={'bg-orange-500'}>
        <WebUiCta
          title1={'Ready to Expand Your Network?'}
          title2={'Find your local chapter today.'}
          description={
            'Unlock New Opportunities and Collaborations with Our Exclusive Biz to Biz Networking Chapters'
          }
          link1={
            <WebUiButton linkTo={'/directory/chapters'} buttonType="Secondary" size="lg">
              Find a Chapter
            </WebUiButton>
          }
          link2={
            <WebUiButton linkTo={'/about'} buttonType={'TransparentLight'}>
              Learn More <span aria-hidden="true">→</span>
            </WebUiButton>
          }
          lightText
        />
      </WebUiContainer>
    </div>
  )
}
