const qiniu = require("../index.js");
const proc = require("process");

var accessKey = proc.env.QINIU_ACCESS_KEY;
var secretKey = proc.env.QINIU_SECRET_KEY;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
//config.useHttpsDomain = true;
config.zone = qiniu.zone.Zone_z0;
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var bucket = "if-pbl";
var key = "qiniu.mp4";

bucketManager.stat(bucket, key, function(err, respBody, respInfo) {
  if (err) {
    console.log(err);
    //throw err;
  } else {
    console.log(respBody.hash);
    console.log(respBody.fsize);
    console.log(respBody.mimeType);
    console.log(respBody.putTime);
    console.log(respBody.type);
  }

});
