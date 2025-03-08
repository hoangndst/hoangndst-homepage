import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

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
              <SocialIcon kind="x" href={x} />
            </div>
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
                  href="/static/resume/HoangDinhNguyen_Resume.pdf"
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
                      <h3 className="text-lg font-semibold">Cloud Engineer</h3>
                      <p className="text-gray-500">
                        <a
                          href="https://viettel.com.vn/en/"
                          className="text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Viettel Group
                        </a>
                      </p>
                    </div>
                    <span className="group relative text-gray-400">Feb 2023 - Apr 2025</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Software Engineer Intern</h3>
                      <p className="text-gray-500">
                        <a
                          href="https://viettel.com.vn/en/"
                          className="text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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
                  Education
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Degree of Engineer in Information Technology
                      </h3>
                      <p className="text-gray-500">Honors Program</p>
                      <p className="text-gray-500">
                        <a
                          href="https://uet.vnu.edu.vn"
                          className="text-blue-500 no-underline hover:text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          VNU University of Engineering and Technology
                        </a>
                      </p>
                    </div>
                    <span className="text-gray-400">Oct 2020 - Dec 2024</span>
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
