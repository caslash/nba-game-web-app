import { Context } from '@/database/prisma.context';
import { getPlayer, getPlayerCount, getPlayers } from '@/server/actions';
import { Player } from '@prisma/client';
import { mockPlayer } from '../../mixins';
import { createMockContext, MockContext } from '../../mocks/prisma.mock';

describe('actions', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  let mockPlayer1: Player;
  let mockPlayer2: Player;

  beforeAll(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    mockPlayer1 = mockPlayer();
    mockPlayer2 = mockPlayer();

    mockCtx.prisma.player.findMany.mockResolvedValue([mockPlayer1, mockPlayer2]);
    mockCtx.prisma.player.findFirst.mockResolvedValue(mockPlayer1);
    mockCtx.prisma.player.count.mockResolvedValue(2);
  });

  it('Gets all players', async () => {
    const players = await getPlayers({ ctx });
    expect(players.length).toEqual(2);
  });

  it('Gets player', async () => {
    const player = await getPlayer({ ctx });
    expect(player?.id).toEqual(mockPlayer1.id);
  });

  it('Gets player count', async () => {
    const count = await getPlayerCount({ ctx });
    expect(count).toEqual(2);
  });
});
