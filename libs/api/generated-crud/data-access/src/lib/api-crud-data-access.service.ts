import { Injectable } from '@nestjs/common'
import { ApiCoreDataAccessService } from '@nestled-template/api/core/data-access'
import { createSelect } from '@nestled-template/api/core/helpers'
import type { GraphQLResolveInfo } from 'graphql'
import * as dto from './dto'

@Injectable()
export class ApiCrudDataAccessService {
  constructor(private readonly data: ApiCoreDataAccessService) {}

  async createUser(info: GraphQLResolveInfo, input: dto.CreateUserInput) {
    const {
      reminderSentByIds,
      reminderSentToIds,
      chapterId,
      presenceIds,
      notificationsSentIds,
      notificationsReceivedIds,
      powerHoursFromIds,
      powerHoursToIds,
      referralsFromIds,
      referralsSentIds,
      referralsToIds,
      regionsManagedIds,
      substitutesSentByIds,
      substituteAcceptedIds,
      territoriesManagedIds,
      testimonialsFromIds,
      testimonialsToIds,
      transactionsIds,
      avatarId,
      backgroundImageId,
      substituteInvitedIds,
      awardsIds,
      blogPostsAuthoredIds,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      reminderSentBy: { ids: reminderSentByIds, isVirtual: true, isList: true },
      reminderSentTo: { ids: reminderSentToIds, isVirtual: true, isList: true },
      chapter: { ids: chapterId, isVirtual: true, isList: false },
      presence: { ids: presenceIds, isVirtual: true, isList: true },
      notificationsSent: { ids: notificationsSentIds, isVirtual: true, isList: true },
      notificationsReceived: { ids: notificationsReceivedIds, isVirtual: true, isList: true },
      powerHoursFrom: { ids: powerHoursFromIds, isVirtual: true, isList: true },
      powerHoursTo: { ids: powerHoursToIds, isVirtual: true, isList: true },
      referralsFrom: { ids: referralsFromIds, isVirtual: true, isList: true },
      referralsSent: { ids: referralsSentIds, isVirtual: true, isList: true },
      referralsTo: { ids: referralsToIds, isVirtual: true, isList: true },
      regionsManaged: { ids: regionsManagedIds, isVirtual: true, isList: true },
      substitutesSentBy: { ids: substitutesSentByIds, isVirtual: true, isList: true },
      substituteAccepted: { ids: substituteAcceptedIds, isVirtual: true, isList: true },
      territoriesManaged: { ids: territoriesManagedIds, isVirtual: true, isList: true },
      testimonialsFrom: { ids: testimonialsFromIds, isVirtual: true, isList: true },
      testimonialsTo: { ids: testimonialsToIds, isVirtual: true, isList: true },
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      avatar: { ids: avatarId, isVirtual: true, isList: false },
      backgroundImage: { ids: backgroundImageId, isVirtual: true, isList: false },
      substituteInvited: { ids: substituteInvitedIds, isVirtual: true, isList: true },
      awards: { ids: awardsIds, isVirtual: true, isList: true },
      blogPostsAuthored: { ids: blogPostsAuthoredIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['user'].create({
      data,
      select: createSelect(info),
    })
  }

  async users(info: GraphQLResolveInfo, input?: dto.ListUserInput) {
    return this.data['user'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async usersCount(input?: dto.ListUserInput) {
    const total = await this.data['user'].count()
    const count = await this.data['user'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async user(info: GraphQLResolveInfo, id: string) {
    return this.data['user'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateUser(info: GraphQLResolveInfo, id: string, input: dto.UpdateUserInput) {
    const {
      reminderSentByIds,
      reminderSentToIds,
      chapterId,
      presenceIds,
      notificationsSentIds,
      notificationsReceivedIds,
      powerHoursFromIds,
      powerHoursToIds,
      referralsFromIds,
      referralsSentIds,
      referralsToIds,
      regionsManagedIds,
      substitutesSentByIds,
      substituteAcceptedIds,
      territoriesManagedIds,
      testimonialsFromIds,
      testimonialsToIds,
      transactionsIds,
      avatarId,
      backgroundImageId,
      substituteInvitedIds,
      awardsIds,
      blogPostsAuthoredIds,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      reminderSentBy: { ids: reminderSentByIds, isVirtual: true, isList: true },
      reminderSentTo: { ids: reminderSentToIds, isVirtual: true, isList: true },
      chapter: { ids: chapterId, isVirtual: true, isList: false },
      presence: { ids: presenceIds, isVirtual: true, isList: true },
      notificationsSent: { ids: notificationsSentIds, isVirtual: true, isList: true },
      notificationsReceived: { ids: notificationsReceivedIds, isVirtual: true, isList: true },
      powerHoursFrom: { ids: powerHoursFromIds, isVirtual: true, isList: true },
      powerHoursTo: { ids: powerHoursToIds, isVirtual: true, isList: true },
      referralsFrom: { ids: referralsFromIds, isVirtual: true, isList: true },
      referralsSent: { ids: referralsSentIds, isVirtual: true, isList: true },
      referralsTo: { ids: referralsToIds, isVirtual: true, isList: true },
      regionsManaged: { ids: regionsManagedIds, isVirtual: true, isList: true },
      substitutesSentBy: { ids: substitutesSentByIds, isVirtual: true, isList: true },
      substituteAccepted: { ids: substituteAcceptedIds, isVirtual: true, isList: true },
      territoriesManaged: { ids: territoriesManagedIds, isVirtual: true, isList: true },
      testimonialsFrom: { ids: testimonialsFromIds, isVirtual: true, isList: true },
      testimonialsTo: { ids: testimonialsToIds, isVirtual: true, isList: true },
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      avatar: { ids: avatarId, isVirtual: true, isList: false },
      backgroundImage: { ids: backgroundImageId, isVirtual: true, isList: false },
      substituteInvited: { ids: substituteInvitedIds, isVirtual: true, isList: true },
      awards: { ids: awardsIds, isVirtual: true, isList: true },
      blogPostsAuthored: { ids: blogPostsAuthoredIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['user'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteUser(id: string) {
    return this.data['user'].delete({
      where: { id },
    })
  }

  async createChapter(info: GraphQLResolveInfo, input: dto.CreateChapterInput) {
    const {
      attendanceRemindersIds,
      membersIds,
      meetingsIds,
      referralsFromIds,
      referralsToIds,
      transactionsIds,
      backgroundImageId,
      regionId,
      substituteGroupId,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      attendanceReminders: { ids: attendanceRemindersIds, isVirtual: true, isList: true },
      members: { ids: membersIds, isVirtual: true, isList: true },
      meetings: { ids: meetingsIds, isVirtual: true, isList: true },
      referralsFrom: { ids: referralsFromIds, isVirtual: true, isList: true },
      referralsTo: { ids: referralsToIds, isVirtual: true, isList: true },
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      backgroundImage: { ids: backgroundImageId, isVirtual: true, isList: false },
      region: { ids: regionId, isVirtual: false, isList: false },
      substituteGroup: { ids: substituteGroupId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['chapter'].create({
      data,
      select: createSelect(info),
    })
  }

  async chapters(info: GraphQLResolveInfo, input?: dto.ListChapterInput) {
    return this.data['chapter'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async chaptersCount(input?: dto.ListChapterInput) {
    const total = await this.data['chapter'].count()
    const count = await this.data['chapter'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async chapter(info: GraphQLResolveInfo, id: string) {
    return this.data['chapter'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateChapter(info: GraphQLResolveInfo, id: string, input: dto.UpdateChapterInput) {
    const {
      attendanceRemindersIds,
      membersIds,
      meetingsIds,
      referralsFromIds,
      referralsToIds,
      transactionsIds,
      backgroundImageId,
      regionId,
      substituteGroupId,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      attendanceReminders: { ids: attendanceRemindersIds, isVirtual: true, isList: true },
      members: { ids: membersIds, isVirtual: true, isList: true },
      meetings: { ids: meetingsIds, isVirtual: true, isList: true },
      referralsFrom: { ids: referralsFromIds, isVirtual: true, isList: true },
      referralsTo: { ids: referralsToIds, isVirtual: true, isList: true },
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      backgroundImage: { ids: backgroundImageId, isVirtual: true, isList: false },
      region: { ids: regionId, isVirtual: false, isList: false },
      substituteGroup: { ids: substituteGroupId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['chapter'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteChapter(id: string) {
    return this.data['chapter'].delete({
      where: { id },
    })
  }

  async createMeeting(info: GraphQLResolveInfo, input: dto.CreateMeetingInput) {
    const { presenceIds, chapterId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      presence: { ids: presenceIds, isVirtual: true, isList: true },
      chapter: { ids: chapterId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['meeting'].create({
      data,
      select: createSelect(info),
    })
  }

  async meetings(info: GraphQLResolveInfo, input?: dto.ListMeetingInput) {
    return this.data['meeting'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async meetingsCount(input?: dto.ListMeetingInput) {
    const total = await this.data['meeting'].count()
    const count = await this.data['meeting'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async meeting(info: GraphQLResolveInfo, id: string) {
    return this.data['meeting'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateMeeting(info: GraphQLResolveInfo, id: string, input: dto.UpdateMeetingInput) {
    const { presenceIds, chapterId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      presence: { ids: presenceIds, isVirtual: true, isList: true },
      chapter: { ids: chapterId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['meeting'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteMeeting(id: string) {
    return this.data['meeting'].delete({
      where: { id },
    })
  }

  async createMeetingPresence(info: GraphQLResolveInfo, input: dto.CreateMeetingPresenceInput) {
    const { meetingId, memberId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      meeting: { ids: meetingId, isVirtual: false, isList: false },
      member: { ids: memberId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['meetingPresence'].create({
      data,
      select: createSelect(info),
    })
  }

  async meetingPresences(info: GraphQLResolveInfo, input?: dto.ListMeetingPresenceInput) {
    return this.data['meetingPresence'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async meetingPresencesCount(input?: dto.ListMeetingPresenceInput) {
    const total = await this.data['meetingPresence'].count()
    const count = await this.data['meetingPresence'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async meetingPresence(info: GraphQLResolveInfo, id: string) {
    return this.data['meetingPresence'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateMeetingPresence(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateMeetingPresenceInput,
  ) {
    const { meetingId, memberId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      meeting: { ids: meetingId, isVirtual: false, isList: false },
      member: { ids: memberId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['meetingPresence'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteMeetingPresence(id: string) {
    return this.data['meetingPresence'].delete({
      where: { id },
    })
  }

  async createSubstitute(info: GraphQLResolveInfo, input: dto.CreateSubstituteInput) {
    const { invitedIds, sentById, substituteId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      invited: { ids: invitedIds, isVirtual: true, isList: true },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      substitute: { ids: substituteId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['substitute'].create({
      data,
      select: createSelect(info),
    })
  }

  async substitutes(info: GraphQLResolveInfo, input?: dto.ListSubstituteInput) {
    return this.data['substitute'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async substitutesCount(input?: dto.ListSubstituteInput) {
    const total = await this.data['substitute'].count()
    const count = await this.data['substitute'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async substitute(info: GraphQLResolveInfo, id: string) {
    return this.data['substitute'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateSubstitute(info: GraphQLResolveInfo, id: string, input: dto.UpdateSubstituteInput) {
    const { invitedIds, sentById, substituteId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      invited: { ids: invitedIds, isVirtual: true, isList: true },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      substitute: { ids: substituteId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['substitute'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteSubstitute(id: string) {
    return this.data['substitute'].delete({
      where: { id },
    })
  }

  async createAttendanceReminder(
    info: GraphQLResolveInfo,
    input: dto.CreateAttendanceReminderInput,
  ) {
    const { chapterId, sentById, sentToId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      sentTo: { ids: sentToId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['attendanceReminder'].create({
      data,
      select: createSelect(info),
    })
  }

  async attendanceReminders(info: GraphQLResolveInfo, input?: dto.ListAttendanceReminderInput) {
    return this.data['attendanceReminder'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async attendanceRemindersCount(input?: dto.ListAttendanceReminderInput) {
    const total = await this.data['attendanceReminder'].count()
    const count = await this.data['attendanceReminder'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async attendanceReminder(info: GraphQLResolveInfo, id: string) {
    return this.data['attendanceReminder'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateAttendanceReminder(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateAttendanceReminderInput,
  ) {
    const { chapterId, sentById, sentToId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      sentTo: { ids: sentToId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['attendanceReminder'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteAttendanceReminder(id: string) {
    return this.data['attendanceReminder'].delete({
      where: { id },
    })
  }

  async createAwardType(info: GraphQLResolveInfo, input: dto.CreateAwardTypeInput) {
    const { awardsIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      awards: { ids: awardsIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['awardType'].create({
      data,
      select: createSelect(info),
    })
  }

  async awardTypes(info: GraphQLResolveInfo, input?: dto.ListAwardTypeInput) {
    return this.data['awardType'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async awardTypesCount(input?: dto.ListAwardTypeInput) {
    const total = await this.data['awardType'].count()
    const count = await this.data['awardType'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async awardType(info: GraphQLResolveInfo, id: string) {
    return this.data['awardType'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateAwardType(info: GraphQLResolveInfo, id: string, input: dto.UpdateAwardTypeInput) {
    const { awardsIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      awards: { ids: awardsIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['awardType'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteAwardType(id: string) {
    return this.data['awardType'].delete({
      where: { id },
    })
  }

  async createAward(info: GraphQLResolveInfo, input: dto.CreateAwardInput) {
    const { userId, awardTypeId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      user: { ids: userId, isVirtual: false, isList: false },
      awardType: { ids: awardTypeId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['award'].create({
      data,
      select: createSelect(info),
    })
  }

  async awards(info: GraphQLResolveInfo, input?: dto.ListAwardInput) {
    return this.data['award'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async awardsCount(input?: dto.ListAwardInput) {
    const total = await this.data['award'].count()
    const count = await this.data['award'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async award(info: GraphQLResolveInfo, id: string) {
    return this.data['award'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateAward(info: GraphQLResolveInfo, id: string, input: dto.UpdateAwardInput) {
    const { userId, awardTypeId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      user: { ids: userId, isVirtual: false, isList: false },
      awardType: { ids: awardTypeId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['award'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteAward(id: string) {
    return this.data['award'].delete({
      where: { id },
    })
  }

  async createChapterMember(info: GraphQLResolveInfo, input: dto.CreateChapterMemberInput) {
    const { chapterId, memberId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      member: { ids: memberId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['chapterMember'].create({
      data,
      select: createSelect(info),
    })
  }

  async chapterMembers(info: GraphQLResolveInfo, input?: dto.ListChapterMemberInput) {
    return this.data['chapterMember'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async chapterMembersCount(input?: dto.ListChapterMemberInput) {
    const total = await this.data['chapterMember'].count()
    const count = await this.data['chapterMember'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async chapterMember(info: GraphQLResolveInfo, id: string) {
    return this.data['chapterMember'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateChapterMember(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateChapterMemberInput,
  ) {
    const { chapterId, memberId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      member: { ids: memberId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['chapterMember'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteChapterMember(id: string) {
    return this.data['chapterMember'].delete({
      where: { id },
    })
  }

  async createUpload(info: GraphQLResolveInfo, input: dto.CreateUploadInput) {
    const { chapterId, userId, userBgId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      user: { ids: userId, isVirtual: false, isList: false },
      userBg: { ids: userBgId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['upload'].create({
      data,
      select: createSelect(info),
    })
  }

  async uploads(info: GraphQLResolveInfo, input?: dto.ListUploadInput) {
    return this.data['upload'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async uploadsCount(input?: dto.ListUploadInput) {
    const total = await this.data['upload'].count()
    const count = await this.data['upload'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async upload(info: GraphQLResolveInfo, id: string) {
    return this.data['upload'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateUpload(info: GraphQLResolveInfo, id: string, input: dto.UpdateUploadInput) {
    const { chapterId, userId, userBgId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      user: { ids: userId, isVirtual: false, isList: false },
      userBg: { ids: userBgId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['upload'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteUpload(id: string) {
    return this.data['upload'].delete({
      where: { id },
    })
  }

  async createSubstituteGroup(info: GraphQLResolveInfo, input: dto.CreateSubstituteGroupInput) {
    const { chaptersIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapters: { ids: chaptersIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['substituteGroup'].create({
      data,
      select: createSelect(info),
    })
  }

  async substituteGroups(info: GraphQLResolveInfo, input?: dto.ListSubstituteGroupInput) {
    return this.data['substituteGroup'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async substituteGroupsCount(input?: dto.ListSubstituteGroupInput) {
    const total = await this.data['substituteGroup'].count()
    const count = await this.data['substituteGroup'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async substituteGroup(info: GraphQLResolveInfo, id: string) {
    return this.data['substituteGroup'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateSubstituteGroup(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateSubstituteGroupInput,
  ) {
    const { chaptersIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapters: { ids: chaptersIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['substituteGroup'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteSubstituteGroup(id: string) {
    return this.data['substituteGroup'].delete({
      where: { id },
    })
  }

  async createTerritory(info: GraphQLResolveInfo, input: dto.CreateTerritoryInput) {
    const { regionsIds, managersIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      regions: { ids: regionsIds, isVirtual: true, isList: true },
      managers: { ids: managersIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['territory'].create({
      data,
      select: createSelect(info),
    })
  }

  async territories(info: GraphQLResolveInfo, input?: dto.ListTerritoryInput) {
    return this.data['territory'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async territoriesCount(input?: dto.ListTerritoryInput) {
    const total = await this.data['territory'].count()
    const count = await this.data['territory'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async territory(info: GraphQLResolveInfo, id: string) {
    return this.data['territory'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateTerritory(info: GraphQLResolveInfo, id: string, input: dto.UpdateTerritoryInput) {
    const { regionsIds, managersIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      regions: { ids: regionsIds, isVirtual: true, isList: true },
      managers: { ids: managersIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['territory'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteTerritory(id: string) {
    return this.data['territory'].delete({
      where: { id },
    })
  }

  async createRegion(info: GraphQLResolveInfo, input: dto.CreateRegionInput) {
    const { chaptersIds, managersIds, territoryId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapters: { ids: chaptersIds, isVirtual: true, isList: true },
      managers: { ids: managersIds, isVirtual: true, isList: true },
      territory: { ids: territoryId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['region'].create({
      data,
      select: createSelect(info),
    })
  }

  async regions(info: GraphQLResolveInfo, input?: dto.ListRegionInput) {
    return this.data['region'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async regionsCount(input?: dto.ListRegionInput) {
    const total = await this.data['region'].count()
    const count = await this.data['region'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async region(info: GraphQLResolveInfo, id: string) {
    return this.data['region'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateRegion(info: GraphQLResolveInfo, id: string, input: dto.UpdateRegionInput) {
    const { chaptersIds, managersIds, territoryId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapters: { ids: chaptersIds, isVirtual: true, isList: true },
      managers: { ids: managersIds, isVirtual: true, isList: true },
      territory: { ids: territoryId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['region'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteRegion(id: string) {
    return this.data['region'].delete({
      where: { id },
    })
  }

  async createIndustry(info: GraphQLResolveInfo, input: dto.CreateIndustryInput) {
    const data = input

    return this.data['industry'].create({
      data,
      select: createSelect(info),
    })
  }

  async industries(info: GraphQLResolveInfo, input?: dto.ListIndustryInput) {
    return this.data['industry'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async industriesCount(input?: dto.ListIndustryInput) {
    const total = await this.data['industry'].count()
    const count = await this.data['industry'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async industry(info: GraphQLResolveInfo, id: string) {
    return this.data['industry'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateIndustry(info: GraphQLResolveInfo, id: string, input: dto.UpdateIndustryInput) {
    const data = input

    return this.data['industry'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteIndustry(id: string) {
    return this.data['industry'].delete({
      where: { id },
    })
  }

  async createReferral(info: GraphQLResolveInfo, input: dto.CreateReferralInput) {
    const {
      transactionsIds,
      fromChapterId,
      fromId,
      sentById,
      toChapterId,
      toId,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      fromChapter: { ids: fromChapterId, isVirtual: false, isList: false },
      from: { ids: fromId, isVirtual: false, isList: false },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      toChapter: { ids: toChapterId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['referral'].create({
      data,
      select: createSelect(info),
    })
  }

  async referrals(info: GraphQLResolveInfo, input?: dto.ListReferralInput) {
    return this.data['referral'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async referralsCount(input?: dto.ListReferralInput) {
    const total = await this.data['referral'].count()
    const count = await this.data['referral'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async referral(info: GraphQLResolveInfo, id: string) {
    return this.data['referral'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateReferral(info: GraphQLResolveInfo, id: string, input: dto.UpdateReferralInput) {
    const {
      transactionsIds,
      fromChapterId,
      fromId,
      sentById,
      toChapterId,
      toId,
      ...regularFields
    } = input
    const data: any = regularFields

    const relationMappings = {
      transactions: { ids: transactionsIds, isVirtual: true, isList: true },
      fromChapter: { ids: fromChapterId, isVirtual: false, isList: false },
      from: { ids: fromId, isVirtual: false, isList: false },
      sentBy: { ids: sentById, isVirtual: false, isList: false },
      toChapter: { ids: toChapterId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['referral'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteReferral(id: string) {
    return this.data['referral'].delete({
      where: { id },
    })
  }

  async createNotification(info: GraphQLResolveInfo, input: dto.CreateNotificationInput) {
    const { actorId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      actor: { ids: actorId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['notification'].create({
      data,
      select: createSelect(info),
    })
  }

  async notifications(info: GraphQLResolveInfo, input?: dto.ListNotificationInput) {
    return this.data['notification'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async notificationsCount(input?: dto.ListNotificationInput) {
    const total = await this.data['notification'].count()
    const count = await this.data['notification'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async notification(info: GraphQLResolveInfo, id: string) {
    return this.data['notification'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateNotification(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateNotificationInput,
  ) {
    const { actorId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      actor: { ids: actorId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['notification'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteNotification(id: string) {
    return this.data['notification'].delete({
      where: { id },
    })
  }

  async createTransaction(info: GraphQLResolveInfo, input: dto.CreateTransactionInput) {
    const { chapterId, referralId, userId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      referral: { ids: referralId, isVirtual: false, isList: false },
      user: { ids: userId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['transaction'].create({
      data,
      select: createSelect(info),
    })
  }

  async transactions(info: GraphQLResolveInfo, input?: dto.ListTransactionInput) {
    return this.data['transaction'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async transactionsCount(input?: dto.ListTransactionInput) {
    const total = await this.data['transaction'].count()
    const count = await this.data['transaction'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async transaction(info: GraphQLResolveInfo, id: string) {
    return this.data['transaction'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateTransaction(info: GraphQLResolveInfo, id: string, input: dto.UpdateTransactionInput) {
    const { chapterId, referralId, userId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      chapter: { ids: chapterId, isVirtual: false, isList: false },
      referral: { ids: referralId, isVirtual: false, isList: false },
      user: { ids: userId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['transaction'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteTransaction(id: string) {
    return this.data['transaction'].delete({
      where: { id },
    })
  }

  async createTestimonial(info: GraphQLResolveInfo, input: dto.CreateTestimonialInput) {
    const { fromId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      from: { ids: fromId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['testimonial'].create({
      data,
      select: createSelect(info),
    })
  }

  async testimonials(info: GraphQLResolveInfo, input?: dto.ListTestimonialInput) {
    return this.data['testimonial'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async testimonialsCount(input?: dto.ListTestimonialInput) {
    const total = await this.data['testimonial'].count()
    const count = await this.data['testimonial'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async testimonial(info: GraphQLResolveInfo, id: string) {
    return this.data['testimonial'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateTestimonial(info: GraphQLResolveInfo, id: string, input: dto.UpdateTestimonialInput) {
    const { fromId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      from: { ids: fromId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['testimonial'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteTestimonial(id: string) {
    return this.data['testimonial'].delete({
      where: { id },
    })
  }

  async createPowerHour(info: GraphQLResolveInfo, input: dto.CreatePowerHourInput) {
    const { fromId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      from: { ids: fromId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['powerHour'].create({
      data,
      select: createSelect(info),
    })
  }

  async powerHours(info: GraphQLResolveInfo, input?: dto.ListPowerHourInput) {
    return this.data['powerHour'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async powerHoursCount(input?: dto.ListPowerHourInput) {
    const total = await this.data['powerHour'].count()
    const count = await this.data['powerHour'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async powerHour(info: GraphQLResolveInfo, id: string) {
    return this.data['powerHour'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updatePowerHour(info: GraphQLResolveInfo, id: string, input: dto.UpdatePowerHourInput) {
    const { fromId, toId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      from: { ids: fromId, isVirtual: false, isList: false },
      to: { ids: toId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['powerHour'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deletePowerHour(id: string) {
    return this.data['powerHour'].delete({
      where: { id },
    })
  }

  async createBlogCategory(info: GraphQLResolveInfo, input: dto.CreateBlogCategoryInput) {
    const { postsIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      posts: { ids: postsIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['blogCategory'].create({
      data,
      select: createSelect(info),
    })
  }

  async blogCategories(info: GraphQLResolveInfo, input?: dto.ListBlogCategoryInput) {
    return this.data['blogCategory'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async blogCategoriesCount(input?: dto.ListBlogCategoryInput) {
    const total = await this.data['blogCategory'].count()
    const count = await this.data['blogCategory'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async blogCategory(info: GraphQLResolveInfo, id: string) {
    return this.data['blogCategory'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateBlogCategory(
    info: GraphQLResolveInfo,
    id: string,
    input: dto.UpdateBlogCategoryInput,
  ) {
    const { postsIds, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      posts: { ids: postsIds, isVirtual: true, isList: true },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['blogCategory'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteBlogCategory(id: string) {
    return this.data['blogCategory'].delete({
      where: { id },
    })
  }

  async createBlogPost(info: GraphQLResolveInfo, input: dto.CreateBlogPostInput) {
    const { categoriesIds, authorId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      categories: { ids: categoriesIds, isVirtual: true, isList: true },
      author: { ids: authorId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: always use connect for creates
          const relationOperation = 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['blogPost'].create({
      data,
      select: createSelect(info),
    })
  }

  async blogPosts(info: GraphQLResolveInfo, input?: dto.ListBlogPostInput) {
    return this.data['blogPost'].findMany({
      ...this.data.filter(input),
      select: createSelect(info),
    })
  }

  async blogPostsCount(input?: dto.ListBlogPostInput) {
    const total = await this.data['blogPost'].count()
    const count = await this.data['blogPost'].count({
      ...this.data.filter(input),
    })
    const take = input?.take ?? 10
    const skip = input?.skip ?? 0
    const page = Math.floor(skip / take)
    return {
      take,
      skip,
      page,
      count,
      total,
    }
  }

  async blogPost(info: GraphQLResolveInfo, id: string) {
    return this.data['blogPost'].findUnique({
      where: { id },
      select: createSelect(info),
    })
  }

  async updateBlogPost(info: GraphQLResolveInfo, id: string, input: dto.UpdateBlogPostInput) {
    const { categoriesIds, authorId, ...regularFields } = input
    const data: any = regularFields

    const relationMappings = {
      categories: { ids: categoriesIds, isVirtual: true, isList: true },
      author: { ids: authorId, isVirtual: false, isList: false },
    }

    for (const [relationName, config] of Object.entries(relationMappings)) {
      if (config.ids !== undefined && config.ids !== null) {
        const ids = Array.isArray(config.ids)
          ? config.ids.map(id => ({ id }))
          : [{ id: config.ids }]

        if (config.isList) {
          // List relationships: use set for updates on virtual relations, connect for foreign key relations
          const relationOperation = config.isVirtual ? 'set' : 'connect'
          data[relationName] = { [relationOperation]: ids }
        } else {
          // Single relationship - always use connect
          data[relationName] = { connect: { id: config.ids } }
        }
      }
    }

    return this.data['blogPost'].update({
      where: { id },
      data,
      select: createSelect(info),
    })
  }

  async deleteBlogPost(id: string) {
    return this.data['blogPost'].delete({
      where: { id },
    })
  }
}
