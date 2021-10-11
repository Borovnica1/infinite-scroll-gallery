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

function removeLoader() {
  loader.classList.toggle('loader-overlay--active');
};

setTimeout(removeLoader, 2000);