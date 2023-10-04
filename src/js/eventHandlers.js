import searchIconSVG from '../images/search-icon.svg';
import { changeWeatherDisplayData } from './weatherDisplayDOM';

export default function addEventListeners() {
  const searchIcon = document.querySelector('.search-icon');
  searchIcon.src = searchIconSVG;

  searchIcon.addEventListener('click', changeWeatherDisplayData);

  const searchInput = document.querySelector('.search-input');

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      changeWeatherDisplayData();
    }
  });
}
