import EventEmitter from "../event-emitter"

interface AnimationState {
  isPlaying: boolean
  startTime: number
  time: number
}

/**
 * requestAnimationFrame wrapper
 */
class AnimationCore {

  private animation = 0
  private isPlaying = false
  private isStarted = false
  private startTime = 0
  private time = 0
  private event = new EventEmitter<AnimationState>()

  public onFrame = (listener: (state: AnimationState) => void) => {
    this.event.on(listener)
  }

  public start = () => {
    this.isPlaying = true
    this.animation = requestAnimationFrame((time) => {
      if (!this.isStarted) {
        this.startTime = time / 1000
        this.isStarted = true
      }
      if (!this.isPlaying) return

      this.time = time / 1000 - this.startTime
      this.event.emit({time: this.time, startTime: this.startTime, isPlaying: this.isPlaying})
      this.start()
    })
  }

  public stop = () => {
    this.isPlaying = false
    this.isStarted = false
    this.time = 0
    this.startTime = 0
    this.event.emit({time: this.time, startTime: this.startTime, isPlaying: this.isPlaying})
  }

  public pause = () => {
    throw Error("not implemented")
  }

  public resume = () => {
    throw Error("not implemented")
  }
}

export default AnimationCore
