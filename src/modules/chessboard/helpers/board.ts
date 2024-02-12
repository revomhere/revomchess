import { Colors, Figures } from '@/modules/chessboard/enums'
import { BoardConfiguration, Coords, Figure } from '@/modules/chessboard/types'

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

export const getFiguresFromBoardConfig = (
  boardConfig: BoardConfiguration,
): (Figure & Coords)[] => {
  const figures: (Figure & Coords)[] = []

  boardConfig.forEach((row, y) => {
    row.forEach((figure, x) => {
      if (figure) figures.push({ ...figure, x, y })
    })
  })

  return figures
}
