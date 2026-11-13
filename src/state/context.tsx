import { createContext, useContext, type Dispatch } from 'react';
import type { Action, GameState } from './game';

export type GameCtx = { state: GameState; dispatch: Dispatch<Action> };

export const GameContext = createContext<GameCtx | null>(null);

export function useGame(): GameCtx {
  const v = useContext(GameContext);
  if (!v) throw new Error('useGame doit être utilisé dans <GameContext.Provider>');
  return v;
}
