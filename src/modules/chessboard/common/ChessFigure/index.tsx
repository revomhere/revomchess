import './styles.scss'

import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes, useEffect, useState } from 'react'

import { Colors, Figures, IconNames } from '@/enums'
import { UiIcon } from '@/ui'

type Props = HTMLAttributes<HTMLDivElement> &
  MotionProps & {
    figure?: Figures
    color?: Colors
  }

export default function ChessFigure({ figure, color, ...rest }: Props) {
  const [figureIconName, setFigureIconName] = useState(IconNames.Pawn)

  useEffect(() => {
    switch (figure) {
      case Figures.King:
        setFigureIconName(
          color === Colors.White ? IconNames.King : IconNames.KingBlack,
        )
        break

      case Figures.Queen:
        setFigureIconName(
          color === Colors.White ? IconNames.Queen : IconNames.QueenBlack,
        )
        break

      case Figures.Rook:
        setFigureIconName(
          color === Colors.White ? IconNames.Rook : IconNames.RookBlack,
        )
        break

      case Figures.Bishop:
        setFigureIconName(
          color === Colors.White ? IconNames.Bishop : IconNames.BishopBlack,
        )
        break

      case Figures.Knight:
        setFigureIconName(
          color === Colors.White ? IconNames.Knight : IconNames.KnightBlack,
        )
        break

      case Figures.Pawn:
        setFigureIconName(
          color === Colors.White ? IconNames.Pawn : IconNames.PawnBlack,
        )
        break

      default:
        setFigureIconName(IconNames.Pawn)
    }
  }, [figure, color])

  return (
    <motion.div className='chess-figure' {...rest}>
      {figure ? (
        <UiIcon
          className={`chess-figure__item ${
            color === Colors.White
              ? 'chess-figure__item--white'
              : 'chess-figure__item--black'
          }`}
          name={figureIconName}
        />
      ) : null}
    </motion.div>
  )
}
