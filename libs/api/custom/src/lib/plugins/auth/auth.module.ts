import { ApiCoreDataAccessModule } from '@nestled-template/api/core/data-access'
import { ApiCoreFeatureModule } from '@nestled-template/api/core/feature'
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthResolver } from './auth.resolver'
import { EmailModule } from '@nestled-template/api/integrations'
import { ConfigModule } from '@nestled-template/api/config'

@Module({
  imports: [
    ApiCoreDataAccessModule,
    ApiCoreFeatureModule,
    EmailModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
    }),
  ],
  exports: [AuthService],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
