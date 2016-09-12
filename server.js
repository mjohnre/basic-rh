Object.assign = require('object-assign')
var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    mongodb = require('mongodb'),
    ejs = require('ejs'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon');

var app = express();

//var ip = process.env.IP || 'localhost',
//    port = process.env.PORT || 8080,
//    db = null,
//    dbName = 'testdb',
//    dbUrl = 'mongodb://localhost:27017/' + dbName;

// init db
//var mongo = mongodb.MongoClient;

// Use connect method to connect to the Server
//var initDb = mongo.connect(dbUrl, function(err, conn) {
//    db = conn;
//});

var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

// connect to db
initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

// set routes
var index = require('./routes/index');

// view engine setup
app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// make db accessible to router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

// use routes
app.use('/', index);

// 404 not found error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 500 server error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("error: " + err.status + " msg: " + err.message);
    res.render('error.html', {
        code: err.status,
        message: err.message
    });
});

// hide server-side technology information from browser
app.disable('x-powered-by');

// start server
app.set('ip', ip);
app.set('port', port);
var server = app.listen(app.get('port'), function() {
    console.log('Server is running and listening on http://%s:%s', app.get('ip'), app.get('port'));
});

//console.log("__dirname: " + __dirname);

module.exports = app;
