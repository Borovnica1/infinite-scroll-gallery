const gridViewIcon = document.querySelector('.grid-view');
const listViewIcon = document.querySelector('.list-view');
const imagesView = document.querySelector('.images-view');

const loader = document.querySelector('.loader-overlay');
const bottomLine = document.querySelector('.bottom-of-container');

const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxATag = document.querySelector('.lightbox-overlay__img-arrows a');
const lightboxImgTag = document.querySelector('.lightbox-overlay__img-arrows a img');
const lightboxPhotoid = document.querySelector('.lightbox-overlay__photoId');
const lightLeftArrow = document.querySelector('.lightbox__arrow--left');
const lightRightArrow = document.querySelector('.lightbox__arrow--right');
const lightboxClose = document.querySelector('.lightbox__close');

const photoToAdd = 18;
const allPhotos = [];
let photoCnt = 0;

function switchViewMode() {
  gridViewIcon.classList.toggle('view--active')
  listViewIcon.classList.toggle('view--active')

  imagesView.classList.toggle('images-view--grid');
  imagesView.classList.toggle('images-view--list');
};

function startEndLoader() {
  loader.classList.toggle('loader-overlay--active');
};

function updateBottomLine(viewHeight) {
  bottomLine.style.bottom = `${viewHeight + 200}px`;
};

function displayPhotoInLightbox(photoId) {
  if (photoId === -1) photoId = photoCnt-1;
  else if (photoId === photoCnt) photoId = 0;

  const photo = allPhotos[photoId];

  lightboxImgTag.src = photo[0];
  lightboxImgTag.alt = photo[2];
  lightboxATag.href = photo[1];
  lightboxATag.dataset['id'] = photoId;

  lightboxPhotoid.textContent = `${photoId+1}/${photoCnt}`;
};

function openCloseLightbox() {
  lightboxOverlay.classList.toggle('lightbox-overlay--active');
  const photoId = this.dataset['id'];

  if (lightboxOverlay.classList.contains('lightbox-overlay--active')) {
    displayPhotoInLightbox(Number(photoId));
  };
};



async function getPhotos() {
  // while loop to prevent calling function while it is still loading
  //
  //
  //
  startEndLoader();
  const response = await fetch(`https://api.unsplash.com/photos/random?count=${photoToAdd}&client_id=LVTQ3W33_bo9qp9FRXvnNs3DZZj8Bo9ucA84Aww9jU4`);
  const photosArray = await response.json();

  startEndLoader();
  displayPhotos(photosArray);
};

function displayPhotos(photosArray) {

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
            <img data-id="${photoCnt++}" class="image__img" src="${photo.urls.small}" alt="${photo.alt_description ? photo.alt_description : 'Regular image'}" title="${photo.alt_description ? photo.alt_description : 'Regular image'}">
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

    allPhotos.push([photo.urls.regular, photo.links.html, photo.alt_description ? photo.alt_description : 'Regular image']);
    imagesView.insertAdjacentHTML('beforeend', photoHtml);
  });

  addLightBoxEffect();
};

function addLightBoxEffect() {
  const imagesArray = []
  for (let i = 1; i <= photoToAdd; i++) {
    document.querySelector(`.image__img[data-id='${photoCnt-i}']`).addEventListener('click', openCloseLightbox);
  };
};

[gridViewIcon, listViewIcon].forEach(el => {
  el.addEventListener('click', switchViewMode);
});

let observer = new IntersectionObserver(entries => {
  const vh = entries[0].rootBounds.height;

  if (entries[0].boundingClientRect.y < 0) {
    console.log("WE HIT THE BOTTOM");
    getPhotos();
    updateBottomLine(vh);
  } else {
    console.log("NOT AT BOTTOM!!!");
  }
});

lightboxClose.addEventListener('click', openCloseLightbox);
lightLeftArrow.addEventListener('click', () => {
  displayPhotoInLightbox(Number(lightboxATag.dataset['id'])-1);
});
lightRightArrow.addEventListener('click', () => {
  displayPhotoInLightbox(Number(lightboxATag.dataset['id'])+1);
});
observer.observe(document.querySelector(".bottom-of-container"));
