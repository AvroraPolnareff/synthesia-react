type Listener<T> = (state: T) => void

class EventEmitter<T> {
  private listeners: Listener<T>[] = []

  public on = (listener: Listener<T>) => {
    this.listeners.push(listener)
  }

  public remove = (listener: Listener<T>) => {
    this.listeners = this.listeners.filter(subscribed => subscribed !== listener)
  }

  public emit = (state: T) => {
    this.listeners.forEach(listener => listener(state))
  }
}

export default EventEmitter
