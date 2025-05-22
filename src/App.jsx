import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Weather from './pages/Weather'
import About from './pages/About'
import Contact from './pages/Contact'
import Nav from './navigation/Nav'

function App() {
  

  return (
     <>
     <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
     </Router>

    </>
  )
}

export default App
