import './App.css';
import React from 'react';
import axios from 'axios';
import countryCodesToName from './countryCodes';

/*
TODO:
- change logo
- refactor code
*/

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: true, prevCity: "Dublin City", currCity: "Dublin City", searchInput: "", error: "" }
    }
    getData = () => {
        const CURRENT_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" + this.state.currCity +
            "&units=metric" + "&appid=" + "a95c3abfb70fa168ec48a0a6019fb13f";

        // get current weather and coordinates of city
        axios.get(CURRENT_WEATHER_API_URL)
            .then(res => {
                const currentWeatherData = res.data
                //console.log("currentWeatherData", currentWeatherData)
                this.setState({ currentWeatherData, currCity: currentWeatherData.name, country: currentWeatherData["sys"].country })
                this.setState({ prevCity: this.state.currCity })

                const ONE_CALL_WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/onecall?" +
                    "lat=" + currentWeatherData["coord"].lat +
                    "&lon=" + currentWeatherData["coord"].lon +
                    "&exclude=current,minutely,hourly" + "&units=metric" + "&appid=" + "a95c3abfb70fa168ec48a0a6019fb13f";

                // get the weekly forecast
                axios.get(ONE_CALL_WEATHER_API_URL)
                    .then(res => {
                        const weeklyWeatherData = res.data
                        //console.log("weeklyWeatherData:", weeklyWeatherData)
                        this.setState({ weeklyWeatherData, loading: false })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    currCity: this.state.prevCity,
                    error: "city not found"
                })
            })
    }
    componentWillMount() {
        this.getData()
    }
    weatherIdToBackgroundImage = (id) => {
        let backgroundImage = ""
        if (id >= 200 && id < 300) {
            backgroundImage = "thunderstorm"
        }
        else if (id >= 300 && id < 600) {
            backgroundImage = "rain"
        }
        else if (id >= 600 && id < 700) {
            backgroundImage = "snow"
        }
        else if (id === 701 || id === 711 || id === 721 || id === 741) {
            backgroundImage = "fog"
        }
        else if (id === 800) {
            backgroundImage = "clear-sky"
        }
        else if (id === 801) {
            backgroundImage = "few-clouds"
        }
        else if (id === 802) {
            backgroundImage = "scattered-clouds"
        }
        else if (id === 803) {
            backgroundImage = "broken-clouds"
        }
        else if (id === 804) {
            backgroundImage = "overcast-clouds"
        }
        else {
            backgroundImage = ""
        }
        return backgroundImage
    }
    search = (e) => {
        e.preventDefault()
        this.setState({
            currCity: this.state.searchInput
        }, () => {
            this.getData()
        })
    }
    render() {
        if (this.state.loading) {
            return null
        }
        const currentWeatherData = this.state.currentWeatherData
        //console.log("state", this.state)
        //console.log("currentWeatherData", currentWeatherData)

        const currentWind = Math.round(currentWeatherData.wind.speed)
        const currentTemperature = Math.round(currentWeatherData["main"].temp)
        const currentHumidity = Math.round(currentWeatherData["main"].humidity)
        const icon = currentWeatherData["weather"][0].icon

        const backgroundImage = this.weatherIdToBackgroundImage(currentWeatherData["weather"][0].id)

        const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const months = ["January"]

        const date = new Date();
        const currentDate = date.toLocaleDateString('default', { day: 'numeric' });
        const currentMonth = date.toLocaleDateString('default', { month: 'long' })
        console.log(currentDate, ",", currentMonth)

        const today = new Date().getDay()
        //const currentDate = new Date.getDate()
        console.log("today", today)

        const nextWeeksWeather = this.state.weeklyWeatherData["daily"].slice(1)

        const weatherWeekBoxes = nextWeeksWeather.map((data, index) =>
            <div className="weather-week-box center">
                <p>{ week[(today + index + 1) % 7] }</p>
                {console.log("week:", (today + index) % 7)}
                <img src={`http://openweathermap.org/img/wn/${ data.weather[0].icon }@2x.png`} alt="" />
                <p>
                    <strong>{ Math.round(data.temp.day) }°C &nbsp;</strong>
                    { Math.round(data.temp.night) }°C
                </p>
            </div>
        )
        return (
            <div className="App" style={{ backgroundImage: `url("images/backgrounds/${backgroundImage}.jpg")` }}>
                <section className="top center">
                    <nav className="navbar">
                        <form className="search-bar-form">
                            <input value={this.state.searchInput}
                                onChange={e => { this.setState({ searchInput: e.target.value }) }} />
                            <button onClick={e => { this.search(e) }}>
                                <img src="/images/search-icon.png" alt="" />
                            </button>
                        </form>
                    </nav>
                </section>
                <section className="bottom">
                    <div className="left">
                        <div className="weather-today-box center">
                            <h1>{this.state.currCity}, {countryCodesToName[this.state.country]}</h1>
                            <h3 id="current-day">{week[today]}, {currentDate} {currentMonth}</h3>
                            <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} id="current-weather-icon" alt="" />
                            <h2 id="current-temperature">{currentTemperature}°C</h2>
                            <div className="weather-today-info-box">
                                <div className="info-box center">
                                    <h2>wind</h2>
                                    <p id="current-wind">{currentWind} km/h</p>
                                </div>
                                <div className="info-box center">
                                    <h2>description</h2>
                                    <p id="current-precipitation">{currentWeatherData["weather"][0].description}</p>
                                </div>
                                <div className="info-box center">
                                    <h2>humidity</h2>
                                    <p id="current-wind">{currentHumidity}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="weather-week-container">
                            {weatherWeekBoxes}
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default App;
