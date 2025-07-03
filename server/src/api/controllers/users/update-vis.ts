import type { RequestHandler } from 'express';
import { updateUserVisibilityService } from '#services/users/update-vis.ts';

export const updateVisibility: RequestHandler<
  { id: string },
  unknown,
  { visibility?: number }
> = async (req, res) => {
  const { id } = req.params;
  const { visibility: newVisibility } = req.body;

  //validate ID
  const userId = parseInt(id);
  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  //validate visibility num
  if (typeof newVisibility !== 'number' || (newVisibility !== 0 && newVisibility !== 1)) {
    res.status(400).json({ message: 'Visibility must be 0 (private) or 1(public)' });
    return;
  }

  //update username
  const result = await updateUserVisibilityService(userId, newVisibility);

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
