import { useState, useEffect } from 'react';

function Catalogo() {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para manejar el formulario de la reseña
  const [reseniasVisibles, setReseniasVisibles] = useState({});
  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(5);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '', peliId: null });

  // Estado para guardar los IDs de las películas que YA reseñamos
  const [peliculasReseniadas, setPeliculasReseniadas] = useState([]);

  // Estado para controlar si se muestra el cuadrito de sugerencias
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Cargamos películas y también las reseñas al arrancar
  useEffect(() => {
    // 1. Traer películas de la base de datos
    fetch('http://localhost:3000/api/peliculas')
      .then(res => res.json())
      .then(data => setPeliculas(data))
      .catch(err => console.error("Error al traer películas:", err));

    // 2. Traer reseñas para ver cuáles ya hizo el usuario con ID 1
    fetch('http://localhost:3000/api/resenias')
      .then(res => res.json())
      .then(data => {
        const idsReseniados = data
          .filter(r => r.id_usuario === 1)
          .map(r => r.id_pelicula);
        setPeliculasReseniadas(idsReseniados);
      })
      .catch(err => console.error("Error al cargar historial de reseñas:", err));
  }, []);

  // --- BÚSQUEDA GENERAL DE TARJETAS ---
  const filtradas = peliculas.filter(p => {
    const termino = busqueda.toLowerCase();
    return (
      (p.titulo && p.titulo.toLowerCase().includes(termino)) ||
      (p.director && p.director.toLowerCase().includes(termino)) ||
      (p.genero && p.genero.toLowerCase().includes(termino))
    );
  });

  // --- RECOMENDACIONES EN TIEMPO REAL ---
  const sugerencias = busqueda.trim() === "" 
    ? [] 
    : peliculas
        .filter(p => {
          const termino = busqueda.toLowerCase();
          return (
            (p.titulo && p.titulo.toLowerCase().startsWith(termino)) ||
            (p.director && p.director.toLowerCase().startsWith(termino)) ||
            (p.genero && p.genero.toLowerCase().startsWith(termino))
          );
        })
        .slice(0, 3);

  const toggleFormularioResenia = (peliId) => {
    setReseniasVisibles(prev => ({ ...prev, [peliId]: !prev[peliId] }));
    setMensaje({ texto: '', tipo: '', peliId: null });
    setComentario("");
    setPuntaje(5);
  };

  const enviarResenia = async (e, peliculaId) => {
    e.preventDefault();
    if (!comentario) {
      setMensaje({ texto: '⚠️ Por favor, escribí un comentario.', tipo: 'error', peliId: peliculaId });
      return;
    }

    const nuevaResenia = {
      id_pelicula: peliculaId,
      id_usuario: 1, 
      comentario: comentario,
      calificacion: parseInt(puntaje)
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/resenias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaResenia)
      });

      if (respuesta.ok) {
        setMensaje({ texto: '✅ ¡Reseña guardada con éxito!', tipo: 'exito', peliId: peliculaId });
        setComentario("");
        setPuntaje(5);
        setPeliculasReseniadas(prev => [...prev, peliculaId]);
        setTimeout(() => {
          setReseniasVisibles(prev => ({ ...prev, [peliculaId]: false }));
        }, 1500);
      } else {
        setMensaje({ texto: '❌ No se pudo guardar la reseña.', tipo: 'error', peliId: peliculaId });
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setMensaje({ texto: '❌ Error de conexión con el Backend.', tipo: 'error', peliId: peliculaId });
    }
  };

  return (
    <div className="view-container">
      <h2>Explorar Catálogo</h2>
      
      {/* CONTENEDOR ANCHO COMPLETO (100%) */}
      <div style={{ position: 'relative', marginBottom: '25px', width: '100%' }}>
        <div style={{ display: 'flex', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Buscar por título, director o género..." 
            className="search-input"
            value={busqueda}
            style={{ marginBottom: 0, width: '100%', borderRadius: '4px 0 0 4px' }}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMostrarSugerencias(true);
            }}
            onFocus={() => setMostrarSugerencias(true)}
          />
          <button style={{
            padding: '0 25px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}>
            Buscar
          </button>
        </div>

        {/* DESPLEGABLE ESTILO BLANCO */}
        {mostrarSugerencias && sugerencias.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0 0 6px 6px',
            zIndex: 10,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            marginTop: '2px'
          }}>
            {sugerencias.map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setBusqueda(p.titulo);
                  setMostrarSugerencias(false);
                }}
                style={{
                  padding: '14px 18px',
                  cursor: 'pointer',
                  color: '#1f2937',
                  borderBottom: '1px solid #e5e7eb',
                  transition: 'background 0.2s',
                  fontSize: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'sans-serif'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                <span style={{ fontWeight: '500' }}>🎬 {p.titulo}</span>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  {p.director} ({p.genero})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETECTOR PARA CERRAR RECUADRO FLOTANTE */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <div 
          onClick={() => setMostrarSugerencias(false)} 
          style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 5 }}
        />
      )}

      {/* GRID DE TARJETAS */}
      <div className="grid-peliculas" style={{ position: 'relative', zIndex: 1 }}>
        {filtradas.map(p => {
          const yaReseniada = peliculasReseniadas.includes(p.id);

          return (
            <div key={p.id} className="peli-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3>{p.titulo}</h3>
                
                {/* GÉNERO CLICLEABLE */}
                <p style={{ fontSize: '0.9rem', margin: '4px 0' }}>
                  🎬 <strong>Género:</strong>{' '}
                  <span 
                    onClick={() => setBusqueda(p.genero || '')}
                    style={{ 
                      color: '#38bdf8', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    title="Filtrar por este género"
                  >
                    {p.genero || 'No especificado'}
                  </span>
                </p>

                {/* DIRECTOR CLICLEABLE */}
                <p style={{ fontSize: '0.85rem', margin: '4px 0 10px 0' }}>
                  👤 <strong>Director:</strong>{' '}
                  <span 
                    onClick={() => setBusqueda(p.director || '')}
                    style={{ 
                      color: '#a7f3d0', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    title="Filtrar por este director"
                  >
                    {p.director || 'Desconocido'}
                  </span>
                </p>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>{p.sinopsis}</p>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                {yaReseniada ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '8px', 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    color: '#4ade80', 
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    fontWeight: '500'
                  }}>
                    ✅ Ya la reseñaste
                  </div>
                ) : (
                  <button 
                    className="btn-submit" 
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem', background: '#334155', color: 'white' }}
                    onClick={() => toggleFormularioResenia(p.id)}
                  >
                    {reseniasVisibles[p.id] ? 'Cancelar' : '⭐ Reseñar'}
                  </button>
                )}

                {reseniasVisibles[p.id] && !yaReseniada && (
                  <form onSubmit={(e) => enviarResenia(e, p.id)} style={{ marginTop: '10px', background: '#0f172a', padding: '10px', borderRadius: '8px' }}>
                    
                    {mensaje.peliId === p.id && (
                      <div className={`alert-message ${mensaje.tipo}`} style={{ fontSize: '0.8rem', padding: '6px', marginBottom: '8px' }}>
                        {mensaje.texto}
                      </div>
                    )}

                    <div className="form-group" style={{ gap: '4px', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.75rem' }}>Puntaje:</label>
                      <select 
                        value={puntaje} 
                        onChange={(e) => setPuntaje(e.target.value)}
                        style={{ padding: '4px', background: '#1e293b', color: 'white', border: '1px solid #475569', borderRadius: '4px' }}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                        <option value="4">⭐⭐⭐⭐ (4)</option>
                        <option value="3">⭐⭐⭐ (3)</option>
                        <option value="2">⭐⭐ (2)</option>
                        <option value="1">⭐ (1)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ gap: '4px' }}>
                      <label style={{ fontSize: '0.75rem' }}>Tu opinión:</label>
                      <textarea 
                        rows="2" 
                        placeholder="¿Qué te pareció?" 
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        style={{ padding: '6px', fontSize: '0.85rem' }}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-submit" style={{ width: '100%', padding: '6px', fontSize: '0.8rem', marginTop: '8px' }}>
                      Enviar
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Catalogo;