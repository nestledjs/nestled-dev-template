import React from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'

export default function ReleaseNotes() {
  return (
    <WebUiContainer width="w-full" className={'min-h-screen'}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl  prose">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Recent Changes and Updates</h2>
          <a href="/members/support" className={'text-sky-500'}>
            Back to Support
          </a>

          <h2>April 2025</h2>
          <ul>
            <li>
              <strong>Launch of the Biz Connect Hub:</strong> Combined the Facebook Members Community and the Biz
              Resource Center into one centralized platform. The Hub includes full access to policies, trainings, tools,
              and a new communication feature allowing members to chat 1:1, by chapter, or organization-wide.
            </li>
          </ul>

          <h2>March 2025</h2>
          <ul>
            <li>
              <strong>Launch of "A New Way of Networking" Guest Day Strategy:</strong> Rolled out a fresh, interactive
              format for guest events—replacing traditional presentations with conversational, connection-focused
              experiences that engage both guests and members more deeply.
            </li>
          </ul>

          <h2>October 2024</h2>
          <ul>
            <li>
              <strong>$ in Biz Button for Referrals:</strong> Members can now open a referral they've received and
              attach the amount of business generated directly to a referral, making it easier to track the value of
              referrals.
            </li>
            <li>
              <strong>Expanded Member Center FAQ:</strong> We've updated the FAQ/Support section to include information
              on recent features and updates, making it easier for members to stay informed of changes.
            </li>
          </ul>

          <h2>September 2024</h2>
          <ul>
            <li>
              <strong>"Proud Member of Biz" Badge:</strong> Members now have access to a "Proud Member of Biz" badge on
              their profile page. This badge comes with an embedded code that can be added to your website, email
              signature, or elsewhere, and links directly to your public Biz to Biz member profile.
            </li>
            <li>
              <strong>Chapter Image Feature:</strong> Chapter leaders can now upload a photo to be displayed on their
              chapter's profile page, personalizing your chapter's online presence.
            </li>
          </ul>

          <h2>July 2024</h2>
          <ul>
            <li>
              <strong>Chapter Description Feature:</strong> Chapter leadership can now add or edit a chapter
              description, which will appear both on the public chapter page and in the Member Center.
            </li>
          </ul>

          <h2>June 2024</h2>
          <ul>
            <li>
              <strong>Slugified URLs for Chapter and Member Pages:</strong> We updated the URLs for chapter and member
              profile pages to include their names, enhancing search engine optimization (SEO) for both chapters and
              individual members.
            </li>
          </ul>

          <h2>May 2024</h2>
          <ul>
            <li>
              <strong>Substitute Request Feature:</strong> Members can now indicate their availability as a substitute
              and request a substitute directly from the Member Center.
            </li>
          </ul>

          <h2>April 2024</h2>
          <ul>
            <li>
              <strong>Improved Member Center Functionality:</strong> Several updates have been made to enhance
              functionality in the Member Center, including improved member searches for sending and receiving
              referrals.
            </li>
          </ul>

          <h2>March 2024</h2>
          <ul>
            <li>
              <strong>Chapter Map with Search Feature:</strong> Visitors to our website can now view chapters on an
              interactive map. The search feature allows filtering by industry, members, and location, making it easier
              to connect with chapters of interest.
            </li>
            <li>
              <strong>"Now Forming" Chapter Pages:</strong> Chapters in the "Now Forming" stage display secured
              industries on their public pages to highlight available opportunities.
            </li>
            <li>
              <strong>Email All Members Feature:</strong> Members can now email all active members within their chapter
              directly from their chapter page in the Member Center with a single click.
            </li>
          </ul>

          <h2>January 2024</h2>
          <ul>
            <li>
              <strong>Attendance Tracking for Leaders:</strong> Leaders now have the ability to track and log attendance
              in real-time, along with access to reports by member and by meeting to improve engagement tracking.
            </li>
          </ul>

          <h2>December 2023</h2>
          <ul>
            <li>
              <strong>The Ability to Track Power Hours Added to Member Dashboard:</strong> Members can now track their
              Power Hours directly from their dashboard, making it easier to monitor progress with this important
              metric.
            </li>
            <li>
              <strong>Leader Reports Added to Member Center:</strong> Chapter leaders can now access detailed reports on
              member renewals, referrals sent and received, business generated (measured in $ in Biz), and Power Hours
              logged by each member, supporting proactive chapter management.
            </li>
          </ul>

          <h2>October 2023</h2>
          <ul>
            <li>
              <strong>Enhanced Online Application Process:</strong> We've streamlined our online application, adding
              additional information to provide full transparency for prospective members.
            </li>
          </ul>

          <h2>September 2023</h2>
          <ul>
            <li>
              <strong>New Look with Mobile-Friendly Website and Member Center:</strong> We launched a mobile-responsive
              design to improve the user experience for both members and website visitors, offering smoother navigation
              across devices.
            </li>
          </ul>

          <h2>August 2023</h2>
          <ul>
            <li>
              <strong>New & Improved Biz Resource Center:</strong> We've reorganized and enhanced the Biz Resource
              Center to provide better support for both new and existing members. This includes onboarding training for
              new members and leaders, training modules for chapter meetings, a comprehensive leader resource section,
              access to Biz to Biz policies, forms, Biz merchandise, and "Bizness" Skills recordings—a series of
              business training sessions led by members, for members.
            </li>
          </ul>
        </div>
      </div>
    </WebUiContainer>
  )
}
