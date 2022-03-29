import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyles as BaseStyles } from 'twin.macro'

import './assets/index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BaseStyles />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
