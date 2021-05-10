const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const AssessmentProfiles = require('../models/assessmentprofiles');
const Competenceprofiles = require('../models/competenceprofiles');

const assessmentprofileRouter = express.Router();

assessmentprofileRouter.use(bodyParser.json());

assessmentprofileRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    AssessmentProfiles.find(req.query)
    .populate('assessment')
    .populate('evaluator')
    .populate('evaluated')
    .populate({
        path: "competence_profile", 
        populate: {
           path: "competence"
        }
     })
      .then(
        (assessmentprofiles) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(assessmentprofiles);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
module.exports = assessmentprofileRouter;
