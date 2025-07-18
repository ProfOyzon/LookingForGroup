import prisma from '#config/prisma.ts';
import type { ServiceErrorSubset } from '#services/service-error.ts';

type DeleteMemberServiceError = ServiceErrorSubset<'INTERNAL_ERROR' | 'NOT_FOUND'>;

const deleteMemberService = async (
  memberId: number
): Promise<{ id: number } | DeleteMemberServiceError> => {
  try {
    const member = await prisma.members.findUnique({ where: { memberId } });
    if (!member) return 'NOT_FOUND';

    await prisma.members.delete({ where: { memberId } });
    return { id: memberId };
  } catch (e) {
    console.error('Error in deleteMemberService:', e);
    return 'INTERNAL_ERROR';
  }
};

export default deleteMemberService;
