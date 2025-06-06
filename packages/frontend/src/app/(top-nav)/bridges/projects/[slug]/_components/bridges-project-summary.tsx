import Link from 'next/link'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { FullPageHeader } from '~/components/full-page-header'
import { ArchivedBar } from '~/components/projects/archived-bar'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { DiscoUiLink } from '~/components/projects/links/disco-ui-link'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { AboutSection } from '~/components/projects/sections/about-section'
import { UnderReviewBar } from '~/components/projects/under-review-bar'
import { UpcomingBar } from '~/components/projects/upcoming-bar'
import { WarningBar } from '~/components/warning-bar'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { getUnderReviewText } from '~/utils/project/under-review'
import { BridgesProjectStats } from './bridges-project-stats'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectSummary({ project }: Props) {
  return (
    <FullPageHeader className="pb-0 pt-8 md:pb-8 md:pt-12">
      <section id="summary" className="w-full max-md:bg-header-primary">
        <div className="w-full space-y-4 md:space-y-6">
          <ProjectHeader project={project} />
          <div className="space-y-2">
            {project.archivedAt && <ArchivedBar />}
            {project.isUpcoming && <UpcomingBar />}
            {project.underReviewStatus && (
              <UnderReviewBar
                text={getUnderReviewText(project.underReviewStatus)}
              />
            )}
            {project.header.warning && (
              <WarningBar
                text={project.header.warning}
                color="yellow"
                className="w-full items-center justify-center p-2.5 text-xs md:text-base"
              />
            )}
          </div>
          {project.header.description && (
            <div className="md:hidden">
              <AboutSection description={project.header.description} />
            </div>
          )}
          <HorizontalSeparator className="my-4 max-md:-mx-4 max-md:w-screen md:!my-6 md:hidden" />

          <div className="max-md:hidden">
            <DesktopProjectLinks
              projectLinks={project.header.links}
              variant="header"
              discoUiHref={project.discoUiHref}
            />
          </div>
          <BridgesProjectStats project={project} />
        </div>

        <div className="md:hidden">
          <HorizontalSeparator className="mb-2 mt-4 max-md:-mx-4 max-md:w-screen md:hidden" />
          <div className="flex items-center justify-between">
            <Link
              className="text-xs text-link underline"
              href={project.discoUiHref}
            >
              Explore more in Discovery UI
            </Link>
            <DiscoUiLink href={project.discoUiHref} />
          </div>
        </div>

        <HorizontalSeparator className="mt-2 max-md:-mx-4 max-md:w-screen md:my-6" />
        <div className="md:hidden">
          <MobileProjectLinks projectLinks={project.header.links} />
        </div>
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 max-md:hidden md:px-0 lg:flex-row lg:gap-8">
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
      </section>
    </FullPageHeader>
  )
}
