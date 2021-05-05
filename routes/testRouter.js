const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Books = require('../models/books');
const profile = require('./my_profile_data.json')
const testRouter = express.Router();
path = require('path'),
testRouter.use(bodyParser.json());

testRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get( (req,res,next) => {
   
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
		  console.log(profile)
          res.json(profile);
          //res.sendFile(path.join('C:/Users/Sergesama/Desktop/Работа/Teams_App_React-main/src/my_profile_data.js'));
  
  });

module.exports = testRouter;