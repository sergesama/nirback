const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const FilledAssessmentProfiles = require('../models/filledassessmentprofiles');
const AssessmentProfiles = require('../models/assessmentprofiles');

const filledassessmentprofilesRouter = express.Router();

filledassessmentprofilesRouter.use(bodyParser.json());

filledassessmentprofilesRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    FilledAssessmentProfiles.find(req.query)
    .populate("assessmentId")
    .populate({
      path: 'assessmentId', 
      populate: {
         path: "competence_profile" 
      }
   })
    .populate()
    .populate({
        path: "competences", 
        populate: {
           path: "comp_id" 
        }
     })
      .then(
        (filledassessmentprofile) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(filledassessmentprofile);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    console.log("request_body " +JSON.stringify(req.body))
    FilledAssessmentProfiles.create(req.body)
    .then(
      (filledassessmentprofile) => {
        console.log('FilledAssessmentProfile Created ', filledassessmentprofile);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(filledassessmentprofile);
        AssessmentProfiles.findByIdAndUpdate(
            { _id: filledassessmentprofile.assessmentProfileId },
            { filled: true }
          ) .then((AssessmentProfile) => {
            console.log("AssessmentProfile changed :" + AssessmentProfile)  ;            
        }, (err) => next(err));;
      },
      (err) => {next(err);console.log("ERR: " +err)}
    )
    .catch((err) => {next(err);console.log("ERR: " +err)});
})
module.exports = filledassessmentprofilesRouter;
