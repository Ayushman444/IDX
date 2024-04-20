
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import './App.css';
import { EditorPage } from './pages/EditorPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
        <Route path="/editor/" element={<EditorPage />} />

      </Routes>
    </Router>
  );
}

export default App;
