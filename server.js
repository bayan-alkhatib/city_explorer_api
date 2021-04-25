'use strict';

const express=require('express');

require ('dotenv').config;

const server=express();

const PORT = process.env.port || 3500;

server.listen(PORT,()=>{
  console.log( 'Welcome');
});

server.get('/data',(req,res)=>{
  res.send(`you are deploying on heroku ${PORT}`);
});
