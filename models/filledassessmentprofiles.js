var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var filledassessmentprofilesSchema = new Schema({
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assessments'
    },
    assessmentProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AssessmentProfiles'
    },
    competences:[{
        comp_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Competences'
        },
        weight:{
            type: String,
            required: true
        },
        chosenValue:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});
var FilledAssessmentProfiles = mongoose.model('FilledAssessmentProfiles', filledassessmentprofilesSchema);

module.exports = FilledAssessmentProfiles;