import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GlobalState } from "@/components/utility/global-state"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalState>
      <App />
    </GlobalState>
  </React.StrictMode>,
)
