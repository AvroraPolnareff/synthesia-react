import EventEmitter from "../event-emitter"

interface AnimationState {
  isPlaying: boolean
  startTime: number
  time: number
}

/**
 * requestAnimationFrame wrapper
 */
class Animation {
  private animation = 0
  private isPlaying = false
  private isStarted = false
  private startTime = 0
  private time = 0
  private event = new EventEmitter<AnimationState>()

  public onFrame = (listener: (state: AnimationState) => void) => {
    this.event.on(listener)
  }

  private loop = (time: number) => {
    if (!this.isStarted && this.isPlaying) {
      this.startTime = time / 1000
      this.isStarted = true
    }

    if (this.isPlaying) {
      this.time = time / 1000 - this.startTime
      this.event.emit({time: this.time, startTime: this.startTime, isPlaying: this.isPlaying})
      this.animation = requestAnimationFrame(this.loop)
    }
  }

  public start = () => {
    this.isPlaying = true
    this.animation = requestAnimationFrame(this.loop)
  }

  public stop = () => {
    cancelAnimationFrame(this.animation)
    this.isPlaying = false
    this.isStarted = false
    this.time = 0
    this.startTime = 0
    this.event.emit({time: 0, startTime: 0, isPlaying: false})
  }

  public pause = () => {
    throw Error("not implemented")
  }

  public resume = () => {
    throw Error("not implemented")
  }
}

export default Animation
