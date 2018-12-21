//Dependencies
const express = require('express');
const cookieParser = require('cookie-parser')
const path = require("path");
const routes = require('./Routes/REST');
const dbConnection = require(__dirname + '/Database/connection');

//Main Express component
const app = express();

//For static front-end files
app.use(express.static('Views'));

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/Views'));

//Listen to port
const server = app.listen(1997, ()=>{console.log("Listening at port 1997...")});

//Cookie Parser
app.use(cookieParser());

//Express REST
app.use(routes);

//Database connection
dbConnection.connect(err=>{
  if (err) throw err;
  console.log("Database connected!");
});
