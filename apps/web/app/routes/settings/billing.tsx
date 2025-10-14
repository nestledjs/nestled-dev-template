import React from 'react'
import { useLoaderData } from 'react-router'
import { CreditCardIcon, DocumentTextIcon, ArrowUpIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { RequireOwner } from '@nestled-template/web'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MyOrganizationsDocument, MyOrganizationsQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const myOrganizationsQueryRef = preloadQuery<MyOrganizationsQuery>(MyOrganizationsDocument)
  return { myOrganizationsQueryRef }
})

export default function BillingSettings() {
  const loaderData = useLoaderData() as { myOrganizationsQueryRef: QueryRef<MyOrganizationsQuery> }
  const { data } = useReadQuery(loaderData.myOrganizationsQueryRef)
  const organizations = data?.myOrganizations || []
  const activeOrganization = organizations[0] || null

  // Mock data - in production, fetch from backend
  const currentPlan = {
    name: 'Free Plan',
    price: '$0',
    interval: 'month',
    status: 'active',
    nextBillingDate: null,
  }

  const usage = {
    members: {
      current: activeOrganization?._count?.members || 0,
      limit: 5,
      percentage: ((activeOrganization?._count?.members || 0) / 5) * 100,
    },
    storage: {
      current: 250,
      limit: 1000,
      percentage: 25,
      unit: 'MB',
    },
  }

  const invoices = [
    {
      id: '1',
      date: '2025-01-01',
      amount: '$0.00',
      status: 'paid',
      description: 'Free Plan - January 2025',
    },
  ]

  return (
    <RequireOwner
      fallback={
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 dark:bg-amber-500/10 p-3">
              <CreditCardIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                Permission Required
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Only organization owners can manage billing settings.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-3">
              <CreditCardIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Billing & Subscription
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Manage your subscription, payment methods, and invoices
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Current Plan
          </h3>

          <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-500/10 dark:to-sky-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {currentPlan.name}
                </h4>
                <span className="px-2 py-1 bg-emerald-500 text-white rounded-full text-xs font-medium">
                  {currentPlan.status}
                </span>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-1">
                {currentPlan.price}
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  /{currentPlan.interval}
                </span>
              </p>
              {currentPlan.nextBillingDate && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  Next billing date: {new Date(currentPlan.nextBillingDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                alert('Upgrade flow will redirect to pricing page or Stripe checkout')
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowUpIcon className="h-5 w-5" />
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Usage & Limits */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-violet-100 dark:bg-violet-500/10 p-2">
              <BanknotesIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Usage & Limits
            </h3>
          </div>

          <div className="space-y-6">
            {/* Members Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Team Members
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {usage.members.current} / {usage.members.limit}
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(usage.members.percentage, 100)}%` }}
                />
              </div>
              {usage.members.percentage >= 80 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  {usage.members.percentage >= 100
                    ? 'You have reached your member limit. Upgrade to add more members.'
                    : 'You are approaching your member limit. Consider upgrading soon.'}
                </p>
              )}
            </div>

            {/* Storage Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Storage
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {usage.storage.current} {usage.storage.unit} / {usage.storage.limit} {usage.storage.unit}
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(usage.storage.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Payment Method
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            You are currently on the free plan. When you upgrade, you'll be able to add a payment method.
          </p>

          <button
            onClick={() => {
              alert('Payment method management will integrate with Stripe')
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add Payment Method
          </button>
        </div>

        {/* Billing History */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-sky-100 dark:bg-sky-500/10 p-2">
              <DocumentTextIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Billing History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-zinc-200 dark:border-white/10">
                    <td className="py-3 px-4 text-sm text-zinc-900 dark:text-white">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {invoice.description}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {invoice.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          alert(`Download invoice ${invoice.id}`)
                        }}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stripe Customer Portal */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Manage Billing
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Use the Stripe Customer Portal to manage your subscription, update payment methods, and download invoices.
          </p>

          <button
            onClick={() => {
              alert('Redirect to Stripe Customer Portal')
            }}
            className="px-4 py-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-colors"
          >
            Open Customer Portal
          </button>
        </div>
      </div>
    </RequireOwner>
  )
}
