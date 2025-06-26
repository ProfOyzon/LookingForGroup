import type { Request, Response } from 'express';
import prisma from '#config/prisma.ts';

/// This is an example of what a controller showcasing how the prisma database calls work

const getUsernames = async (request: Request, response: Response) => {
  response.json(
    await prisma.users.findMany({ where: { visibility: 1 }, select: { username: true } }),
  );
};

export default getUsernames;
