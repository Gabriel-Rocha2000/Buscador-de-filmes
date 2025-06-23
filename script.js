const API_KEY = 'a214ae6c';
let currentPage = 1;
let currentSearch = '';

function searchMovies(page = 1) {
  const query = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  const pageIndicator = document.getElementById('pageIndicator');

  if (query) currentSearch = query;
  if (!currentSearch) return;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(currentSearch)}&page=${page}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        resultsDiv.innerHTML = data.Search.map(movie => `
          <div class="movie-card" onclick="showDetails('${movie.imdbID}')">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=Sem+Imagem'}" alt="${movie.Title}" />
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
          </div>
        `).join('');
        currentPage = page;
        pageIndicator.textContent = `Página ${currentPage}`;
      } else {
        resultsDiv.innerHTML = `<p>Nenhum resultado encontrado.</p>`;
      }
    })
    .catch(err => {
      console.error(err);
      resultsDiv.innerHTML = `<p>Erro ao buscar os filmes.</p>`;
    });
}

function changePage(delta) {
  const nextPage = currentPage + delta;
  if (nextPage < 1) return;
  searchMovies(nextPage);
}

function showDetails(imdbID) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');

  modal.style.display = 'block';
  modalBody.innerHTML = 'Carregando...';

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        modalBody.innerHTML = `
          <h2>${data.Title} (${data.Year})</h2>
          <img src="${data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x450?text=Sem+Imagem'}" style="max-width: 200px; float: left; margin-right: 20px;" />
          <p><strong>Diretor:</strong> ${data.Director}</p>
          <p><strong>Atores:</strong> ${data.Actors}</p>
          <p><strong>Gênero:</strong> ${data.Genre}</p>
          <p><strong>Nota IMDb:</strong> ${data.imdbRating}</p>
          <p><strong>Sinopse:</strong> ${data.Plot}</p>
        `;
      } else {
        modalBody.innerHTML = '<p>Detalhes não encontrados.</p>';
      }
    })
    .catch(() => {
      modalBody.innerHTML = '<p>Erro ao buscar os detalhes.</p>';
    });
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
function autoSearch(filmName) {
  document.getElementById('searchInput').value = filmName;
  searchMovies(1);
}
