export function setTemperatureUnitLS(temperatureUnit = 'temp_c') {
  if (temperatureUnit !== 'temp_c' && temperatureUnit !== 'temp_f') {
    return;
  }
  localStorage.setItem('temperatureUnit', JSON.stringify(temperatureUnit));
}

export function getTemperatureUnitLS() {
  let unit = JSON.parse(localStorage.getItem('temperatureUnit'));
  if (unit === null) {
    unit = 'temp_c';
    setTemperatureUnitLS(unit);
  }
  return unit;
}

export function setPreviousLocationLS(location) {
  localStorage.setItem('previousLocation', JSON.stringify(location));
}

export function getPreviousLocationLS() {
  let location = JSON.parse(localStorage.getItem('previousLocation'));
  if (location === null) {
    location = 'texas';
    setPreviousLocationLS(location);
  }
  return location;
}
