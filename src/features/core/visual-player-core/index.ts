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

  private get tickLength() { return 60 / this.tempo / this.midi.header.ppq * this.speed }

  private tempo = this.midi.header.tempos[0].bpm
  private currentTick = 0
  private isPlaying = false
  private listeners: Listener[] = []
  private deltaframe = new Deltaframe({minFps: 30, targetFps: 144})
  private delta = 16.6
  private time = 0
  private startTime = 0
  private state = initPlayerState

  private nextState = (): PlayerState => {
    if (this.isPlaying) this.currentTick = Math.floor(this.time / this.tickLength)
    const notes = this.midi.tracks[this.trackToPlay].notes
      .map(({midi, duration, time}) => ({note: midi, position: time - this.time, length: duration}))
    const currentNotes = notes.filter(note => note.position <= 0 && note.position * -1 <= note.length)

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
    this.deltaframe.start((time: number, delta: number) => {
      if (this.time > this.midi.tracks[this.trackToPlay].duration) {
        this.deltaframe.stop()
        this.stop()
      } else {
        if (!this.isPlaying) this.startTime = time
        this.isPlaying = true
        this.time = (time - this.startTime) / 1000
        this.delta = delta / 1000
        this.passStateToListeners(this.nextState())
      }
    })
    this.deltaframe.resume()
  }

  public pause = () => {
    if (this.isPlaying) {
      this.isPlaying = false
      this.deltaframe.pause()
    }
    this.passStateToListeners(this.nextState())
  }

  public stop = () => {
    this.deltaframe.stop()
    this.isPlaying = false
    this.time = 0
    this.startTime = 0
    this.currentTick = 0
    this.passStateToListeners(this.nextState())
  }
}