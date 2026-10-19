import type { ApiResponse, AuthenticatedRequest } from '@looking-for-group/shared';
import type { Response } from 'express';
import { isProjectReaction } from '#config/project-reactions.ts';
import { deleteProjectReactionService } from '#services/me/reactions/delete-project-reaction.ts';

//DELETE api/me/reactions/projects/{id}/{reaction}
//remove the user's reaction from a project
export const deleteProjectReaction = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const projectId = parseInt(req.params.id as string);
  const reaction = req.params.reaction;

  if (!isProjectReaction(reaction)) {
    const resBody: ApiResponse = {
      status: 400,
      error: 'Invalid reaction',
      data: null,
    };
    res.status(400).json(resBody);
    return;
  }

  const result = await deleteProjectReactionService(req.currentUser.userId, projectId, reaction);

  if (result === 'INTERNAL_ERROR') {
    const resBody: ApiResponse = {
      status: 500,
      error: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(resBody);
    return;
  }

  if (result === 'NOT_FOUND') {
    const resBody: ApiResponse = {
      status: 404,
      error: 'Reaction not found on project',
      data: null,
    };
    res.status(404).json(resBody);
    return;
  }

  const resBody: ApiResponse<null> = {
    status: 200,
    error: null,
    data: null,
  };
  res.status(200).json(resBody);
};
