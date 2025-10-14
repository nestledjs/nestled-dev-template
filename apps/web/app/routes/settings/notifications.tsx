import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { BellIcon, EnvelopeIcon, BellAlertIcon } from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MeDocument, MeQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  category: 'email' | 'security' | 'marketing'
}

export const loader = apolloLoader()(({ preloadQuery }) => {
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  return { meQueryRef }
})

export default function NotificationsSettings() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery> }
  const { data } = useReadQuery(loaderData.meQueryRef)
  const user = data?.me
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // Sample notification preferences - in real app, fetch from backend
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'org_invites',
      title: 'Organization Invitations',
      description: 'Receive emails when you are invited to join an organization',
      enabled: true,
      category: 'email',
    },
    {
      id: 'member_added',
      title: 'New Team Members',
      description: 'Get notified when new members join your organization',
      enabled: true,
      category: 'email',
    },
    {
      id: 'role_changed',
      title: 'Role Changes',
      description: 'Receive notifications when your role or permissions change',
      enabled: true,
      category: 'email',
    },
    {
      id: 'weekly_digest',
      title: 'Weekly Digest',
      description: 'Receive a weekly summary of organization activity',
      enabled: false,
      category: 'email',
    },
    {
      id: 'security_alerts',
      title: 'Security Alerts',
      description: 'Important notifications about account security',
      enabled: true,
      category: 'security',
    },
    {
      id: 'login_alerts',
      title: 'Login Notifications',
      description: 'Get notified of new login attempts',
      enabled: true,
      category: 'security',
    },
    {
      id: 'password_changes',
      title: 'Password Changes',
      description: 'Alert when your password is changed',
      enabled: true,
      category: 'security',
    },
    {
      id: 'product_updates',
      title: 'Product Updates',
      description: 'Learn about new features and improvements',
      enabled: false,
      category: 'marketing',
    },
    {
      id: 'newsletters',
      title: 'Newsletters',
      description: 'Receive our monthly newsletter',
      enabled: false,
      category: 'marketing',
    },
  ])

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    )
    setFormSuccess('Notification preferences saved!')
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const emailNotifications = notifications.filter((n) => n.category === 'email')
  const securityNotifications = notifications.filter((n) => n.category === 'security')
  const marketingNotifications = notifications.filter((n) => n.category === 'marketing')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-3">
            <BellIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Notification Preferences
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage how you receive notifications and updates
            </p>
          </div>
        </div>
      </div>

      {formSuccess && (
        <div className="rounded-lg text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-3">
          {formSuccess}
        </div>
      )}

      {/* Email Notifications */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-sky-100 dark:bg-sky-500/10 p-2">
            <EnvelopeIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Email Notifications
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Choose which emails you want to receive
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {emailNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
            >
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(notification.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  notification.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
                role="switch"
                aria-checked={notification.enabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notification.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notifications */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-amber-100 dark:bg-amber-500/10 p-2">
            <BellAlertIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Security Notifications
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Critical security alerts (highly recommended)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {securityNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
            >
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(notification.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  notification.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
                role="switch"
                aria-checked={notification.enabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notification.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Notifications */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-violet-100 dark:bg-violet-500/10 p-2">
            <EnvelopeIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Marketing & Updates
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Stay informed about new features and offers
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {marketingNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
            >
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                  {notification.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {notification.description}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(notification.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  notification.enabled ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                }`}
                role="switch"
                aria-checked={notification.enabled}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notification.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
