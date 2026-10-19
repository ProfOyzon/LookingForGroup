import type { ProjectReactionCount } from '@looking-for-group/shared';
import { PROJECT_REACTIONS } from '#config/project-reactions.ts';

//map the reactions on a project to a count per reaction
//only reactions that were used are returned, in the order PROJECT_REACTIONS lists them
export const transformProjectToReactions = (project: {
  projectReactions: { reaction: string }[];
}): ProjectReactionCount[] => {
  const counts = new Map<string, number>();
  for (const { reaction } of project.projectReactions) {
    counts.set(reaction, (counts.get(reaction) ?? 0) + 1);
  }

  return PROJECT_REACTIONS.filter((reaction) => counts.has(reaction)).map((reaction) => ({
    reaction,
    count: counts.get(reaction) as number,
  }));
};
