import React from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { WebUiContainer } from '@nestled-template/web-ui'

export default function MembersSupport() {
  const faqs = [
    {
      question: 'Where can I find the latest news and updates?',
      answer: (
        <p className={'pb-2'}>
            We keep a collection of notes and updates{' '}
            <a className="text-sky-500" href="/members/release-notes">
              here
            </a>{' '}
            that will keep you up to date on the latest changes to our software and organization .
          </p>
      ),
    },
    {
      question: 'Something is not working.  What do I do?',
      answer: (
        <>
          <p className={'pb-2'}>
            See the orange button that says 'Feedback' on the right side of the screen? Go ahead and click on that and
            report a bug. You will be given the option to take screenshots and draw on them, or record a video of your
            screen. For fastest resolution, please try to capture and clearly explain the problem you are seeing.
          </p>
          <p>
            Please note that video recording is only available on computers - phones are limited to sending screenshots.
          </p>
          <div className={'bg-zinc-300'} style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.loom.com/embed/8cd1857a1e7d477da2e3fbfa86698b61?sid=4404ad7e-82e4-4e12-8e63-dcba33b7a1d8"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </>
      ),
    },

    // More questions...
  ]

  const leaderFaqs = [
    {
      question: 'Where do I take attendance?',
      answer: (
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/9GzbVA_ptZg?si=qrAJK-nKOBEzt3Bv"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ),
    },
    {
      question: 'How do I access reports and how do I use them?',
      answer: (
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/vtDVaRRrB_8?si=80rI4joWcFrgYack"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ),
    },
    {
      question: 'Filtering Reports by Date',
      answer: (
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/50ppl8_vrz8?si=wBW_CZHQw2eOwu6_"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ),
    },
  ]
  return (
    <>
      <WebUiContainer width="w-full" className={'min-h-screen'}>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>

            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        {faq.answer}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </WebUiContainer>

      <WebUiContainer width="w-full" className={'min-h-screen'}>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Leader FAQs</h2>

            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {leaderFaqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        {faq.answer}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </WebUiContainer>
    </>
  )
}
