import type { ApiResponse, AuthenticatedRequest } from '@looking-for-group/shared';
import type { Response } from 'express';
import { isProjectReaction } from '#config/project-reactions.ts';
import { addProjectReactionService } from '#services/me/reactions/add-project-reaction.ts';

//POST api/me/reactions/projects/{id}
//add the user's reaction to a project
export const addProjectReaction = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const projectId = parseInt(req.params.id as string);
  const reaction = (req.body as { reaction?: unknown } | undefined)?.reaction;

  if (!isProjectReaction(reaction)) {
    const resBody: ApiResponse = {
      status: 400,
      error: 'Invalid reaction',
      data: null,
    };
    res.status(400).json(resBody);
    return;
  }

  const result = await addProjectReactionService(req.currentUser.userId, projectId, reaction);

  if (result === 'CONFLICT') {
    const resBody: ApiResponse = {
      status: 409,
      error: 'Already reacted to project with this reaction',
      data: null,
    };
    res.status(409).json(resBody);
    return;
  }

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
      error: 'Project not found',
      data: null,
    };
    res.status(404).json(resBody);
    return;
  }

  const resBody: ApiResponse<typeof result> = {
    status: 201,
    error: null,
    data: result,
  };
  res.status(201).json(resBody);
};
