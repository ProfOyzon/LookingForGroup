import type { Request, Response } from 'express';
import prisma from '#config/prisma.ts';

//get the user by the username
export const deleteFollowing = async (req: Request, res: Response): Promise<void> => {
  const { userIdStr, followingIdStr } = req.params;

  const userId = parseInt(userIdStr);
  const followingId = parseInt(followingIdStr);

  try {
    await prisma.userFollowings.delete({
      where: {
        userId_followingId: {
          userId,
          followingId,
        },
      },
    });

    res.status(200).json('good!');
  } catch (e) {
    console.error(`Error in getUserFollowing: ${JSON.stringify(e)}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
