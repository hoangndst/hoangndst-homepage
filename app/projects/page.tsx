import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'
import GithubCalendar from '@/components/Github'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Here are some projects I've worked on recently.
          </p>
          <GithubCalendar username="hoangndst" />
        </div>
        <div className="container py-6">
          <ul className="pt-4">
            {projectsData.map((project) => (
              <li key={project.title} className="px-1 py-2 sm:px-1 sm:py-2">
                <article className="flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 transition-colors duration-150 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 sm:flex-row">
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
                          className="aspect-video w-full rounded-lg object-cover object-center sm:w-[300px]"
                          width={300}
                          height={158}
                        />
                      </Link>
                    ) : (
                      <Image
                        alt={project.title}
                        src={project.imgSrc || '/static/images/golang.png'}
                        className="aspect-video w-full rounded-lg object-cover object-center sm:w-[300px]"
                        width={300}
                        height={158}
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl">
                        {project.href ? (
                          <Link
                            href={project.href}
                            className="text-gray-900 dark:text-gray-100"
                            target="_blank"
                            aria-label={`Link to ${project.title}`}
                          >
                            {project.title}
                          </Link>
                        ) : (
                          project.title
                        )}
                      </h2>
                      <div className="prose mt-2 max-w-none text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        {project.description}
                      </div>
                      {project.href && (
                        <Link
                          href={project.href}
                          className="mt-3 inline-block text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Link to ${project.title}`}
                        >
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
    </SectionContainer>
  )
}
