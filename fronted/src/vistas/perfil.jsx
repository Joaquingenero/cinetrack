import { useState, useEffect } from 'react';

function Perfil() {
  // Estados para guardar los datos del perfil
  const [nombre, setNombre] = useState('Usuario de CineTrack');
  const [email, setEmail] = useState('joaquin@ejemplo.com');
  
  // Estado para saber si estamos editando o solo mirando
  const [editando, setEditando] = useState(false);

  // Estados temporales para el formulario mientras escribimos
  const [tempNombre, setTempNombre] = useState(nombre);
  const [tempEmail, setTempEmail] = useState(email);

  // Estados para las reseñas del usuario
  const [misResenias, setMisResenias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Traemos las reseñas desde el backend al cargar la vista
  useEffect(() => {
    fetch('http://localhost:3000/api/resenias')
      .then(res => res.json())
      .then(data => {
        // Filtramos para quedarnos solo con las reseñas del usuario con id_usuario = 1
        const filtradas = data.filter(r => r.id_usuario === 1);
        setMisResenias(filtradas);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al traer reseñas:", err);
        setCargando(false);
      });
  }, []);

  const activarEdicion = () => {
    setTempNombre(nombre);
    setTempEmail(email);
    setEditando(true);
  };

  const guardarCambios = (e) => {
    e.preventDefault();
    setNombre(tempNombre);
    setEmail(tempEmail);
    setEditando(false);
  };

  // --- NUEVA FUNCIÓN: ELIMINAR RESEÑA ---
  const eliminarResenia = async (idResenia) => {
    // Un cartelito rápido de confirmación para no borrar sin querer
    if (!window.confirm("¿Seguro que querés eliminar esta reseña?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/resenias/${idResenia}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        // Si el backend la borró con éxito, la sacamos del estado para que desaparezca de la pantalla
        setMisResenias(prev => prev.filter(r => r.id !== idResenia));
        alert("✅ Reseña eliminada correctamente.");
      } else {
        alert("❌ No se pudo eliminar la reseña en el servidor.");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("❌ Error de conexión con el Backend.");
    }
  };

  // Función auxiliar para dibujar las estrellitas en base a la calificación
  const renderEstrellas = (puntaje) => {
    return "⭐".repeat(puntaje);
  };

  return (
    <div className="view-container">
      <h2>Mi Perfil</h2>
      
      <div className="profile-card">
        <div className="avatar">👤</div>
        
        {!editando ? (
          <>
            <h3>{nombre}</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Email: {email}</p>
            <button className="btn-submit" onClick={activarEdicion} style={{ maxWidth: '200px', margin: 'auto' }}>
              Editar Datos
            </button>
          </>
        ) : (
          <form onSubmit={guardarCambios} className="movie-form" style={{ maxWidth: '300px', margin: 'auto' }}>
            <div className="form-group">
              <label>Nombre de Usuario</label>
              <input 
                type="text" 
                value={tempNombre} 
                onChange={(e) => setTempNombre(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={tempEmail} 
                onChange={(e) => setTempEmail(e.target.value)} 
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-submit" style={{ flex: 1, margin: 0 }}>
                Guardar
              </button>
              <button 
                type="button" 
                className="btn-submit" 
                style={{ flex: 1, margin: 0, background: '#475569', color: 'white' }}
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECCIÓN DE MIS RESEÑAS */}
      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Mis Reseñas Históricas</h3>
        
        {cargando ? (
          <p style={{ color: '#94a3b8' }}>Cargando tus opiniones...</p>
        ) : misResenias.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Todavía no dejaste ninguna reseña. ¡Andá al catálogo y sé el primero!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            {misResenias.map(r => (
              <div key={r.id} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', position: 'relative' }}>
                
                {/* BOTÓN DE ELIMINAR (TACHITO) */}
                <button 
                  onClick={() => eliminarResenia(r.id)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                  title="Eliminar reseña"
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  🗑️
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingRight: '30px' }}>
                  <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>Película #{r.id_pelicula}</span>
                  <span>{renderEstrellas(r.calificacion)}</span>
                </div>
                <p style={{ margin: 0, color: '#cbd5e1', fontStyle: 'italic' }}>"{r.comentario}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Perfil;