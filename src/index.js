import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '29781225-270ed18ae1ae383a725fedf91';
const BASIC_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const searchFields = '&image_type=photo&orientation=horizontal&safesearch=true';

const imgBox = document.querySelector('.gallery');
const refs = {
  forM: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  subMitBtn: document.querySelector('#submit'),
  input: document.querySelector('input'),
};

refs.forM.addEventListener('submit', formSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.input.addEventListener('input', submitButton);
refs.loadMoreBtn = true;
let total = 1;

class GetImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.newQuery = '';
  }
  async getImg() {
    refs.subMitBtn.disabled = true;
    const serverDataURL = `${BASIC_URL}${this.searchQuery}${searchFields}&page=${this.page}&per_page=21`;
    try {
      const server = await axios.get(serverDataURL);
      const data = await server.data;

      return data;
    } catch (error) {}
  }

  resetP() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrPage() {
    this.page += 1;
  }
}

const newImgServ = new GetImages();

function formSubmit(e) {
  refs.loadMoreBtn.disabled = true;
  e.preventDefault();
  const { searchQuery } = e.currentTarget;
  newImgServ.query = searchQuery.value;
  newImgServ.resetP();
  newImgServ.getImg().then(data => renderImgC(data.hits));
}

function onLoadMore() {
  newImgServ.incrPage();
  newImgServ.getImg().then(data => renderImgC(data.hits));
}
function submitButton(e) {
  if (e.currentTarget.value) {
    refs.subMitBtn.disabled = false;
  }
}

async function renderImgC(img) {
  refs.loadMoreBtn.disabled = false;
  const data = await newImgServ.getImg();
  const allHits = data.hits.length;
  const maxHits = data.totalH;

  if (img.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMoreBtn.disabled = true;
  }
  const markup = img
    .map(img => {
      total += 1;

      return `

      <div class="photo-card">
   <a href="${img.largeImageURL}">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"  class="gallery__image" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes </b><span>${img.likes}</span>
      </p>
      <p class="info-item">
        <b>Views </b><span>${img.views}</span>
      </p>
      <p class="info-item">
        <b>Comments </b><span>${img.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads </b><span>${img.downloads}</span>
      </p>
    </div>
  </div>`;
    })
    .join('');
  total -= 1;
  if (total < 21) {
    refs.loadMoreBtn.disabled = true;
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  notification(total, maxHits);
  total = 1;
  if (newImgServ.page === 1) {
    imgBox.innerHTML = markup;
  }
  if (newImgServ.page !== 1) {
    imgBox.insertAdjacentHTML('beforeend', markup);
  }
  modListener();
}
function modListener() {
  let galleryLarge = new SimpleLightbox('.photo-card a');
  imgBox.addEventListener('click', e => {
    e.preventDefault();
    galleryLarge.on('show.simplelightbox', () => {
      galleryLarge.defaultOptions.captionDelay = 250;
    });
  });
  galleryLarge.refresh();
}

function notification(totalImg, totalHits) {
  if (newImgServ.page > 1 && totalImg === 21) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
