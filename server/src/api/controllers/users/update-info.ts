import type { RequestHandler } from 'express';
import type { users_academic_year } from '#prisma-models/index.js';
import { updateUserInfoService } from '#services/users/update-info.ts';

interface UpdateUserInfo {
  firstName?: string;
  lastName?: string;
  headline?: string;
  pronouns?: string;
  jobTitleId?: number;
  majorId?: number;
  academic_year?: users_academic_year | null;
  location?: string;
  funFact?: string;
  bio?: string;
}

export const updateUserInfo: RequestHandler<{ id: string }, unknown, UpdateUserInfo> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const updates = req.body;

  //validate ID
  const userId = parseInt(id);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  //fields that can be updated
  const updateFields = [
    'firstName',
    'lastName',
    'headline',
    'pronouns',
    'jobTitleId',
    'majorId',
    'academic_year',
    'location',
    'funFact',
    'bio',
  ];

  //validate update fields
  const invalid = Object.keys(updates).filter((field) => !updateFields.includes(field));

  if (invalid.length > 0) {
    res.status(400).json({ message: `Invalid fields: ${invalid}` });
    return;
  }

  const result = await updateUserInfoService(userId, updates);

  if (result === 'NOT_FOUND') {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (result === 'INTERNAL_ERROR') {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  res.status(200).json(result);
};
