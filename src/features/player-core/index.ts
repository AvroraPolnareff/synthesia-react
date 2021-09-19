import {Midi} from "@tonejs/midi"
import Timeout = NodeJS.Timeout


interface DisplayNote {
  note: number,
  position: number,
  length: number
}

interface PlayerState {
  play: boolean,
  currentNotes: DisplayNote[],
  currentTick: number,
  notes: DisplayNote[]
  tickLength: number
}

// type PlayerAction =
//   | { type: "play" }
//   | { type: "pause" }
//   | { type: "stop" }
//   | {
//   type: "nextPlayerTick",
//   payload: {
//     quarter: number,
//     tempo: number,
//     notes: Note[],
//     trackLength: number
//   }
// }

const initPlayerState = {
  play: false,
  currentNotes: [],
  notes: [],
  currentTime: 0,
  position: 0,
}

// const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
//   switch (action.type) {
//     case "play":
//       return {...state, play: true}
//     case "pause":
//       return {...state, play: false}
//     case "stop":
//       return {play: false, currentNotes: [], position: 0, currentTime: 0}
//     case "nextPlayerTick": {
//       const {quarter, tempo, notes, trackLength} = action.payload
//       if (trackLength > state.position) {
//         return {
//           play: true,
//           currentNotes: notes.filter(note => state.position >= note.ticks && state.position <= note.ticks +
// note.durationTicks), currentTime: 0, position: state.position + 1, } } return {play: false, currentNotes: [],
// position: 0, currentTime: 0} } } }

type Listener = (state: PlayerState) => void

export class VisualPlayerCore {
  constructor(
    private readonly midi: Midi,
    private trackToPlay: number = 1,
    private speed: number = 1,
  ) { }

  private tempo = this.midi.header.tempos[0].bpm

  get tickLength() { return 60 / this.tempo / this.midi.header.ppq * this.speed }

  private currentTick = 0

  private isPlaying = false

  private listeners: Listener[] = []

  private timer?: Timeout;

  nextState(): PlayerState {
    const notes = this.midi.tracks[this.trackToPlay].notes
      .map(({midi, duration, ticks}) => ({note: midi, position: duration - this.currentTick, length: ticks}))
    const currentNotes = notes.filter(note => note.position === 0 && note.position * -1 < note.length)
    if (this.isPlaying) this.currentTick++

    return {
      currentTick: this.currentTick,
      notes,
      currentNotes,
      play: this.isPlaying,
      tickLength: this.tickLength,
    }
  }

  onStateChange = (callback: (state: PlayerState) => void) => {
    this.listeners.push(callback)
  }

  play() {
    this.isPlaying = true
    this.timer = setInterval(() => {
      const state = this.nextState()
      this.listeners.forEach((listener) => listener(state))
    }, this.tickLength)
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
  }

  stop() {
    this.pause()
    this.currentTick = 0
  }
}
