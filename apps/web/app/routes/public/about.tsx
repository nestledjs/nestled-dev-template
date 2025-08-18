import { WebUiButton, WebUiContainer, WebUiCta } from '@nestled-template/web-ui'

export default function About() {
  return (
    <>
      <div className="overflow-hidden bg-white pb-16 pt-12 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mt-6 mb-12 max-w-3xl mx-auto text-center leading-8">
            Biz to Biz has been empowering small businesses and sales professionals to build
            relationships & networks since 2006.
          </h2>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 ">
              <div className="lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl text-sky-600">
                  Our Mission: Your Success
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  At Biz to Biz, our mission is to empower small businesses and sales professionals
                  to thrive in unity. As a catalyst for business growth, we provide a vibrant
                  community where entrepreneurs are not just networking, but connecting, learning,
                  and succeeding together. Since 2006, we've been fostering a nurturing environment
                  that blends structured, professional development with a genuine spirit of
                  camaraderie and support.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Through our referral marketing program, we champion a 'Give to Give' philosophy,
                  encouraging the exchange of invaluable referrals that drive mutual success. We
                  believe in the power of mentorship and shared wisdom to navigate the journey of
                  entrepreneurship. Our commitment is to embolden businesses to grow, and in doing
                  so, enrich their communities.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Biz to Biz is more than a network. It's a partnership, a mentor, a cheerleader,
                  and a friend in times of triumph and trials. We are dedicated to helping
                  businesses not just survive, but flourish, fostering a legacy of shared success
                  and enriched communities.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"></dl>
              </div>
            </div>
            <img
              src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693791332/public_site/Elevate_czvgek.jpg"
              alt="Biz to Biz Meeting - Elevate"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
      <div className="bg-orange-500 px-6 py-24  lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Individual Biz Groups have Generated More Than $1 Million Dollars Annually in Sales.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white">
            BIZ GROUPS AVERAGE 300 - 1000+ NEW REFERRALS ANUALLY
          </p>
        </div>
      </div>
      <WebUiContainer className={'p-16'}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className={'text-center mb-6'}>Trusted by Thousands of Small Businesses</h2>
          <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/StateFarm_x504cw.png"
                alt="State Farm"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/Pierce_zizcfm.png"
                alt="Pierce"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/Northwestern_mni8sa.png"
                alt="Northwestern Mutual"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/Edina_ga0san.png"
                alt="Edina Realty"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-6 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/Interstate_xxl1o9.png"
                alt="First Interstate Bank"
                width={158}
                height={48}
              />
            </div>
            <div className="bg-gray-400/5 p-8 sm:p-10">
              <img
                className="max-h-12 w-full object-contain"
                src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1693854567/public_site/jones_rikv0m.png"
                alt="Edward Jones"
                width={158}
                height={48}
              />
            </div>
          </div>
        </div>
      </WebUiContainer>
      <WebUiContainer>
        <div className="mx-auto max-w-4xl">
          <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <iframe
              title="About Biz to Biz"
              src="https://player.vimeo.com/video/265466179?h=9749731fc9&title=0&byline=0&portrait=0"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <script src="https://player.vimeo.com/api/player.js"></script>
        </div>
      </WebUiContainer>
      <WebUiContainer className={'bg-orange-500 my-16'}>
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
            <WebUiButton linkTo={'/contact'} buttonType={'TransparentLight'}>
              Start a Chapter <span aria-hidden="true">→</span>
            </WebUiButton>
          }
          lightText
        />
      </WebUiContainer>
    </>
  )
}
