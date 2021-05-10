var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assessmentprofilesSchema = new Schema({
   assessment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assessments'
    },
    competence_profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Competenceprofiles'
    },
    evaluator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

var AssessmentProfiles = mongoose.model('AssessmentProfiles', assessmentprofilesSchema);

module.exports = AssessmentProfiles;