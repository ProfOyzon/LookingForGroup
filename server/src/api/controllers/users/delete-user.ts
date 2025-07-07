import type { Request, Response } from 'express';
import prisma from '#config/prisma.ts';

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userIdStr } = req.params;

  const userId = parseInt(userIdStr);

  try {
    await Promise.all([
      prisma.userFollowings.deleteMany({ where: { userId } }),
      prisma.userSkills.deleteMany({ where: { userId } }),
      prisma.userSocials.deleteMany({ where: { userId } }),
      prisma.users.delete({ where: { userId } }),
      prisma.projectFollowings.deleteMany({ where: { userId } }),
    ]);

    res.status(200).json('good!');
  } catch (e) {
    console.error(`Error in getUserFollowing: ${JSON.stringify(e)}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
