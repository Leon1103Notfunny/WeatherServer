const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Klucz API z Render Environment Variables
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather.action", async (req, res) => {
    try {
        // Pobierz współrzędne z aplikacji
        const lat = req.query.lat || 54.5189;
        const lon = req.query.lng || 18.5305;

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

        // Mapowanie ikon OpenWeather -> kody AccuWeather
        const iconMap = {
            "01d": "1",
            "01n": "33",
            "02d": "6",
            "02n": "35",
            "03d": "7",
            "03n": "36",
            "04d": "8",
            "04n": "8",
            "09d": "12",
            "09n": "12",
            "10d": "13",
            "10n": "13",
            "11d": "15",
            "11n": "15",
            "13d": "19",
            "13n": "19",
            "50d": "11",
            "50n": "11"
        };

        // Normalne mapowanie
        const mappedCode = iconMap[w.weather[0].icon] || "8";

        // TEST: wymuś śnieg
        const weatherCode = "19";

        const sunrise = new Date(w.sys.sunrise * 1000);
        const sunset = new Date(w.sys.sunset * 1000);

        res.json({
            weather: "TEST SNOW",
            temperature: Math.round(w.main.temp).toString(),
            weatherIcon: weatherCode,
            cityName: w.name,
            mnSunriseTime: sunrise.getHours() * 100 + sunrise.getMinutes(),
            mnSunsetTime: sunset.getHours() * 100 + sunset.getMinutes()
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log("Weather Server działa na porcie " + PORT);
});
