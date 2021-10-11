console.log('QQQ');

const gridViewIcon = document.querySelector('.grid-view');
const listViewIcon = document.querySelector('.list-view');
const imagesView = document.querySelector('.images-view');

const loader = document.querySelector('.loader-overlay');

function switchViewMode() {
  gridViewIcon.classList.toggle('view--active')
  listViewIcon.classList.toggle('view--active')

  imagesView.classList.toggle('images-view--grid');
  imagesView.classList.toggle('images-view--list');
};

[gridViewIcon, listViewIcon].forEach(el => {
  el.addEventListener('click', switchViewMode);
});

function startEndLoader() {
  loader.classList.toggle('loader-overlay--active');
};

async function getPhotos() {
  startEndLoader();
  const response = await fetch('https://api.unsplash.com/photos/random?count=6&client_id=LVTQ3W33_bo9qp9FRXvnNs3DZZj8Bo9ucA84Aww9jU4');
  const photosArray = await response.json();

  startEndLoader();
  displayPhotos(photosArray);
};

function displayPhotos(photosArray) {
  console.log('LOL', photosArray);
  photosArray.forEach(photo => {
    const photoHtml = `
    <a href="${photo.links.html}" class="images__image">
      <img src="${photo.urls.regular}" alt="${photo.alt_description ? photo.alt_description : 'Regular image'}" title="${photo.alt_description ? photo.alt_description : 'Regular image'}">
    </a>`;
    imagesView.insertAdjacentHTML('beforeend', photoHtml);
  });
};

getPhotos();