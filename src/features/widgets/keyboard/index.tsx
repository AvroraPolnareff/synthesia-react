import styled, {css} from "styled-components"

interface KeyProps {
  className?: string
  black: boolean
  pressed: boolean
}

export const Key = styled(({className}: KeyProps) => {

  return (
    <div className={className}>

    </div>
  )
})`
  box-sizing: border-box;
  width: 20px;
  height: 100%;
  padding: 2px;
  background: ${({pressed}) => pressed ? "#c9c9c9" : "#f6f6f6"} ${({black}) => black && css<KeyProps>`
    width: 12px;
    background: ${({pressed}) => pressed ? "#2d2d2d" : "#505050"}
  `}
`

export interface KeyboardProps {
  className?: string
  start?: number
  end?: number
  pressedKeys?: number[]
}

export const isBlack = (key: number) => {
  const blackKeys = [1, 3, 6, 8, 10]
  return blackKeys.some(blackKey => blackKey === key % 12)
}

export const keyboardKeys = Array.from<unknown, boolean>(Array(127), (_, i) => isBlack(i))

const Keyboard = styled(
  ({
     className,
     start = 48,
     end = 71,
     pressedKeys = [48, 50, 52],
   }: KeyboardProps) => {
    const keys = keyboardKeys
      .map((black, index) => ({index, black, pressed: pressedKeys.some(pressedKey => pressedKey === index)}))
      .slice(start, end + 1)
    return (
      <div className={className}>
        {keys.map(key => <Key key={key.index} black={key.black} pressed={key.pressed}/>)}
      </div>
    )
  })`
  height: 50px;
  display: flex;
`


export default Keyboard
