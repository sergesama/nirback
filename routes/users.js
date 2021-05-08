var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
const cors = require('./cors');
var authenticate = require('../authenticate');
var User = require('../models/user');

router.use(bodyParser.json());
/* GET users listing. */
router.options('*',cors.cors, (req, res) => { res.sendStatus(200); })
router.get('/',cors.cors,authenticate.verifyUser, (req,res,next) => {
  User.find({})
    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.post('/signup',cors.cors, (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err });
    } else {
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      });
    }
  });
});

router.post('/login',cors.cors,(req, res,next) => {
	passport.authenticate('local', (err,user,info)=>{
		if(err)
			return next(err);
			
		if(!user){
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: false, status: 'Login Unsuccessful!', err:info });
		}
		req.logIn(user, (err)=> {
			if(err){
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				res.json({ success: false, status: 'Login Unsuccessful!', err:'Could not log in user' });
			}
			var token = authenticate.getToken({ _id: req.user._id });
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({ success: true, status: 'Login Successful!', token: token });
		});
	}) (req,res,next)
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});


router.get('/checkJWTToken',cors.corsWithOptions,(req, res,next) => {
	passport.authenticate('jwt', {session: false},(err,user,info)=>{
		if(err)
			return next(err);
		if(!user)
		{
			res.statusCode=401;
			res.setHeader('Content-Type', 'application/json');
			res.json({status: 'JWT invalid!',session: false, err:info });
		}
		else
		{
			res.statusCode=200;
			res.setHeader('Content-Type', 'application/json');
			res.json({status: 'JWT valid!',session: true, user:user });
		}
	})
})


module.exports = router;
