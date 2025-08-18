import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useUserQuery } from '@nestled-template/shared/sdk'
import { WebUiContainer } from '@nestled-template/web-ui'
import { clsx } from 'clsx'

// Helper function to render awards
function renderAward(award: any) {
  return (
    <div key={award?.id} className="inline-block mx-2 mb-2">
      <img
        src={award?.awardType?.imageUrl || '/default-award.png'}
        alt={award?.awardType?.name || 'Award'}
        className="h-16 w-16 object-contain"
        title={award?.awardType?.description || award?.awardType?.name}
      />
      <div className="text-xs text-center mt-1 text-gray-600">
        {award?.awardType?.name}
      </div>
    </div>
  )
}

export default function MemberProfileView() {
  const params = useParams()
  const [headerLoaded, setHeaderLoaded] = useState(false)

  const { data } = useUserQuery({
    variables: {
      userId: params.memberId ?? 'NoId',
    },
    skip: !params.memberId,
  })

  const user = data?.user
  const testimonials = user?.testimonialsTo ?? []

  return (
    <>
      <div className={clsx('bg-zinc-500 aspect-w-10 aspect-h-1 w-full', headerLoaded ? '' : 'animate-pulse')}>
        <img
          src={user?.backgroundImageUrl ?? 'https://picsum.photos/1800/200'}
          width={'1800'}
          height={'200'}
          onLoad={() => setHeaderLoaded(true)}
          alt={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Header Image'}
          className={clsx(
            'w-full max-h-48 object-cover',
            headerLoaded ? 'opacity-100' : 'opacity-0',
            'transition-opacity duration-500',
          )}
        />
      </div>
      <WebUiContainer width={'w-full'}>
        <div className={'whitespace-break-spaces text-lg mt-6'}>{user?.bio}</div>
        {user?.awards?.length && user?.awards?.length > 0 ? (
          <WebUiContainer className={'flex justify-center'}>
            <h2 className={'mx-auto text-center mb-4'}>Recipient of:</h2>
            <div>{user?.awards?.map((award) => renderAward(award))}</div>
          </WebUiContainer>
        ) : null}
        <div className="mx-auto mt-8 flow-root max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:grid sm:grid-cols-2 sm:text-[0]">
            {[...testimonials]
              ?.sort((a, b) => {
                const dateA = new Date(a?.createdAt).getTime()
                const dateB = new Date(b?.createdAt).getTime()
                return dateB - dateA
              })
              ?.map((testimonial, index) => (
                <div key={index} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>{`"${testimonial?.text}"`}</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <img
                        className="h-10 w-10 rounded-full bg-gray-50"
                        src={testimonial?.from?.avatarUrl || ''}
                        alt={
                          testimonial?.from?.firstName && testimonial?.from?.lastName
                            ? `${testimonial?.from?.firstName} ${testimonial?.from?.lastName}`
                            : 'Testimonial Avatar'
                        }
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial?.from?.firstName} {testimonial?.from?.lastName}
                        </div>
                        <div className="text-gray-600">{`${testimonial?.from?.company}`}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
          </div>
        </div>
      </WebUiContainer>
    </>
  )
}
