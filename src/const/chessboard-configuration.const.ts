import { Colors, Figures } from '@/enums'
import { BoardConfiguration } from '@/types'

export const BASIC_CHESSBOARD_CONFIGURATION: BoardConfiguration = [
  [
    { type: Figures.Rook, color: Colors.Black, id: 0 },
    { type: Figures.Knight, color: Colors.Black, id: 1 },
    { type: Figures.Bishop, color: Colors.Black, id: 2 },
    { type: Figures.Queen, color: Colors.Black, id: 3 },
    { type: Figures.King, color: Colors.Black, id: 4 },
    { type: Figures.Bishop, color: Colors.Black, id: 5 },
    { type: Figures.Knight, color: Colors.Black, id: 6 },
    { type: Figures.Rook, color: Colors.Black, id: 7 },
  ],
  [
    { type: Figures.Pawn, color: Colors.Black, id: 8 },
    { type: Figures.Pawn, color: Colors.Black, id: 9 },
    { type: Figures.Pawn, color: Colors.Black, id: 10 },
    { type: Figures.Pawn, color: Colors.Black, id: 11 },
    { type: Figures.Pawn, color: Colors.Black, id: 12 },
    { type: Figures.Pawn, color: Colors.Black, id: 13 },
    { type: Figures.Pawn, color: Colors.Black, id: 14 },
    { type: Figures.Pawn, color: Colors.Black, id: 15 },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: Figures.Pawn, color: Colors.White, id: 16 },
    { type: Figures.Pawn, color: Colors.White, id: 17 },
    { type: Figures.Pawn, color: Colors.White, id: 18 },
    { type: Figures.Pawn, color: Colors.White, id: 19 },
    { type: Figures.Pawn, color: Colors.White, id: 20 },
    { type: Figures.Pawn, color: Colors.White, id: 21 },
    { type: Figures.Pawn, color: Colors.White, id: 22 },
    { type: Figures.Pawn, color: Colors.White, id: 23 },
  ],
  [
    { type: Figures.Rook, color: Colors.White, id: 24 },
    { type: Figures.Knight, color: Colors.White, id: 25 },
    { type: Figures.Bishop, color: Colors.White, id: 26 },
    { type: Figures.Queen, color: Colors.White, id: 27 },
    { type: Figures.King, color: Colors.White, id: 28 },
    { type: Figures.Bishop, color: Colors.White, id: 29 },
    { type: Figures.Knight, color: Colors.White, id: 30 },
    { type: Figures.Rook, color: Colors.White, id: 31 },
  ],
]
