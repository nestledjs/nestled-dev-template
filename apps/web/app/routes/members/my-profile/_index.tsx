import {
  CreateReplaceUploadInput,
  MeDocument,
  MeQuery,
  useUploadUserBackgroundMutation,
  useUserDeleteUploadMutation,
} from '@nestled-template/shared/sdk'
import React from 'react'
import { LoaderFunctionArgs, useLoaderData, useMatches } from 'react-router'
import { WebUiContainer } from '@nestled-template/web-ui'
import { copyToClipboard, getCookie, renderAward } from '@nestled-template/shared/utils'
import { PencilIcon } from '@heroicons/react/24/outline'
import { WebUiImageUpload } from '@nestled-template/web'
import type { QueryRef } from '@apollo/client'
import { useApolloClient, useReadQuery } from '@apollo/client'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session')
  return { token }
}

export default function ViewMyProfile() {
  const loaderData = useLoaderData<typeof loader>()
  const client = useApolloClient()
  const matches = useMatches()
  // Read meRef provided by parent layout loader and prime/read Apollo cache without calling the network
  const meRef = (matches.find(m => (m.data as any)?.meRef)?.data as any)?.meRef as QueryRef<MeQuery>
  const { data } = useReadQuery<MeQuery>(meRef)
  const me = data?.me
  const testimonials = (me as any)?.testimonialsTo
  const [uploadUserBackground] = useUploadUserBackgroundMutation()
  const [deleteUpload] = useUserDeleteUploadMutation()

  async function handleImageBgUpload(image: CreateReplaceUploadInput) {
    uploadUserBackground({
      variables: {
        input: {
          ...image,
        },
      },
    })
      .then(async () => {
        await client.refetchQueries({ include: [MeDocument] })
      })
      .catch((e: any) => console.error(e))
  }

  async function handleImageBgDeletion(imageId: string, publicId: string) {
    deleteUpload({
      variables: {
        uploadId: imageId,
        publicId: publicId,
      },
    })
      .then(async () => {
        await client.refetchQueries({ include: [MeDocument] })
      })
      .catch((e: any) => console.error(e))
  }

  const folder = `user_backgrounds/${me?.id}`

  return (
    <>
      <div className="bg-zinc-500 aspect-w-10 aspect-h-1 relative w-full">
        <WebUiImageUpload
          type={'background'}
          image={(me as any)?.backgroundImage}
          folder={folder}
          handleUpload={handleImageBgUpload}
          token={loaderData.token || ''}
          handleDelete={handleImageBgDeletion}
          widgetId={'profile-background'}
          fallbackUrl={(me as any)?.backgroundImageUrl}
        />
        <PencilIcon className="text-white absolute top-1 left-1 h-6 w-6 pointer-events-none" />
      </div>

      <div className="bg-orange-500 py-2 text-center relative w-full text-white text-sm">
        Click on the image above to set your profile background image. The ideal image size is 1800
        x 200.
      </div>
      <WebUiContainer>
        <div className={'whitespace-break-spaces text-lg mt-6'}>{me?.bio}</div>

        <div className={'flex justify-center flex-col items-center mt-8 bg-white p-8 rounded-lg'}>
          <p className={'font-semibold mb-2'}>Promotional Images.</p>
          <p className={'max-w-3xl text-center mx-auto mb-8'}>
            We have created promotional images for you to use on your website or in your emails that
            link back to your Biz member profile. Click on an image below to copy the HTML code to
            your clipboard. You can then paste that code into your website or emails to display a
            linked badge.
          </p>
          <div className={'items-center justify-center flex flex-row'}>
            <button
              key={'proud-member-award'}
              onClick={() =>
                copyToClipboard(
                  `<a href="https://nestled-templatenow.com/directory/member/${me?.id}"><img src="https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/proud-member-badge_kb9ceb.png" alt="Biz to Biz Proud Member" /></a>`,
                )
              }
            >
              <img
                src={
                  'https://res.cloudinary.com/biz-to-biz-global-networking-inc/image/upload/f_auto/v1726766589/awards/proud-member-badge_kb9ceb.png'
                }
                alt="Proud Member Award"
                className={'cursor-pointer max-w-40'}
              />
            </button>
            {(me as any)?.awards?.map((award: any) => renderAward(award, me?.id ?? ''))}
          </div>
        </div>

        <div className="mx-auto mt-8 flow-root max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:grid sm:grid-cols-2  sm:text-[0]">
            {testimonials?.map((testimonial: any, index: number) => (
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
                        testimonial?.from?.firstName
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
