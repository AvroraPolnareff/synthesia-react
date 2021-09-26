import {Midi} from "@tonejs/midi"
import AnimationCore from "../animation-core"

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
  time: number
}

export const initPlayerState: PlayerState = {
  isPlaying: false,
  currentNotes: [],
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
  ) { }

  private get tickLength() { return 60 / this.tempo / this.midi.header.ppq * this.speed }

  private tempo = this.midi.header.tempos[0].bpm
  private currentTick = 0
  private animation = new AnimationCore()

  public onStateChange = (listener: (state: PlayerState) => void) => {
    this.animation.onFrame(({time, startTime, isPlaying}) => {
      if (time > this.midi.tracks[this.trackToPlay].duration) {
        this.stop()
      } else {
        this.currentTick = Math.floor(time / this.tickLength)
        const notes = this.midi.tracks[this.trackToPlay].notes
          .map(({midi, duration, time: noteTime}) => ({note: midi, position: noteTime - time, length: duration}))
        const currentNotes = notes.filter(note => note.position <= 0 && note.position * -1 <= note.length)
        listener({
          currentTick: this.currentTick,
          notes,
          currentNotes,
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
