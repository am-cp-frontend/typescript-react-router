import React from 'react'
import _RouterView, { RouterProps } from './RouterView'
import RoutingBus, { ROUTER_MODES, BusContext, reinit } from './eventBus'

let bus: ReturnType<typeof RoutingBus> = RoutingBus()

export default {
  useMode: (mode: ROUTER_MODES) => bus = reinit({ mode })
}

export const RouterView = (props: RouterProps) => (
  <BusContext.Provider value={bus}>
    <_RouterView routes={props.routes} base={props.base} />
  </BusContext.Provider>
)

export const RouterLink = ({ to, children }: React.PropsWithChildren<{ to: string }>) => {
  const handler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    bus.push(to)
  }

  return (
    <a href='#' onClick={handler}>
      { children }
    </a>
  )
}