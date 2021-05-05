const express = require('express');
const bodyParser = require('body-parser');


const Favorites = require('../models/favorite');

var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    console.log("GET " + req.user._id)
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('books')
    .then((favorites) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.books.indexOf(req.body[i]._id) === -1) {
                    favorite.books.push(req.body[i]._id);
                }
            }
             favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('books')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });
        }
        else {
            for (i = 0; i < req.body.length; i++ )
                if (favorite.books.indexOf(req.body[i]._id) < 0)                                  
                    favorite.books.push(req.body[i]);
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('books')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    /* TODO доработать удаление Любимого */
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((favorites) => {
		Favorite.findById(favorite._id)
		.populate('user')
		.populate('books')
		.then((favorites)=>{
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favorites);
		})
    }, (err) => next(err))
    .catch((err) => next(err));   
});

favoriteRouter.route('/:bookId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    console.log("GET " + req.user._id)
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        console.log("GET " + favorites)
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.books.indexOf(req.params.bookId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.books.indexOf(req.params.bookId) === -1) {
                favorite.books=favorite.books.concat([{ "_id": req.params.bookId }]);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('books')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });
            }
        }
		else {
            Favorites.create({"user": req.user._id, "books": [req.params.bookId]})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
		}
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.bookId);
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.books.indexOf(req.params.bookId);
            if (index >= 0) {
                favorite.books.splice(index, 1);
                favorite.save()
				.then((favorite) => {
					Favorites.findById(favorite._id)
					.populate('user')
					.populate('books')
					.then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
				})
            }
            else {
                err = new Error('book ' + req.params.bookId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;
