'use strict';

const express=require('express');
require ('dotenv').config();
const cors =require('cors');
const superAgent=require('superagent');
const dateFormat=require('dateformat');


const server=express();
const PORT = process.env.PORT || 3500;
server.use(cors());



server.get('/location',locationHandeler);
server.get('/weather',weatherHandeler);
server.get('/parks',parkHandeler);
server.get('*',ErrorHandeler);


function locationHandeler(req,res){
  let cityName=req.query.city;
  let GEOCODE_API_KEY=process.env.LOCATION_KEY;
  let locURL=`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;
  superAgent.get(locURL)
    .then(geoData=>{
      let gData=geoData.body;
      let newLocation= new Location(gData,cityName);
      res.send(newLocation);
    });
}


function weatherHandeler(req,res){
  let cityName=req.query.search_query;
  let WEATHER_API_KEY= process.env.WEATHER_KEY;
  let weatherURL=`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&KEY=${WEATHER_API_KEY}&days=8`;
  superAgent.get(weatherURL)
    .then(weatherData=>{
      let wData=weatherData.body.data.map(element=>{
        return new Weather(element);
      });
      res.send(wData);
    })
    .catch(error=>{
      res.send(error);
    });
}


function parkHandeler(req,res){
  let cityName=req.query.search_query;
  let PARK_API_KEY= process.env.PARK_KEY ;
  let parkURL=`https://developer.nps.gov/api/v1/parks?q=${cityName}&api_key=${PARK_API_KEY}&limit=10`;
  superAgent.get(parkURL)
    .then(parkData=>{
      let pData=parkData.body.data.map(element=>{
        return new Park(element);
      });
      console.log(pData);
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
  this.forecast=value.weather.description;
  this.time=dateFormat(new Date(value.valid_date),'ddd mmm dd yyyy');
}

function Park (pValue){
  this.name=pValue.fullName;
  this.address=pValue.addresses[0].postalCode+pValue.addresses[0].city+pValue.addresses[0].stateCode+pValue.addresses[0].line1+pValue.addresses[0].type;
  this.fee='0.00';
  this.description=pValue.description;
  this.url=pValue.url;
}

server.listen(PORT,()=>{
  console.log( `${PORT}`);
});

