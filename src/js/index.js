import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchData } from './fetchData';
import { markupPicturiesList } from './markup';
import { PER_PAGE } from './fetchData';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const lightBox = new SimpleLightbox('.gallery-item', {
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let searchImage = '';
let totalPages = 1;

refs.loadMore.style.visibility = 'hidden';

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  clearAll();
  currentPage = 1;

  if (e.currentTarget.elements.searchQuery.value.trim() === '') {
    return;
  }

  searchImage = e.currentTarget.elements.searchQuery.value.trim().toLowerCase();

  fetchData(searchImage, currentPage)
    .then(respData => {
      if (respData.data.totalHits === 0) {
        return Notify.failure('Oops, there is no images with that name');
      }
      totalPages = Math.ceil(respData.data.totalHits / PER_PAGE);

      parseData(respData);
      refs.loadMore.style.visibility = 'visible';
    })
    .catch(() => {
      Notify.failure('Oops, there is no images with that name!!!');
    });
}

function parseData(respData) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    respData.data.hits.map(markupPicturiesList).join('')
  );
  lightBox.refresh();
}

function onLoadMore() {
  currentPage += 1;

  if (currentPage >= totalPages) {
    currentPage = totalPages;
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMore.style.visibility = 'hidden';
  }

  fetchData(searchImage, currentPage)
    .then(respData => {
      Notify.success(
        `Hooray! We found ${respData.data.hits.length} more images.`
      );
      parseData(respData);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    })
    .catch(() => {
      Notify.failure('Oops, there is no images with that name');
    });
}

function clearAll() {
  refs.gallery.innerHTML = '';
  refs.loadMore.style.visibility = 'hidden';
}

export { PER_PAGE };
