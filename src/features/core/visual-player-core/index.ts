import {Midi} from "@tonejs/midi"

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
  private time = 0
  private startTime = 0
  private animation = 0

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
    this.animation = requestAnimationFrame((time) => {
      if (this.time > this.midi.tracks[this.trackToPlay].duration) {
        this.stop()
      } else {
        if (!this.isPlaying) this.startTime = time
        this.isPlaying = true
        this.time = (time - this.startTime) / 1000
        this.passStateToListeners(this.nextState())
        this.play()
      }
    })
  }

  public pause = () => {
    if (this.isPlaying) {
      cancelAnimationFrame(this.animation)
      this.isPlaying = false
    }
    this.passStateToListeners(this.nextState())
  }

  public stop = () => {
    cancelAnimationFrame(this.animation)
    this.isPlaying = false
    this.time = 0
    this.startTime = 0
    this.currentTick = 0
    this.passStateToListeners(this.nextState())
  }
}
