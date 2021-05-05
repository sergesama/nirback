const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);



const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    creator: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },

    publisher: {
        type: String,
        default: ''
    },
    contributor: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text/html'
    },
    identifier: {
        type: String,
        default:''      
    },
    source: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: ''
    },
    relation: {
        type: String,
        default: ''
    },
    coverage: {
        type: String,
        default: 'world'
    },
    rights: {
        type: String,
        default: ''
    },
    audience: {
        type: String,
        default: 'Инженеры'
    },
    provenance: {
        type: String,
        default: ''
    },
    rightsholder: {
        type: String,
        default: ''
    },

}, {
    timestamps: true
});

var Books = mongoose.model('Book', bookSchema);

module.exports = Books;