import { app } from 'mu';
import fileUpload from 'express-fileupload';
import uploadFiles from './routes/uploadFiles';
import getFileData from './routes/getFileData';
import downloadFile from './routes/downloadFile';
import deleteFile from './routes/deleteFile';


/** MIDDLEWARE */
app.use(fileUpload());

app.get('/', function( req, res ) {
  res.send('Hello from the mu-node-storage-service :)');
} );

/**
 *  Higher order caller function for global error handling. 
 *  this will catch errors, alternative for try/catch
*/
const use = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/files', use(uploadFiles));
app.get('/files/:id', use(getFileData));
app.get('/files/:id/download', use(downloadFile));
app.delete('/files/:id', use(deleteFile));

// Error handling middleware
app.use(function(err, req, res, next){
  res.status(500).json({
    errors: [{ title: "Something went wrong" }]
  });
});
