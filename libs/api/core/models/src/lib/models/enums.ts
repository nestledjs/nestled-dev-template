// Generated from Prisma schema

import { registerEnumType } from '@nestjs/graphql';
import { AddressType, EmailType, FailureReason, ImageType, InviteStatus, PhoneType, SecurityEventType, SubscriptionStatus, TwoFactorMethod } from '@nestled-template/api/prisma';

export { AddressType, EmailType, FailureReason, ImageType, InviteStatus, PhoneType, SecurityEventType, SubscriptionStatus, TwoFactorMethod };

registerEnumType(AddressType, { name: 'AddressType' });

registerEnumType(EmailType, { name: 'EmailType' });

registerEnumType(FailureReason, { name: 'FailureReason' });

registerEnumType(ImageType, { name: 'ImageType' });

registerEnumType(InviteStatus, { name: 'InviteStatus' });

registerEnumType(PhoneType, { name: 'PhoneType' });

registerEnumType(SecurityEventType, { name: 'SecurityEventType' });

registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatus' });

registerEnumType(TwoFactorMethod, { name: 'TwoFactorMethod' });

