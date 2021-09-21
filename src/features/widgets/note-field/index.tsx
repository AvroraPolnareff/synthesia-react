import {DisplayNote} from "../../core/visual-player-core"
import styled, {css} from "styled-components"
import {array} from "fp-ts"
import {isBlack} from "../keyboard"

interface NoteProps {
  position: number
  size: number
}
const Note = styled.div.attrs((props: NoteProps) => ({
  style: {bottom: `${props.position}px`, height: `${props.size}px`}
}))<NoteProps>`
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #ff7878;
`

interface LineProps {
  black: boolean,
  pressed?: boolean,
}

const Line = styled.div<LineProps>`
  position: relative;
  box-sizing: border-box;
  width: 20px;
  height: 100%;
  border: solid 1px #989797;
  background: ${({pressed}) => pressed ? "#c9c9c9" : "#f6f6f6"} ${({black}) => black && css<LineProps>`
    width: 12px;
    background: ${({pressed}) => pressed ? "#b2b2b2" : "#dedede"}
  `}
  overflow: no-display;
`

interface NoteFieldProps {
  notes: DisplayNote[]
  className?: string
  start?: number
  end?: number
}

const createLines = (notes: DisplayNote[], start: number, end: number) => {
  let result: DisplayNote[][] = Array(end - start + 1).fill([])
  for (const note of notes) {
    const notePosition = note.note - start
    if (result.length > notePosition) result[notePosition] = [...result[notePosition], note]
  }
  return result
}

const NoteField = styled(({notes = [], className, start = 48, end = 71}: NoteFieldProps) => {

  return (
    <div className={className}>
      {createLines(notes, start, end).map((line, i) =>
        <Line black={isBlack(i + start)}>
          {line.map(note => <Note position={note.position * 100} size={note.length * 100}/>)}
        </Line>
      )}
    </div>
  )
})`
  height: 300px;
  display: flex;
  overflow: hidden;
`



export default NoteField
