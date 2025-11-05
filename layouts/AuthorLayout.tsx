import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Link from '@/components/Link'
import type { Talks } from 'contentlayer/generated'
import { allTalks } from 'contentlayer/generated'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import Spotify from '@/components/Spotify'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, location, occupation, email, x, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={250}
                className="h-48 w-48 rounded-full"
              />
            )}
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{location}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} />
              <SocialIcon kind="x" href={x} />
            </div>
            <Spotify />
          </div>
          <div className="prose max-w-none dark:prose-invert xl:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="border-b-2 border-gray-200 pb-2 text-2xl font-bold leading-8 tracking-tight dark:border-gray-700">
                  Bio
                </h2>
                {children}
              </div>
              <div className="not-prose pt-8 text-center">
                <a
                  href="/static/resume/Steven_Nguyen_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Resume
                </a>
              </div>
              <div className="not-prose">
                <h2 className="border-b-2 border-gray-200 pb-2 text-2xl font-bold leading-8 tracking-tight dark:border-gray-700">
                  Experience
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Graduate Research Assistant</h3>
                      <p className="text-gray-500">
                        <a
                          href="https://www.utsa.edu/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/University_of_Texas_at_San_Antonio_seal.svg/800px-University_of_Texas_at_San_Antonio_seal.svg.png"
                            alt="UTSA Logo"
                            width={25}
                            height={25}
                            className="mr-2 inline"
                            style={{ minWidth: 25, minHeight: 25 }}
                            unoptimized
                          />
                          The University of Texas at San Antonio
                        </a>
                      </p>
                    </div>
                    <span className="group relative text-gray-400">Sept 2025 - Present</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Cloud Engineer</h3>
                      <p className="text-gray-500">
                        <a
                          href="https://viettel.com.vn/en/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                            alt="Viettel Logo"
                            width={40}
                            height={40}
                            className="mr-2 inline"
                            style={{ minWidth: 40, minHeight: 40 }}
                            unoptimized
                          />
                          Viettel Group
                        </a>
                      </p>
                    </div>
                    <span className="group relative text-gray-400">Jan 2023 - Apr 2025</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Software Engineer</h3>
                      <p className="text-gray-500">
                        <a
                          href="https://viettel.com.vn/en/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                            alt="Viettel Logo"
                            width={40}
                            height={40}
                            className="mr-2 inline"
                            style={{ minWidth: 40, minHeight: 40 }}
                            unoptimized
                          />
                          Viettel Group
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">Aug 2022 - Dec 2022</span>
                  </li>
                </ul>
              </div>
              <div className="not-prose">
                <h2 className="border-b-2 border-gray-200 pb-2 text-2xl font-bold leading-8 tracking-tight dark:border-gray-700">
                  Talks 🎤
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-500 dark:text-gray-400">
                  {allTalks
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (descending)
                    .map((talk: Talks) => {
                      return (
                        <li key={talk.event} className="flex items-center justify-between">
                          <div>
                            <h3 className="text-gray-500">
                              <a
                                href={talk.url || '#'}
                                className="text-blue-500 no-underline hover:text-blue-700"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {talk.event}
                              </a>
                            </h3>
                            {/* <p className="text-gray-500">Honors Program</p> */}
                            <p className="text-gray-500"></p>
                          </div>
                          <span className="text-gray-400">
                            <time suppressHydrationWarning dateTime={talk.date}>
                              {formatDate(talk.date, siteMetadata.locale)}
                            </time>
                          </span>
                        </li>
                      )
                    })}
                </ul>
              </div>
              <div className="not-prose">
                <h2 className="border-b-2 border-gray-200 pb-2 text-2xl font-bold leading-8 tracking-tight dark:border-gray-700">
                  Education
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Master of Science in Computer Engineering
                      </h3>
                      <p className="text-gray-500">
                        <a
                          href="https://www.utsa.edu/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="mr-2 inline-flex items-center justify-center rounded-full bg-white"
                            style={{ width: 25, height: 25 }}
                          >
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/University_of_Texas_at_San_Antonio_seal.svg/800px-University_of_Texas_at_San_Antonio_seal.svg.png"
                              alt="UTSA Logo"
                              width={25}
                              height={25}
                              style={{ display: 'block', maxWidth: 25, maxHeight: 25 }}
                              unoptimized
                            />
                          </span>
                          The University of Texas at San Antonio
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">Aug 2025 - Present</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Degree of Engineer in Information Technology
                      </h3>
                      <p className="text-gray-500">Honors Program</p>
                      <p className="text-gray-500">
                        <a
                          href="https://uet.vnu.edu.vn"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="mr-2 inline-flex items-center justify-center rounded-full bg-white"
                            style={{ width: 25, height: 25 }}
                          >
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/vi/b/bf/Logo_HUET.svg"
                              alt="UET Logo"
                              width={25}
                              height={25}
                              style={{ display: 'block', maxWidth: 25, maxHeight: 25 }}
                              unoptimized
                            />
                          </span>
                          VNU University of Engineering and Technology
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">Oct 2020 - Dec 2024</span>
                  </li>
                </ul>
              </div>
              <div className="not-prose">
                <h2 className="border-b-2 border-gray-200 pb-2 text-2xl font-bold leading-8 tracking-tight dark:border-gray-700">
                  Awards
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        ECE Pioneering Competitive Scholarship 🏅
                      </h3>
                      <p className="text-gray-500">
                        Electrical and Computer Engineering Department
                      </p>
                      <p className="text-gray-500">
                        <a
                          href="https://www.utsa.edu/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/University_of_Texas_at_San_Antonio_seal.svg/800px-University_of_Texas_at_San_Antonio_seal.svg.png"
                            alt="UTSA Logo"
                            width={25}
                            height={25}
                            className="mr-2 inline"
                            style={{ minWidth: 25, minHeight: 25 }}
                            unoptimized
                          />
                          The University of Texas at San Antonio
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">2025</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Viettel Digital Talent
                        <a
                          href="https://jobs.viettel.vn/content/Viettel-Digital-Talent/?locale=en_US"
                          className="text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {' '}
                          🏅
                        </a>
                      </h3>
                      <p className="text-gray-500">Talent Engineer in Cloud Computing</p>
                      <p className="text-gray-500">
                        <a
                          href="https://viettel.com.vn/en/"
                          className="flex items-center text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Viettel_logo_2021.svg"
                            alt="Viettel Logo"
                            width={40}
                            height={40}
                            className="mr-2 inline"
                            style={{ minWidth: 40, minHeight: 40 }}
                            unoptimized
                          />
                          Viettel Group
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">2023</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
