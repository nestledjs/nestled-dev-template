import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaClient, StoredFile, StorageProvider } from '@nestled-template/api/prisma'
import { StorageFactory } from './storage.factory'
import { FileUpload } from 'graphql-upload-minimal'

/**
 * Storage Orchestrator Service
 * High-level file management with database persistence
 *
 * This service:
 * 1. Accepts file uploads via GraphQL
 * 2. Uploads to the configured storage provider
 * 3. Persists file metadata to database
 * 4. Provides convenient methods for common upload scenarios
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)

  constructor(
    private readonly prisma: PrismaClient,
    private readonly storageFactory: StorageFactory,
  ) {}

  /**
   * Upload a file and persist metadata to database
   */
  async uploadFile(
    fileUpload: FileUpload,
    userId: string,
    options?: {
      folder?: string
      organizationId?: string
      metadata?: Record<string, any>
      isPublic?: boolean
    },
  ): Promise<StoredFile> {
    const { createReadStream, filename, mimetype } = fileUpload

    // Convert stream to buffer
    const buffer = await this.streamToBuffer(createReadStream())

    const storageProvider = this.storageFactory.getStorageProvider()

    // Upload to storage provider
    const uploadResult = await storageProvider.upload(buffer, {
      filename,
      mimeType: mimetype,
      folder: options?.folder,
      isPublic: options?.isPublic ?? false,
      userId,
      organizationId: options?.organizationId,
      metadata: options?.metadata,
    })

    // Persist to database
    const upload = await this.prisma.storedFile.create({
      data: {
        provider: this.mapProviderNameToEnum(uploadResult.provider),
        providerFileId: uploadResult.providerFileId,
        folder: uploadResult.folder,
        filename: uploadResult.filename,
        originalName: filename,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        url: uploadResult.url,
        publicUrl: uploadResult.publicUrl,
        width: uploadResult.width,
        height: uploadResult.height,
        metadata: uploadResult.metadata as any,
        userId,
        organizationId: options?.organizationId,
      },
    })

    this.logger.log(`File uploaded successfully: ${upload.id} (${upload.filename})`)

    return upload
  }

  /**
   * Upload user avatar
   * Folder structure: user_avatars/{userId}/filename.ext
   */
  async uploadUserAvatar(fileUpload: FileUpload, userId: string): Promise<StoredFile> {
    return this.uploadFile(fileUpload, userId, {
      folder: `user_avatars/${userId}`,
      metadata: { type: 'avatar' },
      isPublic: true,
    })
  }

  /**
   * Upload organization avatar
   * Folder structure: org_avatars/{organizationId}/filename.ext
   */
  async uploadOrganizationLogo(
    fileUpload: FileUpload,
    userId: string,
    organizationId: string,
  ): Promise<StoredFile> {
    return this.uploadFile(fileUpload, userId, {
      folder: `org_avatars/${organizationId}`,
      organizationId,
      metadata: { type: 'avatar' },
      isPublic: true,
    })
  }

  /**
   * Delete a file from storage and database
   */
  async deleteFile(uploadId: string, userId: string): Promise<void> {
    const upload = await this.prisma.storedFile.findUnique({
      where: { id: uploadId },
    })

    if (!upload) {
      throw new NotFoundException(`Upload not found: ${uploadId}`)
    }

    // Verify user owns the file
    if (upload.userId !== userId) {
      throw new NotFoundException(`Upload not found: ${uploadId}`)
    }

    const storageProvider = this.storageFactory.getStorageProvider()

    // Delete from storage provider
    await storageProvider.delete(upload.providerFileId)

    // Delete from database
    await this.prisma.storedFile.delete({
      where: { id: uploadId },
    })

    this.logger.log(`File deleted successfully: ${uploadId}`)
  }

  /**
   * Get all files for a user
   */
  async getUserFiles(userId: string, limit = 50, offset = 0): Promise<StoredFile[]> {
    return this.prisma.storedFile.findMany({
      where: { userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get all files for an organization
   */
  async getOrganizationFiles(
    organizationId: string,
    limit = 50,
    offset = 0,
  ): Promise<StoredFile[]> {
    return this.prisma.storedFile.findMany({
      where: { organizationId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get a signed URL for temporary access to a private file
   */
  async getSignedUrl(uploadId: string, expiresIn = 3600): Promise<string> {
    const upload = await this.prisma.storedFile.findUnique({
      where: { id: uploadId },
    })

    if (!upload) {
      throw new NotFoundException(`Upload not found: ${uploadId}`)
    }

    const storageProvider = this.storageFactory.getStorageProvider()
    return storageProvider.getSignedUrl(upload.providerFileId, expiresIn)
  }

  /**
   * Helper: Convert ReadStream to Buffer
   */
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
  }

  /**
   * Helper: Map provider name string to Prisma enum
   */
  private mapProviderNameToEnum(providerName: string): StorageProvider {
    const upperName = providerName.toUpperCase()
    if (upperName in StorageProvider) {
      return StorageProvider[upperName as keyof typeof StorageProvider]
    }
    throw new Error(`Unknown storage provider: ${providerName}`)
  }
}
