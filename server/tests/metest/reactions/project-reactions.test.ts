import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '#config/prisma.ts';
import { addProjectReactionService } from '#services/me/reactions/add-project-reaction.ts';
import { deleteProjectReactionService } from '#services/me/reactions/delete-project-reaction.ts';
import { getMyProjectReactionsService } from '#services/me/reactions/get-my-project-reactions.ts';

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

vi.mock('#config/prisma.ts', () => ({
  default: {
    projects: {
      findFirst: vi.fn(),
    },
    projectReactions: {
      create: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('addProjectReactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('returns NOT_FOUND when the project is missing, unapproved or private', async () => {
    vi.mocked(prisma.projects.findFirst).mockResolvedValue(null);

    const result = await addProjectReactionService(1, 2, 'fire');

    expect(result).toBe('NOT_FOUND');
    expect(prisma.projectReactions.create).not.toHaveBeenCalled();
  });

  it('only looks for approved, public projects', async () => {
    vi.mocked(prisma.projects.findFirst).mockResolvedValue(null);

    await addProjectReactionService(1, 2, 'fire');

    expect(prisma.projects.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { projectId: 2, approved: true, globalVisibility: 'public' },
      }),
    );
  });

  it('returns CONFLICT when the user already used that reaction', async () => {
    vi.mocked(prisma.projects.findFirst).mockResolvedValue({ projectId: 2 } as any);
    vi.mocked(prisma.projectReactions.create).mockRejectedValue({ code: 'P2002' });

    const result = await addProjectReactionService(1, 2, 'fire');

    expect(result).toBe('CONFLICT');
  });

  it('returns the reaction after adding it', async () => {
    vi.mocked(prisma.projects.findFirst).mockResolvedValue({ projectId: 2 } as any);
    vi.mocked(prisma.projectReactions.create).mockResolvedValue({} as any);

    const result = await addProjectReactionService(1, 2, 'thumbs-up');

    expect(result).toStrictEqual({ projectId: 2, reaction: 'thumbs-up' });
    expect(prisma.projectReactions.create).toHaveBeenCalledWith({
      data: { userId: 1, projectId: 2, reaction: 'thumbs-up' },
    });
  });

  it('returns INTERNAL_ERROR when prisma throws', async () => {
    vi.mocked(prisma.projects.findFirst).mockRejectedValue(new Error('db cursed'));

    const result = await addProjectReactionService(1, 2, 'fire');

    expect(result).toBe('INTERNAL_ERROR');
  });
});

describe('deleteProjectReactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('returns NO_CONTENT after removing the reaction', async () => {
    vi.mocked(prisma.projectReactions.deleteMany).mockResolvedValue({ count: 1 });

    const result = await deleteProjectReactionService(1, 2, 'laugh');

    expect(result).toBe('NO_CONTENT');
    expect(prisma.projectReactions.deleteMany).toHaveBeenCalledWith({
      where: { userId: 1, projectId: 2, reaction: 'laugh' },
    });
  });

  it('returns NOT_FOUND when the user never used that reaction', async () => {
    vi.mocked(prisma.projectReactions.deleteMany).mockResolvedValue({ count: 0 });

    const result = await deleteProjectReactionService(1, 2, 'laugh');

    expect(result).toBe('NOT_FOUND');
  });

  it('returns INTERNAL_ERROR when prisma throws', async () => {
    vi.mocked(prisma.projectReactions.deleteMany).mockRejectedValue(new Error('db cursed'));

    const result = await deleteProjectReactionService(1, 2, 'laugh');

    expect(result).toBe('INTERNAL_ERROR');
  });
});

describe('getMyProjectReactionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it("returns the user's reactions", async () => {
    vi.mocked(prisma.projectReactions.findMany).mockResolvedValue([
      { projectId: 2, reaction: 'fire' },
      { projectId: 2, reaction: 'smile' },
      { projectId: 5, reaction: 'fire' },
    ] as any);

    const result = await getMyProjectReactionsService(1);

    expect(result).toStrictEqual([
      { projectId: 2, reaction: 'fire' },
      { projectId: 2, reaction: 'smile' },
      { projectId: 5, reaction: 'fire' },
    ]);
    expect(prisma.projectReactions.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 1 } }),
    );
  });

  it('returns INTERNAL_ERROR when prisma throws', async () => {
    vi.mocked(prisma.projectReactions.findMany).mockRejectedValue(new Error('db cursed'));

    const result = await getMyProjectReactionsService(1);

    expect(result).toBe('INTERNAL_ERROR');
  });
});
