import './css/styles.css';
import getRefs from './refs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = getRefs();

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();

  const { value } = e.target;

  const countrySearch = value.trim();

  if (!countrySearch) {
    clearList();
    addHidden();
    return;
  }

  fetchCountries(`${countrySearch}`)
    .then(country => {
      if (country.length > 10) {
        Notify.failure(
          '"Too many matches found. Please enter a more specific name."'
        );
      }
      renderCounry(country);
    })
    .catch(() => {
      onFetchError();
    });
}

function onFetchError() {
  Notify.failure('"Oops, there is no country with that name"');
}

function renderCounry(value) {
  if (value.length === 1) {
    refs.countryList.innerHTML = '';
    refs.countryList.style.visibility = 'hidden';
    refs.countryInfo.style.visibility = 'visible';
    countryMarkup(value);
  }

  if (value.length >= 2 && value.length <= 10) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.style.visibility = 'visible';
    refs.countryInfo.style.visibility = 'hidden';
    listCountryMarkup(value);
  }
}

function addHidden() {
  refs.countryInfo.style.visibility = 'hidden';
  refs.countryList.style.visibility = 'hidden';
}
function clearList() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function countryMarkup(country) {
  const markup = country
    .map(({ flags, name, capital, population, languages }) => {
      return `  
<div class='container'>
<img class="flag" src="${flags.svg}" alt="${name.official}">
<h1 class="country">${name.official}</h1>
</div>
<p class="text">Capital: ${capital}</p>
<p class="text">Population: ${population}</p>
<p class="text">Languages: ${Object.values(languages).join(', ')}</p>
  `;
    })
    .join('');

  refs.countryInfo.innerHTML = markup;
  return markup;
}

function listCountryMarkup(country) {
  const markup = country
    .map(({ flags, name }) => {
      return `
    <li class="list">
<img class="flag" src="${flags.svg}" alt="${name.official}" >
<h1 class="country">${name.official}</h1>
</li>
    `;
    })
    .join('');

  refs.countryList.innerHTML = markup;
  return markup;
}
