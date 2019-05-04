import React from 'react'
import ReactDOM from 'react-dom'

import Router, { RouterView, RouterLink } from '../../dist/router.esm'

Router.useMode('hash')

const routes = [
  {
    path: '/',
    component: () => <h1>Hello</h1>
  },

  {
    path: '/feed',
    component: () => <h1>Feed</h1>
  }
]

ReactDOM.render(
  <>
    <nav>
      <RouterLink to='/'>Home</RouterLink>
      <RouterLink to='/feed'>Feed</RouterLink>
    </nav>
    <RouterView routes={routes} />
  </>,
  document.querySelector('#root')
)