import { Colors, Figures } from '@/enums'
import { BoardConfiguration, Coords, GameHistory } from '@/types'

const getCoordsForKnightMoves = (coords: Coords) => {
  return [
    { x: coords.x + 2, y: coords.y + 1 },
    { x: coords.x + 2, y: coords.y - 1 },
    { x: coords.x - 2, y: coords.y + 1 },
    { x: coords.x - 2, y: coords.y - 1 },
    { x: coords.x + 1, y: coords.y + 2 },
    { x: coords.x + 1, y: coords.y - 2 },
    { x: coords.x - 1, y: coords.y + 2 },
    { x: coords.x - 1, y: coords.y - 2 },
  ]
}

const isKingChechedByPawnInCoords = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const direction = color === Colors.White ? -1 : 1

  const nextY = coords.y + direction

  if (
    coords.x >= 1 &&
    boardConfig[nextY][coords.x - 1] &&
    boardConfig[nextY][coords.x - 1]?.color !== color &&
    boardConfig[nextY][coords.x - 1]?.type === Figures.Pawn
  ) {
    return true
  }

  if (
    coords.x <= 6 &&
    boardConfig[nextY][coords.x + 1] &&
    boardConfig[nextY][coords.x + 1]?.color !== color &&
    boardConfig[nextY][coords.x + 1]?.type === Figures.Pawn
  ) {
    return true
  }

  return false
}

const isKingCheckedByKingInCoords = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const x = coords.x
  const y = coords.y

  if (
    x + 1 <= 7 &&
    boardConfig[y][x + 1] &&
    boardConfig[y][x + 1]?.color !== color &&
    boardConfig[y][x + 1]?.type === Figures.King
  ) {
    return true
  }

  if (
    x + 1 <= 7 &&
    y + 1 <= 7 &&
    boardConfig[y + 1][x + 1] &&
    boardConfig[y + 1][x + 1]?.color !== color &&
    boardConfig[y + 1][x + 1]?.type === Figures.King
  ) {
    return true
  }

  if (
    y + 1 <= 7 &&
    boardConfig[y + 1][x] &&
    boardConfig[y + 1][x]?.color !== color &&
    boardConfig[y + 1][x]?.type === Figures.King
  ) {
    return true
  }

  if (
    x - 1 >= 0 &&
    y + 1 <= 7 &&
    boardConfig[y + 1][x - 1] &&
    boardConfig[y + 1][x - 1]?.color !== color &&
    boardConfig[y + 1][x - 1]?.type === Figures.King
  ) {
    return true
  }

  if (
    x - 1 >= 0 &&
    boardConfig[y][x - 1] &&
    boardConfig[y][x - 1]?.color !== color &&
    boardConfig[y][x - 1]?.type === Figures.King
  ) {
    return true
  }

  if (
    x - 1 >= 0 &&
    y - 1 >= 0 &&
    boardConfig[y - 1][x - 1] &&
    boardConfig[y - 1][x - 1]?.color !== color &&
    boardConfig[y - 1][x - 1]?.type === Figures.King
  ) {
    return true
  }

  if (
    y - 1 >= 0 &&
    boardConfig[y - 1][x] &&
    boardConfig[y - 1][x]?.color !== color &&
    boardConfig[y - 1][x]?.type === Figures.King
  ) {
    return true
  }

  if (
    x + 1 <= 7 &&
    y - 1 >= 0 &&
    boardConfig[y - 1][x + 1] &&
    boardConfig[y - 1][x + 1]?.color !== color &&
    boardConfig[y - 1][x + 1]?.type === Figures.King
  ) {
    return true
  }

  return false
}

const isKingCheckedInCoords = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  if (isKingChechedByPawnInCoords(coords, color, boardConfig)) return true

  const knightMoves = getCoordsForKnightMoves(coords)

  for (let i = 0; i < knightMoves.length; i++) {
    const move = knightMoves[i]

    if (
      move.x >= 0 &&
      move.x <= 7 &&
      move.y >= 0 &&
      move.y <= 7 &&
      boardConfig[move.y][move.x] &&
      boardConfig[move.y][move.x]?.color !== color &&
      boardConfig[move.y][move.x]?.type === Figures.Knight
    ) {
      return true
    }
  }

  let x = coords.x - 1
  let y = coords.y - 1
  let i = 0

  while (x >= 0 && y >= 0) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Bishop)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x--
    y--
    i++
  }

  x = coords.x - 1
  y = coords.y + 1
  i = 0

  while (x >= 0 && y <= 7) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Bishop)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x--
    y++
    i++
  }

  x = coords.x + 1
  y = coords.y + 1
  i = 0

  while (x <= 7 && y <= 7) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Bishop)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x++
    y++
    i++
  }

  x = coords.x + 1
  y = coords.y - 1
  i = 0

  while (x <= 7 && y >= 0) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Bishop)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x++
    y--
    i++
  }

  x = coords.x - 1
  y = coords.y
  i = 0

  while (x >= 0) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Rook)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x--
    i++
  }

  x = coords.x + 1
  y = coords.y
  i = 0

  while (x <= 7) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Rook)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    x++
    i++
  }

  x = coords.x
  y = coords.y - 1
  i = 0

  while (y >= 0) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Rook)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    y--
    i++
  }

  x = coords.x
  y = coords.y + 1
  i = 0

  while (y <= 7) {
    if (i === 0 && isKingCheckedByKingInCoords({ x, y }, color, boardConfig))
      return true

    if (
      boardConfig[y][x] &&
      boardConfig[y][x]?.color !== color &&
      (boardConfig[y][x]?.type === Figures.Queen ||
        boardConfig[y][x]?.type === Figures.Rook)
    )
      return true

    if (
      boardConfig[y][x] &&
      !(
        boardConfig[y][x]?.type === Figures.King &&
        boardConfig[y][x]?.color === color
      )
    )
      break

    y++
    i++
  }

  return false
}

export const getPawnAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
  history: GameHistory,
) => {
  const availableMoves: Coords[] = []

  const direction = color === Colors.White ? -1 : 1

  const nextY = coords.y + direction

  if (nextY >= 0 && nextY <= 7 && !boardConfig[nextY][coords.x]) {
    availableMoves.push({ x: coords.x, y: nextY })
  }

  if (
    coords.y === (color === Colors.White ? 6 : 1) &&
    !boardConfig[nextY][coords.x] &&
    !boardConfig[nextY + direction][coords.x]
  ) {
    availableMoves.push({ x: coords.x, y: nextY + direction })
  }

  if (
    coords.x >= 1 &&
    boardConfig[nextY][coords.x - 1] &&
    boardConfig[nextY][coords.x - 1]?.color !== color
  ) {
    availableMoves.push({ x: coords.x - 1, y: nextY })
  }

  if (
    coords.x <= 6 &&
    boardConfig[nextY][coords.x + 1] &&
    boardConfig[nextY][coords.x + 1]?.color !== color
  ) {
    availableMoves.push({ x: coords.x + 1, y: nextY })
  }

  return [
    ...availableMoves,
    ...getPawnEnPassantMoves(coords, color, boardConfig, history),
  ]
}

export const getPawnEnPassantMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
  history: GameHistory,
) => {
  if (!history.length) return []

  if (coords.y !== (color === Colors.White ? 3 : 4)) return []

  const moveOrder = color === Colors.White ? 1 : 0

  const lastMove = history?.[history.length - 1]?.[moveOrder]
  const lastMoveId = lastMove?.id

  const lastMoveFigure = boardConfig
    .find(row => {
      return row.reduce((acc, figure) => {
        return acc || figure?.id === lastMoveId
      }, false)
    })
    ?.find(figure => figure?.id === lastMoveId)

  if (!lastMoveFigure || lastMoveFigure?.type !== Figures.Pawn) return []

  if (lastMove.to.y !== (color === Colors.White ? 3 : 4)) return []

  const direction = color === Colors.White ? -1 : 1
  const nextY = coords.y + direction

  const availableMoves: Coords[] = [
    {
      x: lastMove.to.x,
      y: nextY,
    },
  ]

  return availableMoves
}

export const getRookAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const availableMoves: Coords[] = []

  let x = coords.x - 1
  let y = coords.y

  while (x >= 0) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x--
  }

  x = coords.x + 1
  y = coords.y

  while (x <= 7) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x++
  }

  x = coords.x
  y = coords.y - 1

  while (y >= 0) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    y--
  }

  x = coords.x
  y = coords.y + 1

  while (y <= 7) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    y++
  }

  return availableMoves
}

export const getBishopAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const availableMoves: Coords[] = []

  let x = coords.x - 1
  let y = coords.y - 1

  while (x >= 0 && y >= 0) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x--
    y--
  }

  x = coords.x - 1
  y = coords.y + 1

  while (x >= 0 && y <= 7) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x--
    y++
  }

  x = coords.x + 1
  y = coords.y + 1

  while (x <= 7 && y <= 7) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x++
    y++
  }

  x = coords.x + 1
  y = coords.y - 1

  while (x <= 7 && y >= 0) {
    if (boardConfig[y][x] && boardConfig[y][x]?.color === color) break
    availableMoves.push({ x, y })
    if (boardConfig[y][x] && boardConfig[y][x]?.color !== color) break
    x++
    y--
  }

  return availableMoves
}

export const getKnightAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const availableMoves: Coords[] = []

  const coordsForKnightMoves = getCoordsForKnightMoves(coords)

  coordsForKnightMoves.forEach(coords => {
    if (
      coords.x >= 0 &&
      coords.x <= 7 &&
      coords.y >= 0 &&
      coords.y <= 7 &&
      (!boardConfig?.[coords.y]?.[coords.x] ||
        boardConfig?.[coords.y]?.[coords.x]?.color !== color)
    )
      availableMoves.push(coords)
  })

  return availableMoves
}

export const getQueenAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
) => {
  const availableMoves: Coords[] = []

  availableMoves.push(...getRookAvailableMoves(coords, color, boardConfig))
  availableMoves.push(...getBishopAvailableMoves(coords, color, boardConfig))

  return availableMoves
}

export const getKingAvailableMoves = (
  coords: Coords,
  color: Colors,
  boardConfig: BoardConfiguration,
  history: GameHistory,
) => {
  const availableMoves: Coords[] = []

  const x = coords.x
  const y = coords.y

  if (
    x + 1 <= 7 &&
    (!boardConfig?.[y]?.[x + 1] ||
      boardConfig?.[y]?.[x + 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x + 1, y }, color, boardConfig)
  )
    availableMoves.push({ x: x + 1, y })

  if (
    x + 1 <= 7 &&
    y + 1 <= 7 &&
    (!boardConfig?.[y + 1]?.[x + 1] ||
      boardConfig?.[y + 1]?.[x + 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x + 1, y: y + 1 }, color, boardConfig)
  )
    availableMoves.push({ x: x + 1, y: y + 1 })

  if (
    y + 1 <= 7 &&
    (!boardConfig?.[y + 1]?.[x] ||
      boardConfig?.[y + 1]?.[x]?.color !== color) &&
    !isKingCheckedInCoords({ x, y: y + 1 }, color, boardConfig)
  )
    availableMoves.push({ x, y: y + 1 })

  if (
    x - 1 >= 0 &&
    y + 1 <= 7 &&
    (!boardConfig?.[y + 1]?.[x - 1] ||
      boardConfig?.[y + 1]?.[x - 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x - 1, y: y + 1 }, color, boardConfig)
  )
    availableMoves.push({ x: x - 1, y: y + 1 })

  if (
    x - 1 >= 0 &&
    (!boardConfig?.[y]?.[x - 1] ||
      boardConfig?.[y]?.[x - 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x - 1, y }, color, boardConfig)
  )
    availableMoves.push({ x: x - 1, y })

  if (
    x - 1 >= 0 &&
    y - 1 >= 0 &&
    (!boardConfig?.[y - 1]?.[x - 1] ||
      boardConfig?.[y - 1]?.[x - 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x - 1, y: y - 1 }, color, boardConfig)
  )
    availableMoves.push({ x: x - 1, y: y - 1 })

  if (
    y - 1 >= 0 &&
    (!boardConfig?.[y - 1]?.[x] ||
      boardConfig?.[y - 1]?.[x]?.color !== color) &&
    !isKingCheckedInCoords({ x, y: y - 1 }, color, boardConfig)
  )
    availableMoves.push({ x, y: y - 1 })

  if (
    x + 1 <= 7 &&
    y - 1 >= 0 &&
    (!boardConfig?.[y - 1]?.[x + 1] ||
      boardConfig?.[y - 1]?.[x + 1]?.color !== color) &&
    !isKingCheckedInCoords({ x: x + 1, y: y - 1 }, color, boardConfig)
  )
    availableMoves.push({ x: x + 1, y: y - 1 })

  const moveOrder = color === Colors.White ? 0 : 1

  const isKingMoved = history.some(
    move => move[moveOrder]?.id === boardConfig?.[y]?.[x]?.id,
  )

  if (isKingMoved) return availableMoves

  // long castling

  const longRookCoords =
    color === Colors.White ? { x: 0, y: 7 } : { x: 0, y: 0 }

  const longCastlingCheckCoords =
    color === Colors.White
      ? [
          { x: 2, y: 7 },
          { x: 3, y: 7 },
        ]
      : [
          { x: 2, y: 0 },
          { x: 3, y: 0 },
        ]

  const longRook = boardConfig?.[longRookCoords.y]?.[longRookCoords.x]

  if (
    longRook?.type === Figures.Rook &&
    !history.some(move => move[moveOrder]?.id === longRook?.id) &&
    longCastlingCheckCoords.reduce((acc, coords) => {
      return (
        acc &&
        !boardConfig?.[coords.y]?.[coords.x] &&
        !isKingCheckedInCoords(coords, color, boardConfig)
      )
    }, true)
  ) {
    availableMoves.push({ x: 2, y: longRookCoords.y })
  }

  // short castling

  const shortRookCoords =
    color === Colors.White ? { x: 7, y: 7 } : { x: 7, y: 0 }

  const shortCastlingCheckCoords =
    color === Colors.White
      ? [
          { x: 5, y: 7 },
          { x: 6, y: 7 },
        ]
      : [
          { x: 5, y: 0 },
          { x: 6, y: 0 },
        ]

  const shortRook = boardConfig?.[shortRookCoords.y]?.[shortRookCoords.x]

  if (
    shortRook?.type === Figures.Rook &&
    !history.some(move => move[moveOrder]?.id === shortRook?.id) &&
    shortCastlingCheckCoords.reduce((acc, coords) => {
      return (
        acc &&
        !boardConfig?.[coords.y]?.[coords.x] &&
        !isKingCheckedInCoords(coords, color, boardConfig)
      )
    }, true)
  ) {
    availableMoves.push({ x: 6, y: shortRookCoords.y })
  }

  return availableMoves
}

export const getAvailableMoves = (
  coords: Coords,
  boardConfig?: BoardConfiguration,
  gameHistory?: GameHistory,
) => {
  const figure = boardConfig?.[coords.y]?.[coords.x]

  if (!figure) return []

  const color = figure.color
  const config = boardConfig || []
  const history = gameHistory || []

  switch (figure.type) {
    case Figures.Pawn:
      return getPawnAvailableMoves(coords, color, config, history)
    case Figures.Rook:
      return getRookAvailableMoves(coords, color, config)
    case Figures.Bishop:
      return getBishopAvailableMoves(coords, color, config)
    case Figures.Knight:
      return getKnightAvailableMoves(coords, color, config)
    case Figures.Queen:
      return getQueenAvailableMoves(coords, color, config)
    case Figures.King:
      return getKingAvailableMoves(coords, color, config, history)
  }
}
