import { Context } from '@/database/prisma.context';
import useCareerPath from '@/hooks/useCareerPath';
import { Player } from '@prisma/client';
import { act, renderHook, waitFor } from '@testing-library/react';
import 'reflect-metadata';
import { createMockContext, MockContext } from '../../mocks/prisma.mock';

describe('useCareerPath', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  let mockPlayer: Player;

  beforeAll(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    mockPlayer = {
      id: 0,
      first_name: null,
      last_name: null,
      display_first_last: null,
      display_fi_last: null,
      birthdate: null,
      school: null,
      country: null,
      height: null,
      weight: null,
      season_exp: null,
      jersey: null,
      position: null,
      team_history: null,
      from_year: null,
      to_year: null,
      total_games_played: null,
      draft_year: null,
      draft_round: null,
      draft_number: null,
      isActive: null,
    };
    mockCtx.prisma.player.findMany.mockResolvedValue([mockPlayer]);
    mockCtx.prisma.player.findFirst.mockResolvedValue(mockPlayer);
  });

  it('Initializes with no answer', () => {
    const { result } = renderHook(() => useCareerPath(ctx));
    expect(result.current.currentPlayer).toBe(null);
  });

  it('Starts game and sets currentPlayer', async () => {
    const { result } = renderHook(() => useCareerPath(ctx));

    act(() => {
      result.current.setPlayerPoolFilter({ isActive: { equals: true } });
      result.current.onStart();
    });

    await waitFor(() => expect(result.current.currentPlayer).toBe(mockPlayer));
  });
});
