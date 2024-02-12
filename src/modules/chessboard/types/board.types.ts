import { Colors, Figures } from '@/modules/chessboard/enums'

export type Coords = {
  x: number // 0 - 7
  y: number // 0 - 7
}

export type Figure = {
  id: number
  type: Figures
  color: Colors
}

export type BoardConfiguration = (Figure | null)[][]

export type Move = {
  to: Coords
  id: number
}

export type GameHistory = Move[][] // [ [firstWhite, firstBlack] ]
