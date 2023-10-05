import searchIconSVG from '../images/search-icon.svg';
import { getPreviousLocationLS, getTemperatureUnitLS, setTemperatureUnitLS } from './localStorage';
import { changeTemperatureUnit, changeWeatherDisplayData } from './weatherDisplayDOM';

export default function addEventListeners() {
  const searchIcon = document.querySelector('.search-icon');
  searchIcon.src = searchIconSVG;
  const searchInput = document.querySelector('.search-input');
  searchIcon.addEventListener('click', () => {
    changeWeatherDisplayData(searchInput.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      changeWeatherDisplayData(searchInput.value);
    }
  });

  const toggleDegrees = document.querySelector('.toggle-degrees');
  toggleDegrees.addEventListener('click', (e) => {
    const clickedElement = e.target;

    // do nothing if degree element is already active
    if ((clickedElement.classList.contains('C') || clickedElement.classList.contains('F')) && clickedElement.classList.contains('active')) {
      return;
    }

    if (clickedElement.classList.contains('C')) {
      changeTemperatureUnit('temp_c');
      setTemperatureUnitLS('temp_c');
      clickedElement.classList.add('active');
      clickedElement.parentElement.querySelector('.F').classList.remove('active');
    } else if (clickedElement.classList.contains('F')) {
      changeTemperatureUnit('temp_f');
      setTemperatureUnitLS('temp_f');
      clickedElement.classList.add('active');
      clickedElement.parentElement.querySelector('.C').classList.remove('active');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    initializeDegreesToggle();
    changeWeatherDisplayData(getPreviousLocationLS());
  });
}

function initializeDegreesToggle() {
  const temperatureUnit = getTemperatureUnitLS();
  const toggleDegrees = document.querySelector('.toggle-degrees');
  if (temperatureUnit === 'temp_c') {
    const toggleDegreesC = toggleDegrees.querySelector('.C');
    toggleDegreesC.classList.add('active');
  } else if (temperatureUnit === 'temp_f') {
    const toggleDegreesF = toggleDegrees.querySelector('.F');
    toggleDegreesF.classList.add('active');
  }
}
