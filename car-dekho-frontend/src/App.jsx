import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CarListing from './pages/CarListing'
import CarDetails from './pages/CarDetails'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CarListing />} />
        <Route path="/car/:id" element={<CarDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
