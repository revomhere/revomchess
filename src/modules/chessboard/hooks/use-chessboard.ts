import { useState } from 'react'

import { Colors, Figures } from '@/modules/chessboard/enums'
import { getAvailableMoves } from '@/modules/chessboard/helpers'
import {
  BoardConfiguration,
  Coords,
  GameHistory,
  Move,
} from '@/modules/chessboard/types'

export const useChessboard = (
  boardConfig: BoardConfiguration,
  userColor?: Colors,
) => {
  const [history, setHistory] = useState<GameHistory>([])
  const [boardState, setBoardState] = useState(boardConfig || [])

  const [availableMoves, setAvailableMoves] = useState<boolean[][]>([])
  const [chosenFigure, setChosenFigure] = useState<Coords | null>(null)
  const [turn, setTurn] = useState<Colors>(Colors.White)

  const updateBoardState = (
    state: BoardConfiguration,
    move: Move,
    color: Colors,
  ) => {
    setBoardState(state)

    if (color === Colors.White) setHistory([...history].concat([[move]]))
    else
      setHistory([
        ...history.slice(0, -1),
        [...history[history.length - 1].concat([move])],
      ])
  }

  const handleChoosingFigure = (x: number, y: number) => {
    const figure = boardState?.[y]?.[x]

    if (!figure || figure.color !== turn) return

    const moves = getAvailableMoves({ x, y }, boardState, history)

    const newAvailableMoves: boolean[][] = []

    for (let y = 0; y <= 7; y++) {
      newAvailableMoves.push([])

      for (let x = 0; x <= 7; x++) {
        newAvailableMoves[y].push(
          moves.some(item => item.x === x && item.y === y),
        )
      }
    }

    setChosenFigure({ x, y })
    setAvailableMoves(newAvailableMoves)
  }

  const moveFigure = (x: number, y: number) => {
    if (!chosenFigure || !availableMoves?.[y]?.[x]) {
      setChosenFigure(null)
      setAvailableMoves([])
      return
    }

    const newBoardState = JSON.parse(JSON.stringify(boardState))
    const figure = newBoardState[chosenFigure.y][chosenFigure.x]

    newBoardState[chosenFigure.y][chosenFigure.x] = null
    newBoardState[y][x] = figure

    // En passant
    if (x !== chosenFigure.x && figure?.type === Figures.Pawn) {
      const direction = figure.color === Colors.White ? 1 : -1
      newBoardState[y + direction][x] = null
    }

    // Castling
    if (figure?.type === Figures.King && Math.abs(x - chosenFigure.x) > 1) {
      const direction = x - chosenFigure.x > 0 ? 1 : -1
      const rook = newBoardState[y][direction === 1 ? 7 : 0]

      newBoardState[y][x - direction] = rook
      newBoardState[y][direction === 1 ? 7 : 0] = null
    }

    const move = {
      to: { x, y },
      id: figure?.id || -1,
    }

    updateBoardState(newBoardState, move, figure?.color || Colors.White)

    setTurn(userColor || turn === Colors.White ? Colors.Black : Colors.White)
    setChosenFigure(null)
    setAvailableMoves([])
  }

  return {
    boardState,
    history,
    availableMoves,
    chosenFigure,
    turn,

    setBoardState,
    setHistory,
    setAvailableMoves,
    setChosenFigure,
    setTurn,

    updateBoardState,
    handleChoosingFigure,
    moveFigure,
  }
}
