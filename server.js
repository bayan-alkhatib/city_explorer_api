'use strict';

const express=require('express');
require ('dotenv').config();
const cors =require('cors');
const superAgent=require('superagent');


const server=express();
const PORT = process.env.PORT || 3500;
server.use(cors());



server.get('/location',locationHandeler);
server.get('/weather',weatherHandeler);
server.get('/park',parkHandeler);
server.get('*',ErrorHandeler);


function locationHandeler(req,res){
  let cityName=req.query.city;
  let GEOCODE_API_KEY=process.env.LOCATION_KEY;
  let locURL=`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;
  superAgent.get(locURL)
    .then(geoData=>{
      console.log(geoData);
      let gData=geoData.body;
      let newLocation= new Location(gData,cityName);
      res.send(newLocation);
    });
}


function weatherHandeler(req,res){
  let latitude=req.query.latitude;
  let longitude=req.query.longitude;
  let WEATHER_API_KEY= process.env.WEATHER_KEY;
  let weatherURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&KEY=${WEATHER_API_KEY}&$days=8`;
  superAgent.get(weatherURL)
    .then(weatherData=>{
      console.log(weatherData);
      let wData=weatherData.body.data.map(element=>{
        return new Weather(element);
      });
      res.send(wData);
    })
    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}


function parkHandeler(req,res){
  let cityName=req.query.city;
  let PARK_API_KEY= process.env.PARK_KEY ;
  let parkURL=`https://developer.nps.gov/api/v1/parks?city=${cityName}&api_key=${PARK_API_KEY}`;
  superAgent.get(parkURL)
    .then(parkData=>{
      console.log(parkData);
      let pData=parkData.body.data.map(element=>{
        return new Park(element);
      });
      res.send(pData);
    })
    .catch(error=>{
      console.log(error);
      res.send(error);
    });
}

function ErrorHandeler (req,res){
  let objectEr= {
    status:500,
    resText:'Sorry! Error 500 unexpected condition',
  };
  res.status(500).send(objectEr);
}



function Location (locData,cityName){
  this.search_query=cityName;
  this.formatted_query=locData[0].display_name;
  this.latitude=locData[0].lat;
  this.longitude=locData[0].lon;
}

function Weather(value){
  this.forecast=value.description;
  this.time=value.valid_date;
}

function Park (pData){
  this.name=pData.fullName;
  this.address=pData.addresses[0];
  this.fee='0.00';
  this.description=pData.description;
  this.url=pData.url;
}

server.listen(PORT,()=>{
  console.log( `${PORT}`);
});

