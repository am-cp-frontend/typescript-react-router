import React from 'react'

export enum ROUTER_MODES { HISTORY = 'history', HASH = 'hash' }
export enum EVENT_TYPES { ROUTE_CHANGED }

export const subscribe = Symbol('subscribe')
export const unsubscribe = Symbol('unsubscribe')
export const dispatch = Symbol('dispatch')

const uniqueId = ((initial) => {
  let i = initial
  return () => i++
}) (0)

interface RoutingEvent {
  type: EVENT_TYPES,
  url: string
}

interface RoutingEventsSubscriber {
  baseUrl: string
  callback: (e: RoutingEvent) => void
}

interface BusOptions {
  mode?: ROUTER_MODES
}

const getCurrentUrl = (mode: ROUTER_MODES) =>
  mode === ROUTER_MODES.HISTORY
    ? window.location.pathname
    : window.location.hash

class RoutingBus {
  private mode: ROUTER_MODES
  private subscribers: Array<RoutingEventsSubscriber & { id: number }> = []

  constructor ({ mode = ROUTER_MODES.HISTORY }: BusOptions = {}) {
    this.mode = mode

    if (mode === ROUTER_MODES.HISTORY) window.addEventListener('popstate', () => {
      this[dispatch](
        EVENT_TYPES.ROUTE_CHANGED,
        getCurrentUrl(mode)
      )
    })
    else window.location.hash = '/'
  }

  [dispatch] = (eventType: EVENT_TYPES, url: string) => {
    const event: RoutingEvent = {
      type: eventType,
      url
    }

    this.subscribers.forEach(s => {
      if (url.startsWith(s.baseUrl)) s.callback(event)
    })
  }

  get currentPath () {
    return getCurrentUrl(this.mode)
  }

  push (url: string) {
    if (this.mode === ROUTER_MODES.HISTORY) window.history.pushState(
      null,
      document.title,
      url
    )
    else window.location.hash = url

    this[dispatch](EVENT_TYPES.ROUTE_CHANGED, url)
  }

  [subscribe] = (s: RoutingEventsSubscriber) => {
    const id = uniqueId()
    this.subscribers.push({ ...s, id })
    return id
  }

  [unsubscribe] = (id: number) => this.subscribers = this.subscribers.filter(s => s.id !== id)
}

let instance: RoutingBus = new RoutingBus()

export default () => instance
export const reinit = (opts: BusOptions) => instance = new RoutingBus(opts)
export const BusContext = React.createContext(instance)

export { RoutingBus }