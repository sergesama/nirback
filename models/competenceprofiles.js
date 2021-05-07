var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competenceprofilesSchema = new Schema({
    competences: [{
        name:{
            type: String,
            required: true
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