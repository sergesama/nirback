const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const Books = require('../models/books');

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());

bookRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Books.find(req.query)
      .then(
        (books) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(books);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Books.create(req.body)
      .then(
        (book) => {
          console.log('book Created ', book);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Books.remove({})
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

bookRouter.route('/:bookId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Books.findById(req.params.bookId)
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /books/' + req.params.bookId);
  })
  .put(cors.corsWithOptions,authenticate.verifyUser,  (req, res, next) => {
    Books.findByIdAndUpdate(
      req.params.bookId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Books.findByIdAndRemove(req.params.bookId)
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


module.exports = bookRouter;