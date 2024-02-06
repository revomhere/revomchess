import { Coords } from './board.types'

export type Move = {
  to: Coords
  id: number
}

export type GameHistory = Move[][] // [ [firstWhite, firstBlack] ]
