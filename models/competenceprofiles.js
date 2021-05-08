var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competenceprofilesSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    competences: [{
        name:{
            type: String
        },
        weight:{
            type: String
        }
    }]  
}, {
    timestamps: true
});

var Competenceprofiles = mongoose.model('Competenceprofiles', competenceprofilesSchema);

module.exports = Competenceprofiles;
