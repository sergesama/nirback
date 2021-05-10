const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Assessments = require('../models/assessments');
const AssessmentProfiles = require('../models/assessmentprofiles');

const assessmentRouter = express.Router();

assessmentRouter.use(bodyParser.json());

assessmentRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Assessments.find(req.query)
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
        Assessments.create(req.body)
      .then(
        (assessment) => {
          console.log('assessment Created ', assessment);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(assessment);
          assessment.evaluators.map(evaluator => {
            AssessmentProfiles.create({"assessment":assessment._id,"competence_profile":assessment.competence_profile, "evaluated":assessment.evaluated, "evaluator":evaluator})
            .then(
                (assessmentprofile) => {
                    console.log('assessmentprofile Created ', assessmentprofile);
                }
            ).catch((err) => {next(err);console.log("ERR: " +err)});
          })
          

        },
        (err) => {next(err);console.log("ERR: " +err)}
      )
      .catch((err) => {next(err);console.log("ERR: " +err)});
  })
  .put(cors.cors,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /competences');
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Assessments.remove({})
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

assessmentRouter.route('/:competenceId')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Assessments.findById(req.params.competenceId)
      .then(
        (assessment) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(assessment);
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
    Assessments.findByIdAndUpdate(
      req.params.competenceId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (assessment) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(assessment);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Assessments.findByIdAndRemove(req.params.competenceId)
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


module.exports = assessmentRouter;
