import { useState } from 'react';

function CargarPeliculas() {
  // Estados para capturar los datos del formulario
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [anio, setAnio] = useState('');

  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validamos que no envíen campos vacíos
    if (!titulo || !genero || !sinopsis || !anio) {
      setMensaje({ texto: '⚠️ Por favor, completá todos los campos.', tipo: 'error' });
      return;
    }

    const nuevaPelicula = {
      titulo: titulo,
      genero: genero,
      sinopsis: sinopsis,
      anio_lanzamiento: parseInt(anio) // Lo convertimos a número para la base de datos
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/peliculas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaPelicula)
      });

      if (respuesta.ok) {
        setMensaje({ texto: '✅ ¡Película guardada con éxito en el catálogo!', tipo: 'exito' });
        // Limpiamos los casilleros del formulario
        setTitulo('');
        setGenero('');
        setSinopsis('');
        setAnio('');
      } else {
        setMensaje({ texto: '❌ Hubo un problema al guardar en el servidor.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setMensaje({ texto: '❌ No se pudo conectar con el Backend.', tipo: 'error' });
    }
  };

  return (
    <div className="view-container">
      <div className="form-box">
        <h2>Cargar Nueva Película</h2>
        <p className="form-subtitle">Sumá un título al sistema de CineTrack</p>

        {/* Alerta dinámica si hay mensajes */}
        {mensaje.texto && (
          <div className={`alert-message ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="movie-form">
          <div className="form-group">
            <label>Título de la Película</label>
            <input 
              type="text" 
              placeholder="Ej: Interstellar" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Género</label>
              <input 
                type="text" 
                placeholder="Ej: Ciencia Ficción" 
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Año de Lanzamiento</label>
              <input 
                type="number" 
                placeholder="Ej: 2014" 
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sinopsis / Resumen</label>
            <textarea 
              rows="4" 
              placeholder="Escribí una breve descripción de la trama..." 
              value={sinopsis}
              onChange={(e) => setSinopsis(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn-submit">Guardar Película</button>
        </form>
      </div>
    </div>
  );
}

export default CargarPeliculas;