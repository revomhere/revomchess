import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

import { Chessboard } from '@/modules/chessboard/common'
import { BASIC_CHESSBOARD_CONFIGURATION } from '@/modules/chessboard/const'
import { useChessboard } from '@/modules/chessboard/hooks'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function BoardAnalysis({ ...rest }: Props) {
  const chessboard = useChessboard(BASIC_CHESSBOARD_CONFIGURATION)

  return (
    <motion.main className='board-analysis' {...rest}>
      <Chessboard chessboard={chessboard} />
    </motion.main>
  )
}
