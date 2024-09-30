// Cargamos los datos de las películas cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    const moviesUrl = "https://japceibal.github.io/japflix_api/movies-data.json";
    const botonBuscar = document.getElementById("btnBuscar"); // Botón de buscar
    const inputBuscar = document.getElementById("inputBuscar"); // Campo de búsqueda
    const listaPeliculasContainer = document.getElementById("lista"); // Contenedor de resultados
  
    // Hacemos la solicitud a la URL y guardamos los datos en localStorage
    fetch(moviesUrl)
      .then(response => response.json())
      .then(data => localStorage.setItem("movies-data-json", JSON.stringify(data)))
      .catch(error => console.error("Error al cargar los datos:", error));
  
    // Evento para el botón de buscar
    botonBuscar.addEventListener("click", () => {
      listaPeliculasContainer.innerHTML = ''; // Limpiamos el contenedor
  
      const textoIngresado = inputBuscar.value.toLowerCase(); // Tomamos el texto ingresado en minúsculas
      if (!textoIngresado) return; // Si el campo está vacío, salimos
  
      const listaPeliculas = JSON.parse(localStorage.getItem("movies-data-json")); // Obtenemos los datos de localStorage
  
      // Filtramos las películas que coincidan con el texto ingresado
      const peliculasFiltradas = listaPeliculas.filter(pelicula =>
        pelicula.title.toLowerCase().includes(textoIngresado) ||
        pelicula.tagline.toLowerCase().includes(textoIngresado) ||
        pelicula.overview.toLowerCase().includes(textoIngresado) ||
        pelicula.genres.some(genero => genero.name.toLowerCase().includes(textoIngresado))
      );
  
      // Si no se encuentran películas, mostramos un mensaje de alerta
      if (peliculasFiltradas.length === 0) {
        alert("No se encontraron resultados para la búsqueda.");
        return;
      }
  
      // Mostramos las películas filtradas en la lista
      peliculasFiltradas.forEach(pelicula => {
        listaPeliculasContainer.appendChild(crearElementoPelicula(pelicula));
      });
    });
  });
  
  // Crea un elemento de lista con la información de la película
  function crearElementoPelicula(pelicula) {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark item-pelicula';
  
    li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex flex-column">
            <span class="text-white">${pelicula.title}</span>
            <span class="text-secondary">${pelicula.tagline}</span>
          </div>
          <div class="text-white">
            ${generarEstrellas(pelicula.vote_average)}
          </div>
        </div>
      `;
  
    li.addEventListener("click", () => { mostrarDetallesPelicula(pelicula); });
  
    return li;
  }
  
// Devuelve estrellas de calificación basadas en el promedio de votación
function generarEstrellas(promedioDeVotacion) { 
    const estrellas = Math.round(promedioDeVotacion / 2);       // Redondeamos la calificación a un valor entre 0 y 5 (cada estrella representa 2 puntos)

    let estrellasHtml = '';     // Variable que guardará el HTML de las estrellas
  
    // Creamos un ciclo que agrega 5 estrellas en total
    for (let i = 1; i <= 5; i++) {
      // Si el número de estrellas actual es menor o igual al promedio (de la pelicula), la estrella será "llena" (checked)
      if (i <= estrellas) {
        estrellasHtml += '<span class="fa fa-star checked"></span>';
      } else {
        // Si no, será una estrella vacía
        estrellasHtml += '<span class="fa fa-star"></span>';
      }
    }
    return estrellasHtml;      // Devolvemos el HTML con las estrellas generadas
  }
  
  // Despliega los detalles de la película en un contenedor superior (offcanvas)
  function mostrarDetallesPelicula(pelicula) {
    const movieOverview = document.getElementById("movieOverview");
    const movieTitle = document.getElementById("movieTitle");
    const movieGenres = document.getElementById("movieGenres");
    const movieYear = document.getElementById("movieYear");
    const movieRuntime = document.getElementById("movieRuntime");
    const movieBudget = document.getElementById("movieBudget");
    const movieRevenue = document.getElementById("movieRevenue");
  
    movieOverview.innerText = pelicula.overview;
    movieTitle.innerText = pelicula.title;
    movieYear.innerText = pelicula.release_date.split('-')[0];
    movieRuntime.innerText = pelicula.runtime + ' mins';
    movieBudget.innerText = '$' + pelicula.budget;
    movieRevenue.innerText = '$' + pelicula.revenue;
  
    movieGenres.innerHTML = '';
    pelicula.genres.forEach(genre => {
      const listItem = document.createElement('li');
      listItem.textContent = genre.name;
      movieGenres.appendChild(listItem);
    });
  
    const detallePelicula = document.getElementById('offcanvas-detalle-pelicula');
    const offcanvas = new bootstrap.Offcanvas(detallePelicula);
    offcanvas.show();
  }
