'use strict';

const express=require('express');

require ('dotenv').config();


const server=express();

const cors =require('cors');

const PORT = process.env.PORT || 3500;

server.use(cors());


server.get('/data',(req,res)=>{
  res.send(`you are deploying on heroku ${PORT}`);
});

server.get('/location',(req,res)=>{
  let locationData= require('./data/location.json');
  let newLocation= new Location(locationData);
  res.send(newLocation);
});

function Location (locData){
  this.search_query='Seattle';
  this.formatted_query=locData[0].display_name;
  this.latitude=locData[0].lat;
  this.longitude=locData[0].lon;
}

server.get('/weather',(req,res)=>{
  let weatherData= require('./data/weather.json');
  let weatherArr= weatherData.data.map(value=>{
    return new Weather(value);
  });
  console.log(weatherArr);
  res.send(weatherArr);
});

function Weather(value){
  this.forecast=value.weather.description;
  this.time=value.valid_date;
}

server.get('*',(req,res)=>{
  let objectEr= {
    status:500,
    resText:'Sorry! Error 500 unexpected condition',
  };
  res.status(500).send(objectEr);
});

server.listen(PORT,()=>{
  console.log( `${PORT}`);
});
