// import { Application } from '@splinetool/runtime';

// const canvas = document.getElementById('canvas3d');
// const app = new Application(canvas);
// app.load('https://prod.spline.design/vDa7fX1MJT13xu-H/scene.splinecode');

// -------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "f461aba62594513ce4f35378bcd3661a"; // Use your actual API key
    const weatherForm = document.getElementById("weather-form");
    const cityInput = document.getElementById("city-input");
    const weatherInfo = document.getElementById("weather-info"); // Ensure this ID exists in your HTML

    // When the form is submitted
    weatherForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents page reload
        const city = cityInput.value.trim();
        
        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        fetchWeather(city);
    });

    // Function to fetch weather data
    async function fetchWeather(city) {
        console.log("Fetching weather for:", city);

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();
            console.log("API Response:", data);

            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            displayWeather(data);
        } catch (error) {
            console.error("Error fetching weather:", error);
            weatherInfo.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        }
    }

    // Function to display weather data
    function displayWeather(data) {
        const cityName = data.name;
        const country = data.sys.country;
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        weatherInfo.innerHTML = `
            <h2>Weather in ${cityName}, ${country}</h2>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            <p><strong>Condition:</strong> ${weatherDescription}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
        `;
    }
});
document.getElementById("makeTripBtn").addEventListener("click", function () {
    window.open("trip.html", "_blank"); // Opens trip.html in a new tab
});
