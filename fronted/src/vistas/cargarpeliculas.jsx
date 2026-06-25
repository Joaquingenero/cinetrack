import { useState } from 'react';

function CargarPeliculas() {
  // Estados para capturar los datos del formulario (agregados director y duracion)
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [anio, setAnio] = useState('');
  const [director, setDirector] = useState('');
  const [duracion, setDuracion] = useState('');

  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validamos que no envíen campos vacíos (ahora incluye director y duracion)
    if (!titulo || !genero || !sinopsis || !anio || !director || !duracion) {
      setMensaje({ texto: '⚠️ Por favor, completá todos los campos.', tipo: 'error' });
      return;
    }

    const nuevaPelicula = {
      titulo: titulo,
      genero: genero,
      sinopsis: sinopsis,
      anio_lanzamiento: parseInt(anio),
      director: director,            // <-- Enviamos el director requerido
      duracion: parseInt(duracion)   // <-- Enviamos la duracion requerida como número
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
        // Limpiamos todos los casilleros
        setTitulo('');
        setGenero('');
        setSinopsis('');
        setAnio('');
        setDirector('');
        setDuracion('');
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

          <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Género</label>
              <input 
                type="text" 
                placeholder="Ej: Ciencia Ficción" 
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Año de Lanzamiento</label>
              <input 
                type="number" 
                placeholder="Ej: 2014" 
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              />
            </div>
          </div>

          {/* NUEVA FILA: DIRECTOR Y DURACIÓN */}
          <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Director</label>
              <input 
                type="text" 
                placeholder="Ej: Christopher Nolan" 
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Duración (en minutos)</label>
              <input 
                type="number" 
                placeholder="Ej: 169" 
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
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