const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sonosPackage = require('sonos');
const Sonos = sonosPackage.Sonos;
const redisPackage = require('redis');

const api = require('./lib/api');

const app = express();

const spotifyRegion = process.env.SPOTIFY_REGION || 'EU';
const sonos = new Sonos(process.env.SONOS_HOST);
sonos.setSpotifyRegion(sonosPackage.SpotifyRegion[spotifyRegion]);

const redis = redisPackage.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || '6379'
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.REACT_APP_URL);
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', api({ sonos, redis }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
