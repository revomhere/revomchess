import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useState } from 'react'

import { BASIC_CHESSBOARD_CONFIGURATION } from '@/const'
import { Colors } from '@/enums'
import { Chessboard } from '@/modules/chessboard/common'
import { BoardConfiguration, GameHistory, Move } from '@/types'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function BoardAnalysis({ ...rest }: Props) {
  const [boardState, setBoardState] = useState([
    ...BASIC_CHESSBOARD_CONFIGURATION,
  ])
  const [history, setHistory] = useState<GameHistory>([])

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

  return (
    <motion.main className='board-analysis' {...rest}>
      <Chessboard
        boardConfig={boardState}
        history={history}
        updateBoardState={updateBoardState}
      />
    </motion.main>
  )
}
