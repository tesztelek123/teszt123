import './scss/style.scss';
import '@fortawesome/fontawesome-free/css/all.css';

import 'regenerator-runtime';


const form = document.querySelector('form');
const search = document.querySelector('#search');

const APIURL = 'https://api.github.com/users/';

async function getUser(username) {
  try {
    const response = await fetch(APIURL + username);
    if (response.statusText === 'Not Found')
      throw new Error('A felhasználó nem található!');

    if (response.status === 403)
      throw new Error('Túllépted a maximális lekérések számát!');

    const data = await response.json();
    createUserHtml(data);
    getRepos(username);
  }
  catch (error) {    
    createErrorHtml(error.message, 'error');  
  }
}

async function getRepos(username) {
  const response = await fetch(APIURL + username + '/repos?sort=created');
  const data = await response.json();
  
  createReposHtml(data);
}

function createUserHtml(user) {
  const html = `
    <div class="container">
        <div>
          <img src="${user.avatar_url}" alt="${user.login}">
          <a href="${user.html_url}" target="_blank">Profil megtekintése</a>
        </div>
        <div class="user-info">
          <div class="main-info">
            ${user.name ? '<h2>' + user.name + '</h2>' : ''}
            <small><i class="fas fa-user"></i> ${user.login}</small>
            ${user.location ? '<small><i class="fas fa-map-marker-alt"></i> ' + user.location + '</small>' : ''}
          </div>

          ${user.bio ? '<p>' + user.bio +'</p>' : ''}

          <ul>
            <li><i class="fas fa-users"></i> ${user.followers} <strong>követő</strong></li>
            <li><i class="fas fa-user-plus"></i> ${user.following} <strong>követés</strong></li>
            <li><i class="fas fa-book"></i> ${user.public_repos} <strong>repó</strong></li>
          </ul>

          <div class="repos"></div>
        </div>
      </div>
  `;

  document.querySelector('main').innerHTML = html;
}

function createReposHtml(repos) {
  const reposEl = document.querySelector('.repos');

  if (repos.length) {
    repos
      .slice(0, 5)
      .forEach((repo) => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;

        reposEl.append(repoEl);
    })
  } else {
    const header = document.createElement('h3');
    header.innerText = 'Nincsenek repók...';

    reposEl.append(header);
  }
}

function createErrorHtml(message, className) {
  const html = `
    <span class="${className}">${message}</span>
  `;

  document.querySelector('main').innerHTML = html;

  setTimeout(() => {
    document.querySelector('main span').remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (search.value)
    getUser(search.value);

  search.value = '';
});