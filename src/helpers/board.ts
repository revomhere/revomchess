import { Colors, Figures } from '@/enums'
import { BoardConfiguration, Coords, Figure } from '@/types'

export const isMoveEnPassant = (
  coords: Coords,
  boardConfig: BoardConfiguration,
  chosenFigure?: Figure | null,
) => {
  if (!chosenFigure) return false

  if (chosenFigure.type !== Figures.Pawn) return false

  const { x, y } = coords

  if (!boardConfig || boardConfig?.[y]?.[x] !== null) return false

  const direction = chosenFigure.color === Colors.White ? 1 : -1

  return (
    boardConfig?.[y + direction]?.[x]?.type === Figures.Pawn &&
    boardConfig?.[y + direction]?.[x]?.color !== chosenFigure.color
  )
}
