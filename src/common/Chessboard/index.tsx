import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useEffect, useState } from 'react'

import { ChessFigure } from '@/common'
import { Colors, Figures } from '@/enums'
import {
  getAvailableMoves,
  isKingCheckedInCoords,
  isMoveEnPassant,
} from '@/helpers'
import { BoardConfiguration, Coords, Figure, GameHistory, Move } from '@/types'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    boardConfig: BoardConfiguration
    history?: GameHistory
    userColor?: Colors
    updateBoardState: (
      state: BoardConfiguration,
      move: Move,
      color: Colors,
    ) => void
  }

export default function Chessboard({
  boardConfig,
  updateBoardState,
  className,
  history,
  userColor,
  ...rest
}: Props) {
  const [availableMoves, setAvailableMoves] = useState<boolean[][]>([])
  const [chosenFigure, setChosenFigure] = useState<Coords | null>(null)
  const [figures, setFigures] = useState<(Figure & Coords)[]>([])
  const [turn, setTurn] = useState<Colors>(Colors.White)

  const handleFigureClick = (x: number, y: number) => {
    if (chosenFigure) {
      if (availableMoves?.[y]?.[x]) {
        const newBoardConfig = JSON.parse(JSON.stringify(boardConfig))
        const figure = newBoardConfig[chosenFigure.y][chosenFigure.x]

        newBoardConfig[chosenFigure.y][chosenFigure.x] = null
        newBoardConfig[y][x] = figure

        // En passant
        if (x !== chosenFigure.x && figure?.type === Figures.Pawn) {
          const direction = figure.color === Colors.White ? 1 : -1
          newBoardConfig[y + direction][x] = null
        }

        // Castling
        if (figure?.type === Figures.King && Math.abs(x - chosenFigure.x) > 1) {
          const direction = x - chosenFigure.x > 0 ? 1 : -1
          const rook = newBoardConfig[y][direction === 1 ? 7 : 0]

          newBoardConfig[y][x - direction] = rook
          newBoardConfig[y][direction === 1 ? 7 : 0] = null
        }

        const move = {
          to: { x, y },
          id: figure?.id || -1,
        }

        updateBoardState(newBoardConfig, move, figure?.color || Colors.White)

        setTurn(turn === Colors.White ? Colors.Black : Colors.White)
        setChosenFigure(null)
        setAvailableMoves([])

        return
      }

      setChosenFigure(null)
      setAvailableMoves([])

      return
    }

    if (!boardConfig?.[y]?.[x]) return

    if (userColor) setTurn(userColor)

    if (boardConfig?.[y]?.[x]?.color !== turn) return

    setChosenFigure({ x, y })

    let coords = getAvailableMoves({ x, y }, boardConfig, history)

    const king = figures.find(
      figure =>
        figure.type === Figures.King &&
        figure.color === boardConfig[y][x]?.color,
    )

    if (
      king &&
      isKingCheckedInCoords(
        { x: king.x, y: king.y },
        king?.color || Colors.White,
        boardConfig,
      )
    ) {
      const newBoardConfig = JSON.parse(JSON.stringify(boardConfig))
      const figure = newBoardConfig[y][x]

      coords = coords.filter(item => {
        newBoardConfig[y][x] = null
        newBoardConfig[item.y][item.x] = figure

        // En passant
        if (x !== item.x && figure?.type === Figures.Pawn) {
          const direction = figure.color === Colors.White ? 1 : -1
          newBoardConfig[y + direction][x] = null
        }

        return !isKingCheckedInCoords(
          figure.type === Figures.King
            ? { x: item.x, y: item.y }
            : { x: king.x, y: king.y },
          king.color,
          newBoardConfig,
        )
      })
    }

    const newAvailableMoves: boolean[][] = []

    for (let y = 0; y <= 7; y++) {
      newAvailableMoves.push([])

      for (let x = 0; x <= 7; x++) {
        newAvailableMoves[y].push(
          coords.some(item => item.x === x && item.y === y),
        )
      }
    }

    setAvailableMoves(newAvailableMoves)
  }

  useEffect(() => {
    const newFigures: (Figure & Coords)[] = []

    boardConfig.forEach((row, y) =>
      row.forEach((figure, x) => {
        if (figure) newFigures.push({ ...figure, x, y })
      }),
    )

    setFigures(newFigures)
  }, [boardConfig])

  return (
    <motion.main className={`chessboard ${className}`} {...rest}>
      {Array.from({ length: 8 }, (_, y) => (
        <div className='chessboard__row' key={y}>
          {Array.from({ length: 8 }, (_, x) => (
            <button
              className={`chessboard__cell ${
                (x + y) % 2 === 0
                  ? 'chessboard__cell--white'
                  : 'chessboard__cell--black'
              } ${
                chosenFigure?.x === x &&
                chosenFigure?.y === y &&
                'chessboard__cell--chosen'
              }`}
              key={x}
              onClick={() => handleFigureClick(x, y)}
            >
              {availableMoves?.[y]?.[x] ? (
                <div
                  className={`chessboard__available-move-dot ${
                    boardConfig?.[y]?.[x]
                      ? 'chessboard__available-move-dot--attack'
                      : ''
                  } ${
                    isMoveEnPassant(
                      { x, y },
                      boardConfig,
                      boardConfig?.[chosenFigure?.y || -1]?.[
                        chosenFigure?.x || -1
                      ],
                    )
                      ? 'chessboard__available-move-dot--attack'
                      : ''
                  }`}
                />
              ) : null}
            </button>
          ))}
        </div>
      ))}
      {
        <div className='chessboard__figures'>
          {figures.map(
            ({ id, x, y, ...figure }) =>
              figure && (
                <ChessFigure
                  key={id}
                  figure={figure.type}
                  color={figure.color}
                  style={{
                    top: `calc(${y} * 64px)`,
                    left: `calc(${x} * 64px)`,
                  }}
                />
              ),
          )}
        </div>
      }
    </motion.main>
  )
}
