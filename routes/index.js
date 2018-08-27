var express = require('express');
var router = express.Router();
var DB = require('../helper/mysql_connect');

var PASSPORT = require('passport');
var FB = require('passport-facebook').Strategy;

router.use(PASSPORT.initialize());
PASSPORT.use(new FB({
  clientID: '318145385621358',
  clientSecret: '57e12a963a020f9346918a3635c0fa4f',
  callbackURL: '/auth/facebook/callback',
  enableProof: true,
  profileFields: ['id','name','name_format','picture','short_name','email']
},
  function (accessToken, refreshToken, user, done) {
    done(null, user);
  }
));

PASSPORT.serializeUser(function (user, done) {
  done(null,user);
});

PASSPORT.deserializeUser(function (params) {
  done(null,user);
});

router.get('/auth/facebook', PASSPORT.authenticate('facebook',{scope: ['email']}));

router.get('/auth/facebook/callback', PASSPORT.authenticate('facebook'), function (req,res) {
  return res.json({
    status: "OK",
    message: "Auth success!",
    user: req.user,
    id: req.user.id
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req,res){
    res.redirect('/home.html');
});

router.post('/do-register' , function(req,res){
  var username = req.body.username;
  var password = req.body.password;

  var sql = "INSERT INTO user(username,password) VALUES (? , ?)";
  var data = [username,password];

  DB.query(sql, data,function (err) {
    if(err){
     //callback -> handler.js (request.done)
      return res.json({
        status: "ERROR",
        message: err.message
      });
    }
    
    return res.json({
      status: "ok",
      message: "Register success"
    });
  });
});
function authMiddleware(req,res,done) {

  var username = req.body.username;
  var password = req.body.password;

  var sql = "SELECT * FROM user WHERE username = ? and password = ?";

  var data = [username,password];

  DB.query(sql, data, function (err,results) {
    if(err){
      return res.json({
        status: "ERROR",
        message: err.message
      });
    } else if (results.length == 0) {
      return res.json({
        status: "Unauthorized",
        message: "Invalid username or password!."
      });
    } else {
      console.log(results[0]);
      res.locals.id = results[0].id;
      done();
    }
  });
}

function verifyAuth(req,res,done) {
  
  var user_id = req.body.user_id;


  if(!user_id){
    return res.json({
      status: "Unauthorized!",
      message: "Please include user_id field!"
    });
  }

  var sql = "SELECT * FROM user WHERE id = ?";
  var data = [user_id];
  
  DB.query(sql,data,function (err, results){
    console.log(results);
    if(err){
      return res.json({
        status: "ERROR",
        message: err.message
      })
    } else if(results.length == 0) {
      return res.json({
        status: "Unauthorized!",
        message: "There is no registered user associated with given user_id!",
        
      });
      
    }
    res.locals.id = user_id;
    done();
  });
}

router.post('/authenticate', authMiddleware, function(req,res){
  return res.json({
    status: "OK",
    message: "Authorized!",
    user_id: res.locals.id
  });
});

router.post('/rate' , verifyAuth , function(req,res){
  var comment = req.body.comment;
  var rating = req.body.rates;
  var userr_id = req.body.user_id;

  var sql = "INSERT INTO rate(userId,rate,comment) VALUES (? , ? , ?)";
  var data = [userr_id,rating,comment];

  DB.query(sql, data,function (err) {
    if(err){
     //callback -> handler.js (request.done)
      return res.json({
        status: "ERROR",
        message: err.message
      });
    }
    
    return res.json({
      status: "ok",
      message: "Rate success"
    });
  });
});
module.exports = router;
