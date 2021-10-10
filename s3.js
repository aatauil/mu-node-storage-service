var AWS = require('aws-sdk');

var s3  = new AWS.S3({
          accessKeyId: 'minio' ,
          secretAccessKey: 'minio123' ,
          endpoint: 'minio:9000' ,
          s3ForcePathStyle: true,
          sslEnabled: false,
          signatureVersion: 'v4'

});
export { s3 }