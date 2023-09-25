const express = require('express'),
    axios = require('axios').default,
    hbs = require('hbs'),
    app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

hbs.registerHelper('getIcon', dt => {
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNum = new Date(dt * 1000).getDay();
    return days[dayNum];
});

hbs.registerHelper('tempTrunc', temp => Math.trunc(temp));
hbs.registerHelper('capitalize', str => str.charAt(0).toUpperCase() + str.slice(1));

app.get('/', (req, res) => {
    res.render('currentWeather');
});

app.post('/', async (req, res) => {
    const { country, city } = req.body;
    try {
        if (!req.body.country) {
            throw new SyntaxError("Incomplete data: no country");
        } else if (!req.body.city) {
            throw new SyntaxError("Incomplete data: no city");
        }
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=e61a9c6b0e3451203d943d59f8a57b8d`);
        res.render('currentWeather', { data: response.data });
    } catch (err) {
        if (err instanceof SyntaxError) {
            res.render('error', { error: err.message });
        } else {
            res.render('error', { error: err.response.data.message });
        }
    }
});

app.get('/manchester', async (req, res) => {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=53.48&lon=2.24&exclude=hourly,current,%20minutely&%20&units=metric&appid=e61a9c6b0e3451203d943d59f8a57b8d');
    res.render('manchester', { data: response.data });
});

app.get('*', (get, res) => {
    res.send("Page not found");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000...");
});