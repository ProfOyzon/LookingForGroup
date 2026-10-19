import type { ApiResponse, AuthenticatedRequest } from '@looking-for-group/shared';
import type { Response } from 'express';
import { getMyProjectReactionsService } from '#services/me/reactions/get-my-project-reactions.ts';

//GET api/me/reactions/projects
//get every project reaction the user has left
export const getMyProjectReactions = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const result = await getMyProjectReactionsService(req.currentUser.userId);

  if (result === 'INTERNAL_ERROR') {
    const resBody: ApiResponse = {
      status: 500,
      error: 'Internal Server Error',
      data: null,
    };
    res.status(500).json(resBody);
    return;
  }

  const resBody: ApiResponse<typeof result> = {
    status: 200,
    error: null,
    data: result,
  };
  res.status(200).json(resBody);
};
