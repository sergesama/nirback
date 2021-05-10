var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competenceprofilesSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    competences: [{
        competence_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Competences'
        },
        weight:{
            type: String,
            required: true
        }
    }]  
}, {
    timestamps: true
});

var Competenceprofiles = mongoose.model('Competenceprofiles', competenceprofilesSchema);

module.exports = Competenceprofiles;
