'use strict';

const form = document.querySelector('form');
const textInputs = document.querySelectorAll('input[type=text]');
const radioInputs = document.querySelectorAll('input[type=radio]');
const infoFields = document.querySelectorAll('.info');

async function getWeather(e) {
  function doUrl() {
    if (!textInputs[0].value.trim() && !textInputs[1].value.trim()) {
      throw new Error('Void! One of the fields must be filled in!');
    }

    const API_KEY = '09a3c4c45fbe46453b0a970485b97374';
    let data;

    if (!textInputs[0].hasAttribute('disabled')) {
      const cityName = textInputs[0].value.trim();
      data = `q=${cityName}`;
    } else if (!textInputs[1].hasAttribute('disabled')) {
      const cityId = textInputs[1].value.trim();
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
      errText = 'Void field';
    }
    infoFields.forEach(field => {
      field.classList.add('error-text');
      field.textContent = errText;
    });
    console.log(err.message);
  }
}

function updateInputs() {
  textInputs.forEach(input => {
    input.toggleAttribute('disabled');
    input.classList.toggle('disabled');
  });
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
