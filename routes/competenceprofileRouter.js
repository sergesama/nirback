const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Competenceprofiles = require('../models/competenceprofiles');

const CompetenceprofileRouter = express.Router();

CompetenceprofileRouter.use(bodyParser.json());

CompetenceprofileRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Competenceprofiles.find(req.query)
      .then(
        (competenceprofiles) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competenceprofiles);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
      console.log("request_body " +JSON.stringify(req.body))
    Competenceprofiles.create(req.body)
      .then(
        (competenceprofile) => {
          console.log('competenceprofile Created ', competenceprofile);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competenceprofile);
        },
        (err) => {next(err);console.log("ERR: " +err)}
      )
      .catch((err) => {next(err);console.log("ERR: " +err)});
  })
  .put(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /competenceprofiles');
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Competenceprofiles.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

CompetenceprofileRouter.route('/:competenceprofileId')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Competenceprofiles.findById(req.params.competenceprofileId)
      .then(
        (competenceprofile) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competenceprofile);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /competenceprofiles/' + req.params.competenceprofileId);
  })
  .put(cors.cors,authenticate.verifyUser,  (req, res, next) => {
    Competenceprofiles.findByIdAndUpdate(
      req.params.competenceprofileId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (competenceprofile) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competenceprofile);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Competenceprofiles.findByIdAndRemove(req.params.competenceprofileId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });


module.exports = CompetenceprofileRouter;
