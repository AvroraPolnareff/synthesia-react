import React, {useEffect, useReducer, useState} from 'react';
import {Input, MIDIFilter, MIDINote, useMIDI, useMIDINote} from "@react-midi/hooks";
import {Keyboard} from "./Keyboard";
import {Midi, MidiJSON, Track} from "@tonejs/midi";
import {KeySignatureEvent, MetaEvent, TempoEvent, TimeSignatureEvent} from "@tonejs/midi/dist/Header";
import { Note } from '@tonejs/midi/dist/Note';

function App() {
  return <MidiApp/>
}

export const useMIDINotes = (input: Input, filter: MIDIFilter = {}) => {
  const [notes, setNotes] = useState<MIDINote[]>([]);
  const value = useMIDINote(input, filter);
  useEffect(() => {
    if (!input) return;
    if (value?.on) setNotes(notes => [...notes, value]);
    else setNotes(notes => notes.filter((n) => n.note !== value.note)); // Note off, remove note from array (maybe check for channel?)
  }, [input, value]);
  return notes;
};

export const useMidiFile = () => {
  const [midi, setMidi] = useState<Midi>({
    addTrack(): Track {
      return midi.tracks[0];
    }, clone(): Midi {
      return midi
    },
    fromJSON: () => {},
    // @ts-ignore
    toArray: () => [],
    toJSON: () => ({
        header: {
          name: "",
          ppq: 0,
          meta: [],
          tempos: [],
          timeSignatures: [],
          keySignatures: []
        },
      tracks: []
    }),
    name: "",
    duration: 0,
    durationTicks: 0,
    header: {
      tempos: [],
      meta: [],
      name: "",
      timeSignatures: [],
      keySignatures: [],
      update: () => {},
      ticksToSeconds: () => 0,
      secondsToTicks: () => 0,
      ticksToMeasures: () => 0,
      ppq: 0,
      setTempo: () => {},
      toJSON: () => ({
        name: "",
        ppq: 0,
        meta: [],
        tempos: [],
        timeSignatures: [],
        keySignatures: [],
      }),
      fromJSON: () => {}

    },
    tracks: []
  });

  const fetchMidi = async () => setMidi(await Midi.fromUrl("/example2.mid"))

  useEffect(() => {
    fetchMidi();
  }, [])
  return midi;
}

const getFileInfo = (midiFile: Midi, track: number) => {
  return {
    tempo: midiFile.header.tempos[0]?.bpm || 120,
    notes: midiFile.tracks[track]?.notes,
    quarter: midiFile.header.ppq,
    trackLength: midiFile.tracks[track]?.endOfTrackTicks,
  }
}

interface PlayerState {
  play: boolean,
  currentNotes: Note[],
  currentTime: number,
  position: number,
}

type PlayerAction =
  | {type: "play"}
  | {type: "pause"}
  | {type: "stop"}
  | {
      type: "nextPlayerTick", 
      payload: {
        quarter: number, 
        tempo: number, 
        notes: Note[], 
        trackLength: number
      }
    }

const initPlayerState = {
  play: false,
  currentNotes: [],
  currentTime: 0,
  position: 0,
}

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case "play": return {...state, play: true}
    case "pause": return {...state, play: false}
    case "stop": return {play: false, currentNotes: [], position: 0, currentTime: 0}
    case "nextPlayerTick": {
      const {quarter, tempo, notes, trackLength} = action.payload;
      if (trackLength > state.position) {
        return {
          play: true,
          currentNotes: notes.filter(note => state.position >= note.ticks && state.position <= note.ticks + note.durationTicks),
          currentTime: 0,
          position: state.position + 1,
        }
      }
      return {play: false, currentNotes: [], position: 0, currentTime: 0}
    }
  }
}

export const useMIDIPlayer = ({track = 0}: {track: number}) => {
  const midiFile = useMidiFile();
  const {notes, quarter, tempo, trackLength} = getFileInfo(midiFile, track)
  const [state, dispatch] = useReducer(playerReducer, initPlayerState)
  
  useEffect(() => {
    if (!notes?.length) return
    if (state.play) {
      const tickLength = 60 / tempo / quarter
      setTimeout(() => {
        
        dispatch({type: "nextPlayerTick", payload: {tempo, quarter, notes, trackLength: trackLength ?? 0}})
      }, tickLength * 1000)
    }
  }, [state, tempo, quarter, notes, trackLength])

  return {
    play: () => dispatch({type: "play"}),
    pause: () => dispatch({type: "pause"}),
    stop: () => dispatch({type: "stop"}),
    currentNotes: state.currentNotes
  }
}

const MidiApp = () => {
  const midi = useMIDI();
  const [buttonState, setButtonState] = useState(false)
  const {play, stop, currentNotes} = useMIDIPlayer({track: 1})



  const notes = useMIDINotes(midi.inputs[0], {channel: 1})
  return (
    <div style={{display: "flex",  flexDirection: "column"}}>
      <Keyboard pressedKeys={currentNotes?.map(note => note.midi) ?? []}/>
      <button onClick={buttonState ? () => { setButtonState(false); stop() } : () => { setButtonState(true); play() } }>
        {buttonState ? "stop" : "play"}
        </button>
    </div>
  );
}

export default App;
