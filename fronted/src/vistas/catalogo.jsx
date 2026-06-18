import { useState, useEffect } from 'react';

function Catalogo() {
  const [peliculas, setPeliculas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para manejar el formulario de la reseña
  const [reseniasVisibles, setReseniasVisibles] = useState({});
  const [comentario, setComentario] = useState("");
  const [puntaje, setPuntaje] = useState(5);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '', peliId: null });

  // --- NUEVO: Estado para guardar los IDs de las películas que YA reseñamos ---
  const [peliculasReseniadas, setPeliculasReseniadas] = useState([]);

  // Cargamos películas y también las reseñas para bloquear los botones desde el arranque
  useEffect(() => {
    // 1. Traer películas
    fetch('http://localhost:3000/api/peliculas')
      .then(res => res.json())
      .then(data => setPeliculas(data))
      .catch(err => console.error("Error al traer películas:", err));

    // 2. Traer reseñas para ver cuáles ya hizo el usuario con ID 1
    fetch('http://localhost:3000/api/resenias')
      .then(res => res.json())
      .then(data => {
        // Filtramos las del usuario 1 y guardamos solo los id_pelicula
        const idsReseniados = data
          .filter(r => r.id_usuario === 1)
          .map(r => r.id_pelicula);
        setPeliculasReseniadas(idsReseniados);
      })
      .catch(err => console.error("Error al cargar historial de reseñas:", err));
  }, []);

  const filtradas = peliculas.filter(p => 
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleFormularioResenia = (peliId) => {
    setReseniasVisibles(prev => ({
      ...prev,
      [peliId]: !prev[peliId]
    }));
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaResenia)
      });

      if (!respuesta.ok) {
        const textoError = await respuesta.text();
        console.log("🚨 MENSAJE EXACTO DEL BACKEND:", textoError);
      }

      if (respuesta.ok) {
        setMensaje({ texto: '✅ ¡Reseña guardada con éxito!', tipo: 'exito', peliId: peliculaId });
        setComentario("");
        setPuntaje(5);

        // --- NUEVO: Agregamos esta película a la lista de bloqueadas al instante ---
        setPeliculasReseniadas(prev => [...prev, peliculaId]);

        // Cerramos el formulario automáticamente
        setTimeout(() => {
          setReseniasVisibles(prev => ({ ...prev, [peliculaId]: false }));
        }, 1500);
      } else {
        setMensaje({ texto: '❌ No se pudo guardar la reseña. Mirá la consola de inspect.', tipo: 'error', peliId: peliculaId });
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      setMensaje({ texto: '❌ Error de conexión con el Backend.', tipo: 'error', peliId: peliculaId });
    }
  };

  return (
    <div className="view-container">
      <h2>Explorar Catálogo</h2>
      <input 
        type="text" 
        placeholder="Buscar película..." 
        className="search-input"
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="grid-peliculas">
        {filtradas.map(p => {
          // --- NUEVO: Chequeamos si esta peli ya fue reseñada por el usuario ---
          const yaReseniada = peliculasReseniadas.includes(p.id);

          return (
            <div key={p.id} className="peli-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3>{p.titulo}</h3>
                <p style={{ color: '#38bdf8', fontSize: '0.9rem' }}>{p.genero}</p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{p.sinopsis}</p>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                {/* MODIFICADO: Si ya está reseñada, cambiamos el botón por un cartel de bloqueo */}
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