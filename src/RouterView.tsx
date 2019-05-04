import React from 'react'

import { BusContext, subscribe, unsubscribe } from './eventBus'

export interface Route {
  path: string,
  component: React.ComponentType
}

export interface RouterProps {
  routes: Array<Route>
  base?: string
}

interface RouterState {
  currentRoute: Route | null
}

export default class RouterView extends React.Component<RouterProps, RouterState> {
  static contextType = BusContext
  context!: React.ContextType<typeof BusContext>

  state: RouterState = {
    currentRoute: null
  }

  private update = ({ url }: { url: string }) => {
    const [ route ] = this.props.routes.filter(v => url.endsWith(v.path))

    this.setState({
      currentRoute: route
    })
  }

  private subscriberId: number = 0

  componentWillMount () {
    this.subscriberId = this.context[subscribe]({
      baseUrl: this.props.base || '/',
      callback: this.update
    })

    this.update({ url: this.context.currentPath })
  }

  componentWillUnmount () {
    this.context[unsubscribe](this.subscriberId)
  }

  render () {
    const _ = this.state.currentRoute
    if (_ === null) return null

    const RouteComponent = _.component

    return (
      <React.Fragment>
        <RouteComponent />
      </React.Fragment>
    )
  }
}