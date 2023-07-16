import { UserProfile, ProjectInterface } from "@/common.types";
import { getUserProjects } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";

type Props = {
    userId: string;
    projectId: string;
}

const RelatedProjects = async ({ userId, projectId }: Props) => {

  const result = await getUserProjects(userId) as {user?: UserProfile}

  const filteredProjects = result?.user?.projects?.edges.filter(({ node }: { node: ProjectInterface }) => node?.id !== projectId)

  if(filteredProjects?.length === 0) return null;

  return (
    <section className="flex flex-col mt-28 w-full">
      <div className="flexBetween">
        <p className="text-base font-semibold">More by <span className="text-primary-purple font-semibold">{result?.user?.name}</span></p>
        <Link href={`/profile/${result?.user?.id}`}>
          <p className="text-primary-purple text-base">View All</p>
        </Link>
      </div>
      <div className="related_projects-grid py-5">
        {filteredProjects?.map(({ node }: { node: ProjectInterface }) => (
          <div className="flexCenter related_project-card drop-shadow-card">
            <Link href={`/project/${node?.id}`} className="flexCenter group relative w-full h-full">
              <Image src={node?.image} width={414} height={314} className="w-full h-full object-cover rounded-2xl" alt="project image"/>
              <div className="hidden group-hover:flex related_project-card_title">
                <p className="w-full text-white">{node?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProjects