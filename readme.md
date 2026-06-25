# 🎬 Plataforma de Catálogo y Reseñas de Películas

Este proyecto es una aplicación web completa que permite explorar un catálogo de películas, realizar búsquedas inteligentes por título, director o género, y gestionar reseñas con calificaciones.

---

## 📂 Estructura del Proyecto

El proyecto está organizado en un único repositorio con dos componentes principales perfectamente divididos:

* **`/backend`**: Servidor API construido con Node.js, Express y Sequelize, conectado a una base de datos local SQLite (`database.sqlite`).
* **`/frontend`**: Interfaz de usuario SPA desarrollada con React, Vite y CSS adaptativo.

---

## 💻 Características Clave del Frontend (React + Vite)

La interfaz de usuario fue diseñada para ofrecer una experiencia fluida e interactiva, implementando las siguientes soluciones lógicas:

1. **Buscador Inteligente con Autocompletado (Estilo Dropdown):**
   * Una barra de búsqueda unificada de ancho completo que permite filtrar las tarjetas dinámicamente.
   * Cuenta con un menú desplegable en tiempo real que sugiere hasta un máximo de 3 películas a medida que el usuario escribe. La lógica busca coincidencias desde el inicio del texto (`.startsWith()`) tanto en títulos como en directores y géneros.
   * Al hacer clic en una sugerencia, el buscador se auto-completa y aísla la película seleccionada.

2. **Navegación por Etiquetas Clicleables:**
   * El **Género** y el **Director** dentro de cada tarjeta actúan como enlaces interactivos. 
   * Al hacer clic sobre ellos, el término se inyecta directamente en la barra de búsqueda principal, filtrando instantáneamente todo el catálogo por ese criterio.

3. **Control Anti-Duplicado de Reseñas:**
   * El frontend consume el historial de la API para verificar qué películas ya han sido calificadas por el usuario actual.
   * Si la película ya fue reseñada, el formulario se bloquea automáticamente y la interfaz renderiza un indicador visual inmutable (`✅ Ya la reseñaste`), impidiendo envíos duplicados.

---

## 🚀 Instrucciones para Levantar la Aplicación

Seguir estos pasos en orden para instalar las dependencias y ejecutar ambos servicios localmente en tu entorno de desarrollo.

### 1. Requisitos Previos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 2. Configuración y Arranque del Backend 🛠️
Abrir una terminal en la raíz del proyecto y ejecutar los siguientes comandos:

```bash
# 1. Cambiarse a la carpeta del servidor backend
cd backend

# 2. Instalar los módulos de Node necesarios (Express, Sequelize, etc.)
npm install

# 3. Iniciar el servidor en entorno de desarrollo (con Nodemon)
npm run dev

### 3. Configuración y Arranque del Frontend 🖥️

# 1. Cambiarse a la carpeta de la interfaz de usuario (React)
cd frontend

# 2. Instalar todas las dependencias y paquetes requeridos del cliente
npm install

# 3. Levantar el servidor de desarrollo local provisto por Vite
npm run dev