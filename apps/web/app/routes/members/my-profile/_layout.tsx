import {  Outlet, useLoaderData, useMatches, useNavigate } from 'react-router'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { useReadQuery } from '@apollo/client'
import { getCookie } from '@nestled-template/shared/utils'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import  { useState } from 'react'
import { CreateReplaceUploadInput, useUploadUserAvatarMutation, MeDocument,useUserDeleteUploadMutation, MeQuery } from '@nestled-template/shared/sdk'
import { WebUiSocialLinks } from '@nestled-template/web-ui'
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  EyeIcon,
  PencilIcon,
  PhoneIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { WebUiImageUpload } from '@nestled-template/web'

export const handle = {
  scripts: () => [{ src: 'https://widget.cloudinary.com/v2.0/global/all.js' }],
}

export const loader = apolloLoader()(({ preloadQuery, request }) => {
  const token = getCookie(request.headers, '__session_biz')
  const meRef = preloadQuery<MeQuery>(MeDocument, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
  return { token, meRef }
})

export default function MyProfileLayout() {
  const navigate = useNavigate()
  const loaderData = useLoaderData<typeof loader>()
  // Prime Apollo from SSR snapshot
  useReadQuery<MeQuery>(loaderData.meRef)
  const [uploadUserAvatar] = useUploadUserAvatarMutation()
  const [deleteUpload] = useUserDeleteUploadMutation()
  const { data } = useReadQuery<MeQuery>(loaderData.meRef)
  const [expanded, setExpanded] = useState(true)
  const matches = useMatches()

  const edit = matches.slice(-1)[0].pathname === '/members/my-profile/edit'
  const me = data?.me

  function handleImageUpload(image: CreateReplaceUploadInput) {
    uploadUserAvatar({
      variables: {
        input: {
          ...image,
        },
      },
    })
      .catch((e: any) => console.error(e))
  }

  function handleImageDeletion(imageId: string, publicId: string) {
    deleteUpload({
      variables: {
        uploadId: imageId,
        publicId: publicId,
      },
    })
      .catch((e: any) => console.error(e))
  }

  const folder = `user_avatars/${me?.id}`

  return (
    <div className="lg:flex w-full min-h-screen">
      <div className={'p-6 bg-sky-600 w-full lg:w-4/12 2xl:w-3/12 2xl:p-10 lg:min-h-full text-center'}>
        <div className={`${expanded ? '' : 'hidden lg:block'}`}>
          <div className={'w-64 h-64 rounded-full overflow-hidden mx-auto relative'}>
            <WebUiImageUpload
              type={'avatar'}
              image={(me as any)?.avatar}
              folder={folder}
              handleUpload={handleImageUpload}
              token={loaderData.token || ''}
              handleDelete={handleImageDeletion}
              widgetId={'profile-pic'}
              fallbackUrl={me?.avatarUrl}
            />
            <PencilIcon className={'text-white absolute top-2 left-1/2 -ml-3 h-6 w-6 pointer-events-none'} />
          </div>

          <p className={'text-white text-sm mt-4j'}>
            Click on image to edit. <br />
            Square images are best, larger than 300 x 300px
          </p>
          {!me?.email ? (
            <div role="status" className="max-w-full mt-6 animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5 mx-auto"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mx-auto"></div>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <>
              <h1 className={'font-sans text-white mt-6'}>
                {me?.firstName} {me?.lastName}
              </h1>
              <h3 className={'font-sans text-zinc-200 mb-4'}>{me?.company}</h3>
              <WebUiSocialLinks member={me as any} />
              <ul className={'text-white space-y-4 mt-8'}>
                <li className="flex items-center space-x-3 py-2">
                  <UserGroupIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{me?.chapter?.chapter?.name}</div>
                  </div>
                </li>
                <li className="flex items-center space-x-3 py-2">
                  <BriefcaseIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{me?.industry}</div>
                  </div>
                </li>

                <li className="flex items-center space-x-3 py-2 text-left">
                  <BuildingOfficeIcon className={'h-6 w-6 text-white'} />
                  <div>
                    {me?.address ? <div className="text-lg text-zinc-200">{me?.address}</div> : null}
                    {me?.address2 ? <div className="text-lg text-zinc-200">{me?.address2}</div> : null}
                    {me?.city || me?.state || me?.postcode ? (
                      <div className="text-lg text-zinc-200">
                        {me?.city ? `${me?.city}, ` : null}
                        {me?.state ? `${me?.state}, ` : null}
                        {me?.postcode ? `${me?.postcode}` : null}
                      </div>
                    ) : null}
                  </div>
                </li>

                <li className="flex items-center space-x-3 py-2">
                  <EnvelopeIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{me?.email}</div>
                  </div>
                </li>
                <li className="flex items-center space-x-3 py-2">
                  <PhoneIcon className={'h-6 w-6 text-white'} />
                  <div>
                    <div className="text-lg text-zinc-200">{me?.phone}</div>
                  </div>
                </li>
                {edit ? (
                  <li
                    className="flex items-center space-x-3 py-2"
                    onClick={() => {
                      setExpanded(false)
                      navigate('/members/my-profile#top-of-page')
                    }}
                  >
                    <EyeIcon className={'h-6 w-6 text-white'} />
                    <div>
                      <div className="text-lg text-zinc-200">View My Profile</div>
                    </div>
                  </li>
                ) : (
                  <li
                    className="flex items-center space-x-3 py-2"
                    onClick={() => {
                      setExpanded(false)
                      navigate('/members/my-profile/edit#top-of-page')
                    }}
                  >
                    <PencilIcon className={'h-6 w-6 text-white'} />
                    <div>
                      <div className="text-lg text-zinc-200">Edit My Profile</div>
                    </div>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        <div className={`${expanded ? 'hidden' : 'flex lg:hidden'}`}>
          <h4 className={'text-white font-semibold inline-flex'} onClick={() => setExpanded(true)}>
            <ChevronLeftIcon className={'h-6 w-6 mr-4'} /> {' Back to My Profile'}
          </h4>
        </div>
      </div>

      <div id={'top-of-page'} className={`bg-zinc-100 flex flex-col flex-grow flex-1 scroll-m-14`}>
        <Outlet />
      </div>
    </div>
  )
}
