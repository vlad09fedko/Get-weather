'use strict';

const form = document.querySelector('form');
const cityNameInput = document.querySelector('#city-name');
const cityIdInput = document.querySelector('#city-id');
const radioInputs = document.querySelectorAll('input[type=radio]');
const infoFields = document.querySelectorAll('.info');

function doUrl() {
  if (!cityNameInput.value.trim() && !cityIdInput.value.trim()) {
    throw new Error('Void! One of the fields must be filled in!');
  }

  const API_KEY = '09a3c4c45fbe46453b0a970485b97374';
  let data;

  if (!cityNameInput.hasAttribute('disabled')) {
    const cityName = cityNameInput.value.trim();
    data = `q=${cityName}`;
  } else if (!cityIdInput.hasAttribute('disabled')) {
    const cityId = cityIdInput.value.trim();
    data = `id=${cityId}`;
  }

  return `https://api.openweathermap.org/data/2.5/weather?${data}&appid=${API_KEY}&units=metric`;
}

async function getData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res;
}

function fillOutFields(temp, windSpeed, humidity) {
  infoFields.forEach(field => {
    field.classList.remove('error-text');
    if (field.id === 'temp') {
      field.textContent = `${temp}° C`;
    }
    if (field.id === 'wind-speed') {
      field.textContent = `${windSpeed} m/s`;
    }
    if (field.id === 'humidity') {
      field.textContent = `${humidity}%`;
    }
  });
}

function updateInputs() {
  function toggleInput(inp) {
    inp.toggleAttribute('disabled');
    inp.classList.toggle('disabled');
  }

  toggleInput(cityNameInput);
  toggleInput(cityIdInput);
}

async function getWeather(e) {
  try {
    e.preventDefault();
    const url = doUrl();
    const res = await getData(url);
    const {
      main: { temp, humidity },
      wind: { speed: windSpeed },
    } = await res.json();
    fillOutFields(temp, windSpeed, humidity);
  } catch (err) {
    let errText;
    errText = err.message;
    if (/Void/.test(err.message)) {
      errText = 'Void';
    }
    infoFields.forEach(field => {
      field.classList.add('error-text');
      field.textContent = errText;
    });
    console.error(err.message);
  }
}

radioInputs.forEach(radioInput => {
  radioInput.addEventListener('change', updateInputs);
});

form.addEventListener('reset', () => {
  infoFields.forEach(field => {
    field.textContent = '';
  });
  if (radioInputs[1].checked) {
    updateInputs();
  }
});

document.addEventListener('submit', getWeather);
