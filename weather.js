const apiKey = "0253bf222121437f81863036252707"; 

const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('weatherResult');
const suggestionsDiv = document.getElementById('suggestions');
let debounceTimeout;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

cityInput.addEventListener('input', function() {
  const query = cityInput.value.trim();
  clearTimeout(debounceTimeout);
  if (query.length < 2) {
    suggestionsDiv.style.display = 'none';
    return;
  }
  debounceTimeout = setTimeout(() => {
    fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        suggestionsDiv.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${city.name}, ${city.country}`;
            item.onclick = () => {
              cityInput.value = `${city.name}, ${city.country}`;
              suggestionsDiv.style.display = 'none';
            };
            suggestionsDiv.appendChild(item);
          });
          suggestionsDiv.style.display = 'block';
        } else {
          suggestionsDiv.style.display = 'none';
        }
      });
  }, 300);
});

document.addEventListener('click', function(e) {
  if (!suggestionsDiv.contains(e.target) && e.target !== cityInput) {
    suggestionsDiv.style.display = 'none';
  }
});

function getWeather(city) {
  resultDiv.textContent = "Loading...";
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      const weather = data.current.condition.text;
      const temp = data.current.temp_c;
      const feelsLike = data.current.feelslike_c;
      const humidity = data.current.humidity;
      resultDiv.innerHTML = `
        <strong>${data.location.name}, ${data.location.country}</strong><br>
        Weather: ${weather}<br>
        Temperature: ${temp}°C<br>
        Feels like: ${feelsLike}°C<br>
        Humidity: ${humidity}%
      `;
    })
    .catch(err => {
      resultDiv.textContent = err.message;
    });
}
