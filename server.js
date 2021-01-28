const express = require('express')
const request = require('request')
const axios = require('axios')
const path = require('path')
const app = express()

const PORT = 4000

app.listen(PORT, () => {
    console.log(`App listening at ${PORT}`)
})

//app.set('view engine', 'ejs')


const API = "https://api.openweathermap.org/data/2.5/weather?q=" + "Dublin City" + "&units=metric" + "&appid=" + "a95c3abfb70fa168ec48a0a6019fb13f";

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    console.log("get /")
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

request(API, function(error, response, body) {
    if(error || response.statusCode !== 200){
        console.log("error:", error)
    } else {
        const data = JSON.parse(body)
        console.log("data:", data)
    }
})