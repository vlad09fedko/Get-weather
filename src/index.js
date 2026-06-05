'use strict';

const API_KEY = '09a3c4c45fbe46453b0a970485b97374';
const form = document.querySelector('form');
const textInputs = document.querySelectorAll('input[type=text]');
const radioInputs = document.querySelectorAll('input[type=radio]');
const infoFields = document.querySelectorAll('.info');

function getWeather(e) {
  e.preventDefault();
  let url = 'https://api.openweathermap.org/data/2.5/weather?';
  if (!textInputs[0].hasAttribute('disabled')) {
    const cityName = textInputs[0].value;
    url += `q=${cityName}&appid=${API_KEY}&units=metric`;
  } else if (!textInputs[1].hasAttribute('disabled')) {
    const cityId = textInputs[1].value;
    url += `id=${cityId}&appid=${API_KEY}&units=metric`;
  }
  fetch(url)
    .then(res => res.json())
    .then(({ main: { temp, humidity }, wind: { speed } }) => {
      infoFields.forEach(field => {
        if (field.id === 'temperature') {
          field.textContent = temp;
        }
        if (field.id === 'wind-speed') {
          field.textContent = speed;
        }
        if (field.id === 'humidity') {
          field.textContent = humidity;
        }
      });
    })
    .catch(err => {
      infoFields.forEach(field => {
        field.textContent = 'Error';
      });
      console.log(err.message);
    });
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
