import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useEffect, useState } from 'react'

import { ChessFigure } from '@/common'
import { Colors, Figures } from '@/enums'
import { getAvailableMoves, isMoveEnPassant } from '@/helpers'
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

  const handleFigureClick = (x: number, y: number) => {
    if (chosenFigure) {
      if (availableMoves?.[y]?.[x]) {
        const newBoardConfig = [...boardConfig]
        const figure = newBoardConfig[chosenFigure.y][chosenFigure.x]

        newBoardConfig[chosenFigure.y][chosenFigure.x] = null
        newBoardConfig[y][x] = figure

        if (x !== chosenFigure.x && figure?.type === Figures.Pawn) {
          const direction = figure.color === Colors.White ? 1 : -1
          newBoardConfig[y + direction][x] = null
        }

        const move = {
          to: { x, y },
          id: figure?.id || -1,
        }

        updateBoardState(newBoardConfig, move, figure?.color || Colors.White)

        setChosenFigure(null)
        setAvailableMoves([])

        return
      }

      setChosenFigure(null)
      setAvailableMoves([])

      return
    }

    if (!boardConfig?.[y]?.[x]) return

    if (userColor && boardConfig?.[y]?.[x]?.color !== userColor) return

    setChosenFigure({ x, y })

    const coords = getAvailableMoves({ x, y }, boardConfig, history)

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
