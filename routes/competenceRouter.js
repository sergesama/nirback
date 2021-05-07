const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Competences = require('../models/competences');

const competenceRouter = express.Router();

competenceRouter.use(bodyParser.json());

competenceRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Competences.find(req.query)
      .then(
        (competences) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competences);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
      console.log("request_body " +JSON.stringify(req.body))
    Competences.create(req.body)
      .then(
        (competence) => {
          console.log('competence Created ', competence);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competence);
        },
        (err) => next(err)
      )
      .catch((err) => {next(err);console.log("ERR: " +err)});
  })
  .put(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /competences');
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Competences.remove({})
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

competenceRouter.route('/:competenceId')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Competences.findById(req.params.competenceId)
      .then(
        (competence) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competence);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /competences/' + req.params.competenceId);
  })
  .put(cors.cors,authenticate.verifyUser,  (req, res, next) => {
    Competences.findByIdAndUpdate(
      req.params.competenceId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (competence) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(competence);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Competences.findByIdAndRemove(req.params.competenceId)
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


module.exports = competenceRouter;
