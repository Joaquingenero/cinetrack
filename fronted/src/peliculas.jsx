import { useState, useEffect } from 'react';

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [director, setDirector] = useState('');
  const [anio, setAnio] = useState('');
  const [genero, setGenero] = useState('');
  const [duracion, setDuracion] = useState('');

  const URL_API = 'http://localhost:3000/api/peliculas';

  // GET: Traer películas
  const obtenerPeliculas = async () => {
    try {
      const response = await fetch(URL_API);
      const data = await response.json();
      setPeliculas(data);
    } catch (error) {
      console.error('Error al traer películas:', error);
    }
  };

  useEffect(() => {
    obtenerPeliculas();
  }, []);

  // POST: Guardar película
  const guardarPelicula = async (e) => {
    e.preventDefault();

    const nuevaPelicula = {
      titulo,
      sinopsis,
      director,
      anio_lanzamiento: parseInt(anio),
      genero,
      duracion: parseInt(duracion)
    };

    try {
      const response = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaPelicula)
      });

      if (response.ok) {
        obtenerPeliculas(); // Recarga la lista
        // Limpia el formulario
        setTitulo(''); setSinopsis(''); setDirector(''); setAnio(''); setGenero(''); setDuracion('');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🎬 Administrador de Películas</h2>

      <form onSubmit={guardarPelicula} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <h3>Cargar Nueva Película</h3>
        <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <textarea placeholder="Sinopsis" value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} required />
        <input type="text" placeholder="Director" value={director} onChange={(e) => setDirector(e.target.value)} required />
        <input type="number" placeholder="Año" value={anio} onChange={(e) => setAnio(e.target.value)} required />
        <input type="text" placeholder="Género" value={genero} onChange={(e) => setGenero(e.target.value)} required />
        <input type="number" placeholder="Duración (min)" value={duracion} onChange={(e) => setDuracion(e.target.value)} required />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Guardar</button>
      </form>

      <hr />

      <h3>🍿 Catálogo</h3>
      {peliculas.length === 0 ? <p>No hay películas.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {peliculas.map((peli) => (
            <div key={peli.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
              <h4>{peli.titulo} ({peli.anio_lanzamiento})</h4>
              <p><strong>Director:</strong> {peli.director} | <strong>Género:</strong> {peli.genero}</p>
              <p>{peli.sinopsis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}