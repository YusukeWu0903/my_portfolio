import { notFound } from 'next/navigation';
import { projects } from '../../data/projects';
import OpeningProject from './OpeningProject';

export default async function OpenProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find(item => item.id === id);

  if (!project) notFound();

  return <OpeningProject title={project.title} destination={project.link} />;
}
