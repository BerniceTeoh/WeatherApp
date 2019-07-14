const express = require('express');
//const Datastore = require('nedb');
const mysql = require ('mysql');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting server at ${port}`)
});
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

// const database = new Datastore('database.db');
// database.loadDatabase();

//`mysql://be78cefa4379c9:1b7ccf5a@us-cdbr-iron-east-02.cleardb.net/heroku_6aaf42af3272176?reconnect=true`;

const db = mysql.createConnection({
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'be78cefa4379c9',
    password: '1b7ccf5a',
    database: 'heroku_6aaf42af3272176'
});

db.connect((err) => {
    if(!err){
        console.log('Mysql Connected...');
    }else{
        console.log('not connected')
    };    
});

//create database table
// app.get('/createtable', (req, res) => {
//     let sql = 'CREATE TABLE location (city VARCHAR(255), longitude VARCHAR(255), latitude VARCHAR(255), summary VARCHAR(255), temperature VARCHAR(255), humidity VARCHAR(255), windSpeed VARCHAR(255), cloudCover VARCHAR(255) )';
//     db.query(sql, (err,result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Table created');
//     });   
// });

//API 1..
app.get('/location/:city', async (request, response) => {
    //console.log(request.params);
    const city = request.params.city;
    //console.log(city);
    const location_url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=88b5040ac450b0a898e2387e7fee7faf`;
    const location_response = await fetch(location_url);
    const location = await location_response.json();
    response.json(location);
});

//API 2..
app.get('/weather/:latitudelongitude', async (request, response) => {
    console.log(request.params);
    const latitudelongitude = request.params.latitudelongitude.split(',');
    console.log(latitudelongitude);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const weather_url = `https://api.darksky.net/forecast/1d4194e26f8d8a430355588136580373/${lat},${lon}`;
    const weather_response = await fetch(weather_url);
    const weather = await weather_response.json();
    response.json(weather);
});

//get out data
app.get('/api', (request, response) => {
    db.query('SELECT * FROM location', (err,data) => {
        if(err) throw err;
        response.json(data);
    })
});

//delete data
app.get('/delete/:city', (request, response) => {
    //const city = request.params.item.city
    db.query('DELETE FROM location WHERE city=?',[request.params.city] ,(err,data) => {
        if(err){ 
            throw err;
        }else{
            console.log(data);
        }
    })
});

//insert database
app.post('/api', (request, response) =>{
    const data = request.body;
    let location = data;
    let sql = "INSERT INTO location SET ?";
    let query = db.query(sql, location, (err,result) => {
        if(err) throw err;
        console.log(result);
    })
});

// //update database
// app.post('/api', (request, response) =>{
//     const data = request.body;
//     let location = data;
//     let sql = "INSERT INTO location SET ?";
//     let query = db.query(sql, location, (err,result) => {
//         if(err) throw err;
//         console.log(result);
//     })
// });