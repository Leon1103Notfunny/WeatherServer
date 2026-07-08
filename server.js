const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Wstaw tutaj swój klucz API z OpenWeather
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather.action", async (req, res) => {
    try {
        const lat = 54.5189;
        const lon = 18.5305;

        if (!lat || !lon) {
            return res.status(400).json({
                error: "Brak parametrów lat lub lng"
            });
        }

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: API_KEY,
                    units: "metric",
                    lang: "pl"
                }
            }
        );

        const w = response.data;

        const sunrise = new Date(w.sys.sunrise * 1000);
        const sunset = new Date(w.sys.sunset * 1000);

        res.json({
            weather: w.weather[0].description,
            temperature: Math.round(w.main.temp).toString(),
            weatherIcon: w.weather[0].icon,
            cityName: w.name,
            mnSunriseTime: sunrise.getHours() * 100 + sunrise.getMinutes(),
            mnSunsetTime: sunset.getHours() * 100 + sunset.getMinutes()
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Weather Server działa na porcie " + PORT);
});