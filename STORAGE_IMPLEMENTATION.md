# File Upload & Storage System Implementation Guide

## 🎯 Current Status: IN PROGRESS (~10% Complete)

**Last Updated**: October 15, 2025
**Current Phase**: Phase 3 (Frontend) - File Upload System

---

## 📊 Progress Tracker

### ✅ Completed
- [x] Storage service interfaces defined
- [x] Local filesystem provider implemented (DEV ONLY)
- [x] Directory structure created following project conventions

### 🚧 In Progress
- [ ] Implement remaining storage providers (S3, Cloudinary, ImageKit, GCS)

### ⏳ To Do
- [ ] Create storage plugin in `api/custom/plugins/storage`
- [ ] Build storage factory for provider switching
- [ ] Update Prisma schema with enhanced Upload model
- [ ] Add GraphQL upload scalar support
- [ ] Create file upload GraphQL mutations
- [ ] Build frontend file upload components
- [ ] Write setup documentation for each provider

---

## 🏗️ Architecture Overview

### Design Pattern: Pluggable Storage Abstraction

**Location Structure** (following project conventions):
```
libs/api/integrations/src/lib/storage/
├── interfaces/                    # ✅ DONE
│   ├── storage-service.interface.ts
│   ├── upload-options.interface.ts
│   ├── upload-result.interface.ts
│   └── index.ts
├── providers/                     # 🚧 IN PROGRESS (1/5 done)
│   ├── local-storage.service.ts   ✅ DONE
│   ├── s3-storage.service.ts      ⏳ TODO
│   ├── cloudinary-storage.service.ts ⏳ TODO
│   ├── imagekit-storage.service.ts   ⏳ TODO
│   └── gcs-storage.service.ts     ⏳ TODO
└── storage.module.ts              ⏳ TODO

libs/api/custom/src/lib/plugins/storage/
├── dto/                           ⏳ TODO
│   ├── upload-file.input.ts
│   └── upload-file.output.ts
├── models/                        ⏳ TODO
│   └── upload.model.ts
├── storage.service.ts             ⏳ TODO (consumer/orchestrator)
├── storage.resolver.ts            ⏳ TODO (GraphQL mutations)
├── storage.module.ts              ⏳ TODO
└── storage.factory.ts             ⏳ TODO (provider switching)
```

---

## 📋 Implementation Checklist

### Phase 1: Storage Providers (Week 1) - IN PROGRESS

#### ✅ 1.1 - Local Storage Provider (DONE)
**File**: `libs/api/integrations/src/lib/storage/providers/local-storage.service.ts`
- Implements IStorageService interface
- Stores files in `./uploads` directory
- **Prominent warnings on startup**: Files lost on restart
- UUID-based unique filenames
- Automatic directory creation

#### ⏳ 1.2 - AWS S3 Provider (NEXT)
**File**: `libs/api/integrations/src/lib/storage/providers/s3-storage.service.ts`

**Environment Variables Required**:
```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
AWS_S3_ENDPOINT=optional_custom_endpoint  # For MinIO, DigitalOcean Spaces
AWS_S3_FORCE_PATH_STYLE=false            # true for MinIO
```

**Features**:
- Public and private file support
- Signed URL generation with expiration
- Support for S3-compatible services (MinIO, DigitalOcean Spaces)
- Automatic MIME type handling
- Metadata support

**Dependencies**:
```json
{
  "@aws-sdk/client-s3": "^3.x",
  "@aws-sdk/s3-request-presigner": "^3.x"
}
```

#### ⏳ 1.3 - Cloudinary Provider
**File**: `libs/api/integrations/src/lib/storage/providers/cloudinary-storage.service.ts`

**Environment Variables**:
```bash
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

**Features**:
- Automatic image optimization
- On-the-fly transformations (resize, crop, format)
- Built-in CDN delivery
- Support for width, height, quality, format options
- Automatic format conversion (JPEG, PNG, WebP, AVIF)

**Dependencies**:
```json
{
  "cloudinary": "^1.x"
}
```

#### ⏳ 1.4 - ImageKit Provider
**File**: `libs/api/integrations/src/lib/storage/providers/imagekit-storage.service.ts`

**Environment Variables**:
```bash
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

**Features**:
- Real-time image optimization
- Smart cropping and resizing
- CDN delivery
- Better developer experience than Cloudinary
- Built-in image analysis

**Dependencies**:
```json
{
  "imagekit": "^4.x"
}
```

#### ⏳ 1.5 - Google Cloud Storage Provider
**File**: `libs/api/integrations/src/lib/storage/providers/gcs-storage.service.ts`

**Environment Variables**:
```bash
GCS_PROJECT_ID=your-project
GCS_BUCKET=your-bucket
GCS_KEY_FILE=./path-to-service-account-key.json
# OR
GOOGLE_APPLICATION_CREDENTIALS=./path-to-credentials.json
```

**Features**:
- Signed URL generation
- Public and private buckets
- Metadata support
- Integration with Google Cloud ecosystem

**Dependencies**:
```json
{
  "@google-cloud/storage": "^7.x"
}
```

---

### Phase 2: Storage Plugin (Week 1)

#### ⏳ 2.1 - Storage Factory
**File**: `libs/api/custom/src/lib/plugins/storage/storage.factory.ts`

**Purpose**: Switch storage providers based on `STORAGE_PROVIDER` env variable

```typescript
@Injectable()
export class StorageFactory {
  create(provider: string): IStorageService {
    switch (provider) {
      case 'local': return this.localStorage
      case 's3': return this.s3Storage
      case 'cloudinary': return this.cloudinaryStorage
      case 'imagekit': return this.imagekitStorage
      case 'gcs': return this.gcsStorage
      default: throw new Error(`Unknown storage provider: ${provider}`)
    }
  }
}
```

#### ⏳ 2.2 - Storage Service (Orchestrator)
**File**: `libs/api/custom/src/lib/plugins/storage/storage.service.ts`

**Purpose**: High-level file management with database persistence

```typescript
@Injectable()
export class StorageService {
  async uploadFile(buffer: Buffer, options: UploadOptions, userId: string): Promise<Upload>
  async uploadUserAvatar(buffer: Buffer, userId: string): Promise<Upload>
  async uploadOrganizationLogo(buffer: Buffer, orgId: string): Promise<Upload>
  async deleteFile(uploadId: string): Promise<void>
  async getUserFiles(userId: string): Promise<Upload[]>
}
```

#### ⏳ 2.3 - GraphQL Resolver
**File**: `libs/api/custom/src/lib/plugins/storage/storage.resolver.ts`

**Mutations**:
```graphql
uploadFile(file: Upload!, folder: String): Upload
uploadUserAvatar(file: Upload!): Upload
uploadOrganizationLogo(file: Upload!): Upload
deleteFile(uploadId: String!): Boolean
```

**Queries**:
```graphql
userFiles(limit: Int, offset: Int): [Upload!]!
organizationFiles(organizationId: String!): [Upload!]!
```

---

### Phase 3: Prisma Schema Updates

#### ⏳ 3.1 - Add StorageProvider Enum

**File**: `libs/api/prisma/src/lib/schemas/schema.prisma`

```prisma
enum StorageProvider {
  LOCAL
  S3
  CLOUDINARY
  IMAGEKIT
  GCS
}
```

#### ⏳ 3.2 - Enhance Upload Model

```prisma
model Upload {
  id             String          @id @default(uuid())
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  // Storage info
  provider       StorageProvider
  providerFileId String          // Provider-specific ID/key
  folder         String?

  // File info
  filename       String
  originalName   String
  mimeType       String
  size           Int

  // URLs
  url            String
  publicUrl      String?

  // Image metadata (if applicable)
  width          Int?
  height         Int?

  // Generic metadata
  metadata       Json?

  // Relations
  userId         String?
  organizationId String?
  user           User?         @relation(fields: [userId], references: [id])
  organization   Organization? @relation(fields: [organizationId], references: [id])

  @@index([userId])
  @@index([organizationId])
  @@index([provider])
}
```

---

### Phase 4: Frontend Components (Week 2)

#### ⏳ 4.1 - Core Upload Component
**File**: `libs/web-ui/src/lib/components/file-upload/file-upload-zone.tsx`

**Features**:
- Drag & drop upload
- Multiple file selection
- File type validation
- Size limit enforcement
- Progress indicator
- Preview before upload

#### ⏳ 4.2 - Avatar Uploader
**File**: `libs/web-ui/src/lib/components/file-upload/avatar-uploader.tsx`

**Features**:
- Circular crop preview
- Default avatar with initials
- Upload and preview
- Integration with user profile

#### ⏳ 4.3 - Organization Logo Uploader
**Similar to avatar but square crop**

---

## 🚀 Quick Start for Development

### 1. Use Local Storage (No Setup)

```bash
# .env
STORAGE_PROVIDER=local
LOCAL_STORAGE_PATH=./uploads

# Uploads stored in ./uploads directory
# ⚠️ Files lost on restart!
```

### 2. Switch to S3 for Production

```bash
# .env
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
```

### 3. Or Use Cloudinary

```bash
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

---

## 🔧 Environment Variables Reference

### Required (Based on Provider)

| Variable | Provider | Description |
|----------|----------|-------------|
| `STORAGE_PROVIDER` | All | `local`, `s3`, `cloudinary`, `imagekit`, `gcs` |
| `LOCAL_STORAGE_PATH` | Local | Directory path (default: `./uploads`) |
| `AWS_ACCESS_KEY_ID` | S3 | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | S3 | AWS secret key |
| `AWS_S3_BUCKET` | S3 | S3 bucket name |
| `AWS_S3_REGION` | S3 | AWS region (default: `us-east-1`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary | API key |
| `CLOUDINARY_API_SECRET` | Cloudinary | API secret |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit | Public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit | Private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit | URL endpoint |
| `GCS_PROJECT_ID` | GCS | Google Cloud project ID |
| `GCS_BUCKET` | GCS | GCS bucket name |
| `GCS_KEY_FILE` | GCS | Path to service account key |

---

## 🎯 Next Session: Resume Here

### Immediate Next Steps

1. **Implement S3 Provider** (highest priority - most common)
   - File: `libs/api/integrations/src/lib/storage/providers/s3-storage.service.ts`
   - Install: `pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
   - ~150 lines of code

2. **Implement Cloudinary Provider** (second priority - best for images)
   - File: `libs/api/integrations/src/lib/storage/providers/cloudinary-storage.service.ts`
   - Install: `pnpm add cloudinary`
   - ~120 lines of code

3. **Implement ImageKit and GCS** (complete the set)
   - Similar implementations to above
   - ~100-120 lines each

4. **Create Storage Factory**
   - Wire up provider switching
   - Add to storage module

5. **Build Storage Plugin**
   - Create storage service (orchestrator)
   - Add GraphQL resolver
   - Wire up file upload mutations

---

## 📚 Reference Documentation

### Similar Systems
- **Strapi**: Uses provider pattern with local, S3, Cloudinary
- **Ghost**: Similar abstraction for storage
- **Laravel**: Storage facade with multiple drivers

### Best Practices
- ✅ Abstract interface for consistency
- ✅ Environment-based provider switching
- ✅ Prominent warnings for dev-only solutions
- ✅ Metadata support for all providers
- ✅ Signed URLs for private files
- ✅ Database persistence for file tracking

---

**Status**: Foundation complete, ready for provider implementations
**Time Estimate**: ~2-3 days to complete all providers and integration
**Priority**: HIGH (blocks avatar uploads and profile completion)
