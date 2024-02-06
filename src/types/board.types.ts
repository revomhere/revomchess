import { Colors, Figures } from '@/enums'

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
