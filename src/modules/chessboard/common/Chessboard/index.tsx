import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useEffect, useState } from 'react'

import { ChessFigure } from '@/modules/chessboard/common'
import {
  getFiguresFromBoardConfig,
  isMoveEnPassant,
} from '@/modules/chessboard/helpers'
import { useChessboard } from '@/modules/chessboard/hooks'
import { Coords, Figure } from '@/modules/chessboard/types'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    chessboard: ReturnType<typeof useChessboard>
  }

export default function Chessboard({ chessboard, className, ...rest }: Props) {
  const {
    boardState,
    availableMoves,
    chosenFigure,

    handleChoosingFigure,
    moveFigure,
  } = chessboard

  const [figures, setFigures] = useState<(Figure & Coords)[]>([])

  const handleFigureClick = (x: number, y: number) => {
    if (chosenFigure) {
      moveFigure(x, y)
      return
    }

    handleChoosingFigure(x, y)
  }

  useEffect(() => {
    setFigures(
      getFiguresFromBoardConfig(boardState).sort((a, b) => a.id - b.id),
    )
  }, [boardState])

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
                    boardState?.[y]?.[x]
                      ? 'chessboard__available-move-dot--attack'
                      : ''
                  } ${
                    isMoveEnPassant(
                      { x, y },
                      boardState,
                      boardState?.[chosenFigure?.y || -1]?.[
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
