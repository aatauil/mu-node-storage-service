import { ACCESS_KEY_ID, BUCKET_ENDPOINT, BUCKET_NAME, BUCKET_REGION, SECRET_ACCESS_KEY } from './config';

var AWS = require('aws-sdk');

const params = {
  accessKeyId: ACCESS_KEY_ID ,
  secretAccessKey: SECRET_ACCESS_KEY ,
  endpoint: BUCKET_ENDPOINT ,
  s3ForcePathStyle: true,
  sslEnabled: false,
  signatureVersion: 'v4'
}

if (BUCKET_REGION) {
  params[region] = BUCKET_REGION
}

const s3 = new AWS.S3(params)

// Test if we can access specified bucket
if(s3) {
  s3.listObjects({Bucket: BUCKET_NAME}, (err) => {
    if(err != null) {
      console.log(err)
    }
  });
}

export { s3 }