import { ProjectFollowerSelector } from './parts/project-follower.ts';
import { ProjectReactionsSelector } from './parts/project-reactions.ts';
import { ProjectDetailSelector } from './project-detail.ts';

export const ProjectWithFollowersSelector = Object.freeze({
  _count: {
    select: {
      projectFollowings: true,
    },
  },
  ...ProjectDetailSelector,
  ...ProjectReactionsSelector,
  projectFollowings: {
    select: ProjectFollowerSelector,
  },
});
