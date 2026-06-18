import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalogo from './vistas/catalogo';
import CargarPeliculas from './vistas/cargarpeliculas'; // Nombre con C mayúscula, ruta en minúscula
import Perfil from './vistas/perfil';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* BARRA DE NAVEGACIÓN */}
        <nav className="navbar">
          <div className="nav-logo">Cine<span>Track</span></div>
          <div className="nav-links">
            <Link to="/">Catálogo</Link>
            <Link to="/cargar">Cargar Película</Link>
            <Link to="/perfil">Mi Perfil</Link>
          </div>
        </nav>

        {/* CONTENEDOR DE VISTAS */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/cargar" element={<CargarPeliculas />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;