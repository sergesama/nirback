var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assessmentsSchema = new Schema({
   name: {
        type: String,
        required: true
    },
    competence_profile:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Competences'
    },
    evaluated:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    evaluators:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
}, {
    timestamps: true
});

var Assessments = mongoose.model('Assessments', assessmentsSchema);

module.exports = Assessments;