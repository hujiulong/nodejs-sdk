var fs = require('fs');
var url = require('url');
var path = require('path');
var crypto = require('crypto');
var conf = require('./conf');

exports.isQiniuCallback = isQiniuCallback;

// ------------------------------------------------------------------------------------------
// func encode
exports.isTimestampExpired = function(timestamp) {
  return timestamp > parseInt(Date.now() / 1000);
}

exports.encodedEntry = function(bucket, key) {
  return exports.urlsafeBase64Encode(bucket + (key ? ':' + key : ''));
}

exports.urlsafeBase64Encode = function(jsonFlags) {
  var encoded = new Buffer(jsonFlags).toString('base64');
  return exports.base64ToUrlSafe(encoded);
}

exports.base64ToUrlSafe = function(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

exports.hmacSha1 = function(encodedFlags, secretKey) {
  /*
   *return value already encoded with base64
   * */
  var hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(encodedFlags);
  return hmac.digest('base64');
}

// ------------------------------------------------------------------------------------------
// func generateAccessToken

exports.generateAccessToken = function(mac, uri, body) {
  var u = url.parse(uri);
  var path = u.path;
  var access = path + '\n';

  if (body) {
    access += body;
  }

  var digest = exports.hmacSha1(access, mac.secretKey);
  var safeDigest = exports.base64ToUrlSafe(digest);
  return 'QBox ' + mac.accessKey + ':' + safeDigest;
}

function isQiniuCallback(mac, path, body, callbackAuth) {
  var auth = exports.generateAccessToken(mac, path, body);
  return auth === callbackAuth;
}
