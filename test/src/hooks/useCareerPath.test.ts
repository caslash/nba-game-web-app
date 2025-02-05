import { Context } from '@/database/prisma.context';
import useCareerPath from '@/hooks/useCareerPath';
import { Player } from '@prisma/client';
import { act, renderHook, waitFor } from '@testing-library/react';
import 'reflect-metadata';
import { mockPlayer } from '../../mixins';
import { createMockContext, MockContext } from '../../mocks/prisma.mock';

describe('useCareerPath', () => {
  let mockCtx: MockContext;
  let ctx: Context;

  let mockPlayer1: Player;

  beforeAll(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    mockPlayer1 = mockPlayer();
    mockCtx.prisma.player.findMany.mockResolvedValue([mockPlayer1]);
    mockCtx.prisma.player.findFirst.mockResolvedValue(mockPlayer1);
  });

  it('Initializes with no answer', async () => {
    const { result } = renderHook(() => useCareerPath(ctx));
    await waitFor(() => expect(result.current.currentPlayer).toBe(null));
  });

  it('Initializes without specifying context', async () => {
    const { result } = renderHook(() => useCareerPath());
    await waitFor(() => expect(result.current.currentPlayer).toBe(null));
  });

  it('Starts game and sets currentPlayer', async () => {
    const { result } = renderHook(() => useCareerPath(ctx));

    act(() => result.current.onStart());

    await waitFor(() => expect(result.current.currentPlayer).toBe(mockPlayer1));
  });

  it('Checks correct guess', async () => {
    const { result } = renderHook(() => useCareerPath(ctx));

    const onCorrect = jest.fn(() => {});
    const onIncorrect = jest.fn(() => {});

    act(() => result.current.onStart());

    await waitFor(() => expect(result.current.currentPlayer).toBe(mockPlayer1));

    act(() => result.current.checkGuess(mockPlayer1.id, onCorrect, onIncorrect));

    await waitFor(() => expect(onCorrect).toHaveBeenCalledWith(mockPlayer1));

    expect(onIncorrect).not.toHaveBeenCalled();
  });

  it('Checks incorrect guess', async () => {
    const { result } = renderHook(() => useCareerPath(ctx));

    const onCorrect = jest.fn(() => {});
    const onIncorrect = jest.fn(() => {});

    act(() => result.current.onStart());

    await waitFor(() => expect(result.current.currentPlayer).toBe(mockPlayer1));

    act(() => result.current.checkGuess(-1, onCorrect, onIncorrect));

    await waitFor(() => expect(onIncorrect).toHaveBeenCalledWith([mockPlayer1]));

    expect(onCorrect).not.toHaveBeenCalled();
  });
});
