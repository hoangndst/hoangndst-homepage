import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'
import GithubCalendar from '@/components/Github'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Link from '@/components/Link'
import { Github as GithubIcon } from '@/components/social-icons/icons'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = genPageMetadata({ title: 'Projects' })

const isGithubUrl = (url?: string) =>
  Boolean(url && /(^https?:\/\/)?(www\.)?github\.com\/.+/i.test(url))

export default function Projects() {
  return (
    <SectionContainer>
      <div className="mx-auto w-full sm:max-w-[768px]">
        <div>
          <div className="space-y-2 pb-4 pt-6 md:space-y-5">
            <Breadcrumb />
            <GithubCalendar username="hoangndst" />
          </div>
          <div className="py-1">
            <ul className="space-y-3 pt-1">
              {projectsData.length === 0 && (
                <li className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  No projects found.
                </li>
              )}
              {projectsData.map((project) => (
                <li key={project.title}>
                  <article className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200/90 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 sm:flex-row sm:p-4">
                    <div className="w-full flex-shrink-0 sm:block sm:w-auto">
                      {project.href ? (
                        <Link
                          href={project.href}
                          target="_blank"
                          className="block w-full"
                          aria-label={`Link to ${project.title}`}
                        >
                          <Image
                            alt={project.title}
                            src={project.imgSrc || '/static/images/golang.png'}
                            className="aspect-video w-full rounded-lg border border-gray-200 object-cover object-center dark:border-gray-800 sm:w-[260px]"
                            width={260}
                            height={146}
                          />
                        </Link>
                      ) : (
                        <Image
                          alt={project.title}
                          src={project.imgSrc || '/static/images/golang.png'}
                          className="aspect-video w-full rounded-lg border border-gray-200 object-cover object-center dark:border-gray-800 sm:w-[260px]"
                          width={260}
                          height={146}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-base font-bold leading-7 tracking-tight text-gray-900 dark:text-gray-100 sm:text-lg">
                          {project.href ? (
                            <Link
                              href={project.href}
                              className="text-gray-900 transition-colors duration-200 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                              target="_blank"
                              aria-label={`Link to ${project.title}`}
                            >
                              {project.title}
                            </Link>
                          ) : (
                            project.title
                          )}
                        </h2>
                        <p className="mt-1.5 text-xs leading-6 text-gray-600 dark:text-gray-300">
                          {project.description}
                        </p>
                        {project.href && (
                          <Link
                            href={project.href}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-primary-600 transition-colors duration-150 hover:bg-gray-200 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
                            aria-label={`Link to ${project.title}`}
                          >
                            {isGithubUrl(project.href) && (
                              <GithubIcon className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                            )}
                            Learn more
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
