var myApplication = myApplication || {};

myApplication.photoToAdd = 18;
myApplication.allPhotos = [];
myApplication.photoCnt = 0;

myApplication.DOMElements = {
  gridViewIcon: document.querySelector('.grid-view'),
  listViewIcon: document.querySelector('.list-view'),
  imagesView: document.querySelector('.images-view'),
  
  loader: document.querySelector('.loader-overlay'),
  bottomLine: document.querySelector('.bottom-of-container'),

  lightboxOverlay: document.querySelector('.lightbox-overlay'),
  lightboxATag: document.querySelector('.lightbox-overlay__img-arrows a'),
  lightboxImgTag: document.querySelector('.lightbox-overlay__img-arrows a img'),
  lightboxPhotoid: document.querySelector('.lightbox-overlay__photoId'),
  lightLeftArrow: document.querySelector('.lightbox__arrow--left'),
  lightRightArrow: document.querySelector('.lightbox__arrow--right'),
  lightboxClose: document.querySelector('.lightbox__close'),
}

myApplication.viewModes = {
  switchViewMode: function() {
    myApplication.DOMElements.gridViewIcon.classList.toggle('view--active')
    myApplication.DOMElements.listViewIcon.classList.toggle('view--active')
  
    myApplication.DOMElements.imagesView.classList.toggle('images-view--grid');
    myApplication.DOMElements.imagesView.classList.toggle('images-view--list');
  },
}

myApplication.loader = {
  startEndLoader: function() {
    myApplication.DOMElements.loader.classList.toggle('loader-overlay--active');
  },

};

myApplication.bottomLine = {
  updateBottomLine: function(viewHeight) {
    myApplication.DOMElements.bottomLine.style.bottom = `${viewHeight + 200}px`;
  },

};


myApplication.lightbox = {
  displayPhotoInLightbox: function(photoId) {
    if (photoId === -1) photoId = myApplication.photoCnt-1;
    else if (photoId === myApplication.photoCnt) photoId = 0;
  
    const photo = myApplication.allPhotos[photoId];
  
    myApplication.DOMElements.lightboxImgTag.src = photo[0];
    myApplication.DOMElements.lightboxImgTag.alt = photo[2];
    myApplication.DOMElements.lightboxATag.href = photo[1];
    myApplication.DOMElements.lightboxATag.dataset['id'] = photoId;
  
    myApplication.DOMElements.lightboxPhotoid.textContent = `${photoId+1}/${myApplication.photoCnt}`;
  },

  openCloseLightbox: function() {
    myApplication.DOMElements.lightboxOverlay.classList.toggle('lightbox-overlay--active');
    const photoId = this.dataset['id'];
  
    if (myApplication.DOMElements.lightboxOverlay.classList.contains('lightbox-overlay--active')) {
      myApplication.lightbox.displayPhotoInLightbox(Number(photoId));
    };
  },
}

myApplication.api = {
  getPhotos: async function() {

    myApplication.loader.startEndLoader();
    const response = await fetch(`https://api.unsplash.com/photos/random?count=${myApplication.photoToAdd}&client_id=LVTQ3W33_bo9qp9FRXvnNs3DZZj8Bo9ucA84Aww9jU4`);
    const photosArray = await response.json();
  
    myApplication.loader.startEndLoader();
    myApplication.displayPhotos(photosArray);
  },
}

myApplication.displayPhotos = function(photosArray) {
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
            <img data-id="${myApplication.photoCnt++}" class="image__img" src="${photo.urls.small}" alt="${photo.alt_description ? photo.alt_description : 'Regular image'}" title="${photo.alt_description ? photo.alt_description : 'Regular image'}">
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

      myApplication.allPhotos.push([photo.urls.regular, photo.links.html, photo.alt_description ? photo.alt_description : 'Regular image']);
    myApplication.DOMElements.imagesView.insertAdjacentHTML('beforeend', photoHtml);
  });

  myApplication.eventListeners.addLightBoxEffect();
};

myApplication.observer = new IntersectionObserver(entries => {
  const vh = entries[0].rootBounds.height;

  if (entries[0].boundingClientRect.y < 0) {
    console.log("WE HIT THE BOTTOM");
    myApplication.api.getPhotos();
    myApplication.bottomLine.updateBottomLine(vh);
  } else {
    console.log("NOT AT BOTTOM!!!");
  }
});

myApplication.eventListeners = {
  addEventsToViewIcons: function() {
    [myApplication.DOMElements.gridViewIcon, myApplication.DOMElements.listViewIcon].forEach(el => {
      el.addEventListener('click', myApplication.viewModes.switchViewMode);
    });
  },

  addLightBoxEvents: function() {
    myApplication.DOMElements.lightboxClose.addEventListener('click', myApplication.lightbox.openCloseLightbox);
    myApplication.DOMElements.lightLeftArrow.addEventListener('click', () => {
      myApplication.lightbox.displayPhotoInLightbox(Number(myApplication.DOMElements.lightboxATag.dataset['id'])-1);
    });
    myApplication.DOMElements.lightRightArrow.addEventListener('click', () => {
      myApplication.lightbox.displayPhotoInLightbox(Number(myApplication.DOMElements.lightboxATag.dataset['id'])+1);
    });
  },

  addLightBoxEffect: function() {
    const imagesArray = []
    for (let i = 1; i <= myApplication.photoToAdd; i++) {
      document.querySelector(`.image__img[data-id='${myApplication.photoCnt-i}']`).addEventListener('click', myApplication.lightbox.openCloseLightbox);
    };
  }
};

myApplication.eventListeners.addEventsToViewIcons();
myApplication.eventListeners.addLightBoxEvents();
myApplication.observer.observe(document.querySelector(".bottom-of-container"));
console.log('PPPP', myApplication)