import type { Request, Response } from 'express';
import prisma from '#config/prisma.ts';

//get the user by the username
export const getUserFollowing = async (req: Request, res: Response): Promise<void> => {
  const { userIdStr } = req.params;

  const userId = parseInt(userIdStr);

  try {
    //should be unique
    const followings = await prisma.userFollowings.findMany({
      where: { userId },
      select: {
        userId: true,
        followingId: true,
        followedAt: true,
      },
    });

    res.status(200).json(followings);
  } catch (e) {
    console.error(`Error in getUserFollowing: ${JSON.stringify(e)}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
