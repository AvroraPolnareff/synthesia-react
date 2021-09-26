import {Midi} from "@tonejs/midi"
import Animation from "../animation"

export interface DisplayNote {
  note: number
  position: number
  length: number
}

export interface PlayerState {
  isPlaying: boolean
  currentNotes: DisplayNote[]
  currentTick: number
  currentNotesStart: DisplayNote[]
  currentNotesEnd: DisplayNote[]
  notes: DisplayNote[]
  tickLength: number
  time: number
}

export const initPlayerState: PlayerState = {
  isPlaying: false,
  currentNotes: [],
  currentNotesStart: [],
  currentNotesEnd: [],
  notes: [],
  currentTick: 0,
  tickLength: 0,
  time: 0,
}

/**
 * Give info about midi notes to an UI
 */
class VisualPlayer {
  constructor(
    private readonly midi: Midi,
    private trackToPlay: number = 1,
    private speed: number = 1,
    private window: number = 16,
  ) {
    //this.midi.header.setTempo(70)
  }

  private get tickLength() { return (60 / this.tempo / this.midi.header.ppq) * this.speed }
  private get windowSeconds() { return this.tickLength * this.window }
  private tempo = this.midi.header.tempos[0].bpm
  private currentTick = 0
  private animation = new Animation()

  public onStateChange = (listener: (state: PlayerState) => void) => {
    this.animation.onFrame(({time, isPlaying}) => {
      if (time > this.midi.tracks[this.trackToPlay].duration) {
        this.stop()
      } else {
        this.currentTick = Math.floor(time / this.tickLength)
        const notes = this.midi.tracks[this.trackToPlay].notes
          .map(({midi, duration, time: noteTime}) => ({note: midi, position: noteTime - time, length: duration}))

        const currentNotes = notes
          .filter(({length, position}) => position <= 0 && position * -1 <= length)

        const currentNotesStart = notes
          .filter(({position}) => position <= this.windowSeconds && position * -1 <= this.windowSeconds)

        const currentNotesEnd = notes
          .filter(({length, position}) => position <= -length + this.windowSeconds && position * -1 <= length + this.windowSeconds)

        listener({
          currentTick: this.currentTick,
          notes,
          currentNotes,
          currentNotesStart,
          currentNotesEnd,
          isPlaying: isPlaying,
          tickLength: this.tickLength,
          time,
        })
      }
    })
  }

  public play = () => {
    this.animation.start()
  }

  public pause = () => {
    this.animation.pause()
  }

  public stop = () => {
    this.animation.stop()
  }

  public resume = () => {
    this.animation.resume()
  }
}

export default VisualPlayer;
