import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux"
import { setupStore } from './store/store'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const store = setupStore()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App /> } />
        </Routes>
      </BrowserRouter>      
    </Provider>
  </React.StrictMode>,
)
