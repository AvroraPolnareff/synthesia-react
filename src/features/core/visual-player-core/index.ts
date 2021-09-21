import {Midi} from "@tonejs/midi"
import Deltaframe from "deltaframe"

export interface DisplayNote {
  note: number
  position: number
  length: number
}

export interface PlayerState {
  isPlaying: boolean,
  currentNotes: DisplayNote[],
  currentTick: number,
  notes: DisplayNote[]
  tickLength: number
}

export const initPlayerState: PlayerState = {
  isPlaying: false,
  currentNotes: [],
  notes: [],
  currentTick: 0,
  tickLength: 0,
}

type Listener = (state: PlayerState) => void

export class VisualPlayerCore {
  constructor(
    private readonly midi: Midi,
    private trackToPlay: number = 1,
    private speed: number = 1,
  ) { }

  private get tickLength() { return 60 / this.tempo / this.midi.header.ppq * this.speed  * 1000 }

  private tempo = this.midi.header.tempos[0].bpm
  private currentTick = 0
  private isPlaying = false
  private listeners: Listener[] = []
  private timer?: ReturnType<typeof setTimeout>
  private deltaframe = new Deltaframe({minFps: 30, targetFps: 144})
  private state = initPlayerState;

  private nextState = (): PlayerState => {
    const notes = this.midi.tracks[this.trackToPlay].notes
      .map(({midi, durationTicks, ticks}) => ({note: midi, position: ticks - this.currentTick, length: durationTicks}))
    const currentNotes = notes.filter(note => note.position <= 0 && note.position * -1 <= note.length)
    if (this.isPlaying) this.currentTick++
    if (this.currentTick === this.midi.tracks[this.trackToPlay].endOfTrackTicks) this.stop()

    return {
      currentTick: this.currentTick,
      notes,
      currentNotes,
      isPlaying: this.isPlaying,
      tickLength: this.tickLength,
    }
  }

  private passStateToListeners = (state: PlayerState) => { this.listeners.forEach((listener) => listener(state)) }

  public onStateChange = (callback: (state: PlayerState) => void) => {
    this.listeners.push(callback)
    this.passStateToListeners(this.nextState())
  }

  public play = () => {
    this.isPlaying = true
    this.timer = setInterval(() => {
      this.state = this.nextState()
    }, this.tickLength)
    this.deltaframe.start((time: number, delta: number) => {
      this.passStateToListeners(this.state)
    })
  }

  public pause = () => {
    if (this.isPlaying) {
      this.isPlaying = false
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
    this.passStateToListeners(this.nextState())
  }

  public stop = () => {
    this.currentTick = 0
    this.pause()
  }
}
