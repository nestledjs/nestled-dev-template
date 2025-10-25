import { Module } from '@nestjs/common'
import { StorageModule as IntegrationsStorageModule } from '@nestled-template/api/integrations'
import { PrismaClient } from '@nestled-template/api/prisma'
import { StorageFactory } from './storage.factory'
import { StorageService } from './storage.service'
import { StorageResolver } from './storage.resolver'

/**
 * Storage Plugin Module
 * Wires up storage providers, factory, service, and GraphQL resolver
 */
@Module({
  imports: [IntegrationsStorageModule],
  providers: [PrismaClient, StorageFactory, StorageService, StorageResolver],
  exports: [StorageService],
})
export class StoragePluginModule {}
