import React, {useEffect, useRef, useState} from 'react'
import {Input, MIDIFilter, MIDINote, useMIDI, useMIDINote} from "@react-midi/hooks"
import {Keyboard} from "./Keyboard"
import {Midi} from "@tonejs/midi"
import {initPlayerState, VisualPlayerCore} from "./features/player-core"
import * as option from "fp-ts/es6/Option"
import {Option} from "fp-ts/es6/Option"

export const useMIDINotes = (input: Input, filter: MIDIFilter = {}) => {
  const [notes, setNotes] = useState<MIDINote[]>([])
  const value = useMIDINote(input, filter)
  useEffect(() => {
    if (!input) return
    if (value?.on) setNotes(notes => [...notes, value])
    else setNotes(notes => notes.filter((n) => n.note !== value.note)) // Note off, remove note from array (maybe
                                                                        // check for channel?)
  }, [input, value])
  return notes
}

export const useMidiFile = (): Option<Midi> => {
  const [midi, setMidi] = useState<Option<Midi>>(option.none)

  const fetchMidi = async () => {
    const midiFile = await Midi.fromUrl("/example2.mid")

    setMidi(option.some(midiFile))
  }

  useEffect(() => {
    fetchMidi()
  }, [])
  return midi;
}


export const useMIDIPlayer = ({track = 1}: { track: number }) => {
  const midi = useMidiFile()
  return option.map((midi: Midi) => new VisualPlayerCore(midi, track))(midi)
}

const MidiApp = ({player}: {player: VisualPlayerCore}) => {
  const [playerState, setPlayerState] = useState(initPlayerState);
  const {currentNotes, isPlaying} = playerState;
  useEffect(() => player.onStateChange(setPlayerState), [player])

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Keyboard pressedKeys={currentNotes.map(({note}) => note)}/>
      <button onClick={isPlaying ? player.stop : player.play}>
        {isPlaying ? "stop" : "play"}
      </button>
    </div>
  )
}

const App = () => {
  const midi = useMIDI()
  const player = useMIDIPlayer({track: 1})

  return option.match(
    () => <div>loading...</div>,
    (player: VisualPlayerCore) => <MidiApp player={player}/>
  )(player)
}



export default App
