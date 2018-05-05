const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const nocache = require('nocache');

app.use(nocache());
app.use(express.static(path.join(__dirname, '../build'), {etga: false}));


app.get('/test', (req,res)=>{
  console.log("?")
  res.send('Hello')
})

app.get('/*', (req,res)=>{
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
})

http.createServer(app).listen(1111, 'localhost');