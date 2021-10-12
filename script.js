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

function startEndLoader() {
  loader.classList.toggle('loader-overlay--active');
};

async function getPhotos() {
  // while loop to prevent calling function while it is still loading
  //
  //
  //
  startEndLoader();
  const response = await fetch('https://api.unsplash.com/photos/random?count=6&client_id=LVTQ3W33_bo9qp9FRXvnNs3DZZj8Bo9ucA84Aww9jU4');
  const photosArray = await response.json();

  startEndLoader();
  displayPhotos(photosArray);
};

function displayPhotos(photosArray) {
  console.log('LOL', photosArray);
  photosArray.forEach(photo => {
    let socialHtml = '';
    [photo.user.social.instagram_username,photo.user.social.paypal_email, photo.user.social.twitter_username].forEach((link, index) => {
      if (link) {
        switch (index) {
          case 0: socialHtml += `<a href="https://twitter.com/${link}"><ion-icon name="logo-twitter"></ion-icon></a>`
            break;
          case 1: socialHtml += `<a href="mailto:${link}"><ion-icon name="logo-paypal"></ion-icon></a>`
            break;
          case 2: socialHtml += `<a href="https://instagram.com/${link}"><ion-icon name="logo-instagram"></ion-icon></a>`
            break;
        }
      }
    });

    const photoHtml = `
    <div class="image">
        <div class="image__img-likes-downloads">
          <a href="${photo.links.html}" class="image__img">
            <img src="${photo.urls.regular}" alt="${photo.alt_description ? photo.alt_description : 'Regular image'}" title="${photo.alt_description ? photo.alt_description : 'Regular image'}">
          </a>
          <div class="image__likes-downloads">
            <h5><ion-icon name="heart"></ion-icon>Likes: <span class="image__likes">${photo.likes}</span></h5>
            <h5><ion-icon name="cloud-download-outline"></ion-icon>Downloads: <span class="image__downloads">${photo.downloads}</span></h5>
          </div>
        </div>

        <div class="image__users-profile">
          <div class="image__user">
            <a href="${photo.user.links.html}" class="image__profile-avatar"><img src="${photo.user.profile_image.large}" alt="avatar image"></a>
            <div class="image__username-portfolio">
              <a href="${photo.user.links.html}"><h5 class="image__username">${photo.user.username}</h5></a>
              <a href="${photo.user.portfolio_url}" class="${photo.user.portfolio_url ? '' : 'not-avail'}"><h5 class="image__portfolio">${photo.user.portfolio_url ? photo.user.portfolio_url : 'Not Available'}</h5></a>
              <div class="image__social">
                  ${socialHtml}
              </div>
            </div>
          </div>
          <p class="image__user-bio ${photo.user.bio ? '' : 'not-avail'}">${photo.user.bio ? photo.user.bio : 'Bio not available'}</p>
        </div>
      </div>`;
    imagesView.insertAdjacentHTML('beforeend', photoHtml);
  });
};

[gridViewIcon, listViewIcon].forEach(el => {
  el.addEventListener('click', switchViewMode);
});

getPhotos();