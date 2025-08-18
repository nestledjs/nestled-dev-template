import React, { useCallback, useEffect, useRef } from 'react'
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { CreateReplaceUploadInput, Upload } from '@nestled-template/shared/sdk'
import { useLocation } from 'react-router'
import { getApiUrl } from '@nestled-template/shared/utils'

interface WebUiImageUploadProps {
  image?: Upload | null
  folder: string
  handleUpload: (image: CreateReplaceUploadInput) => void
  handleDelete?: (imageId: string, publicId: string) => void
  token: string
  widgetId: string
  type: 'avatar' | 'background'
  fallbackUrl?: string | null
}

interface CloudinaryWidget {
  open: () => void
  destroy: () => void
}

export function WebUiImageUpload({
  folder,
  image,
  handleUpload,
  handleDelete,
  token,
  widgetId,
  type,
  fallbackUrl,
}: Readonly<WebUiImageUploadProps>) {
  const location = useLocation()
  const widgetRef = useRef<CloudinaryWidget | null>(null)
  const isAvatar = type === 'avatar'

  const signUpload = useCallback(
    async (cb: (hash: string) => void, params: Record<string, unknown>): Promise<void> => {
      const res = await fetch(`${getApiUrl()}/api/upload/sign-request`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      const res_1 = await res.json()
      return cb(res_1.hash)
    },
    [token],
  )

  const handleImageUpload = useCallback(
    (upload: any) => {
      if (upload.event === 'success') {
        const createImage: CreateReplaceUploadInput = {
          format: upload.info.format,
          originalFilename: upload.info.original_filename,
          publicId: upload.info.public_id,
          resourceType: upload.info.resource_type,
          secureUrl: upload.info.secure_url,
          signature: upload.info.signature,
          thumbnailUrl: upload.info.thumbnail_url,
          url: upload.info.url,
          type: upload.info.type,
          replacingUploadId: image?.id,
          replacingCloudinaryPublicId: image?.publicId,
        }

        handleUpload(createImage)
      }
    },
    [image, handleUpload],
  )

  const handleImageDeletion = useCallback(
    (imageToDelete: Upload) => {
      if (imageToDelete?.id && imageToDelete?.publicId && handleDelete) {
        handleDelete(imageToDelete.id, imageToDelete.publicId)
      }
    },
    [handleDelete],
  )

  const initializeWidget = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      widgetRef.current = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: 'biz-to-biz-global-networking-inc',
          apiKey: 918771444776978,
          folder: folder,
          uploadSignature: signUpload,
          showAdvancedOptions: true,
          multiple: false,
          showPoweredBy: false,
          cropping_coordinates_mode: 'custom',
          croppingAspectRatio: isAvatar ? 1 : undefined,
          showSkipCropButton: true,
          showCompletedButton: true,
          widgetId: widgetId,
        },
        (error: Error, result: { event: string; info: any }) => {
          if (!error && result && result.event === 'success') {
            handleImageUpload(result)
          } else if (error) {
            console.error(error)
          }
        },
      )
    }
  }, [folder, handleImageUpload, isAvatar, signUpload, widgetId])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).cloudinary) {
        const script = document.createElement('script')
        script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
        script.onload = initializeWidget
        document.body.appendChild(script)
      } else {
        initializeWidget()
      }
    }

    return () => {
      if (widgetRef?.current?.destroy) {
        widgetRef.current.destroy()
      }
    }
  }, [initializeWidget, location])

  const showWidget = useCallback(() => {
    if (widgetRef.current) widgetRef.current.open()
  }, [])

  const uploadButton = () => {
    if (image) {
      // Create and configure your Cloudinary instance.
      const cld = new Cloudinary({
        cloud: {
          cloudName: 'biz-to-biz-global-networking-inc',
        },
      })

      const activeImage = cld.image(image.publicId)
      activeImage.quality('auto')
      return (
        <div className={isAvatar ? 'relative' : ''}>
          <AdvancedImage
            cldImg={activeImage}
            className={`w-full h-full ${isAvatar ? 'rounded-full' : ''} object-cover`}
            onClick={showWidget}
          />

          <div
            className={`absolute bottom-0 left-0 right-0 flex justify-center items-center ${
              isAvatar ? 'bg-opacity-50 bg-black' : ''
            } p-2 z-10`}
          >
            <button
              className="text-white text-sm underline"
              onClick={() => handleImageDeletion(image)}
            >
              Delete Image
            </button>
          </div>
        </div>
      )
    } else if (fallbackUrl) {
      // Display existing image from fallbackUrl (e.g., avatarUrl)
      return (
        <div className={isAvatar ? 'relative' : ''}>
          <img
            src={fallbackUrl}
            className={`w-full h-full ${isAvatar ? 'rounded-full' : ''} object-cover cursor-pointer`}
            onClick={showWidget}
            alt="Profile"
          />
          <div
            className={`absolute bottom-0 left-0 right-0 flex justify-center items-center ${
              isAvatar ? 'bg-opacity-50 bg-black' : ''
            } p-2 z-10`}
          >
            <button
              className="text-white text-sm underline"
              onClick={showWidget}
            >
              Replace Image
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <button onClick={showWidget}>
          {isAvatar ? (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          ) : (
            <img
              className="w-full h-full object-cover"
              src="https://picsum.photos/1800/200"
              width="100%"
              alt="Placeholder"
            />
          )}
        </button>
      )
    }
  }

  return <>{uploadButton()}</>
}
