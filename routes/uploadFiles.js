import { sparqlEscapeString, sparqlEscapeInt, sparqlEscapeUri, sparqlEscapeDateTime, uuid } from 'mu';
import { updateSudo as update } from '@lblod/mu-auth-sudo';
import { s3 } from '../s3';

export default async function uploadFiles(req, res) {
  
  if (!req.files) return res.status(400).json({
    "errors": [
      {
        "status": "400",
        "title": "File parameter is required."
      }
    ]
  });

  const file = req.files.file;
  const now = new Date();

  const uploadResourceUuid = uuid();
  const uploadResourceName = file.name;
  const uploadResourceUri = `http://mu.semte.ch/services/file-service/files/${uploadResourceUuid}`;

  const fileFormat = file.mimetype;
  const fileExtention = file.name.split(".").pop();
  const fileSize = file.size;

  const fileResourceUuid = uuid();
  const fileResourceName = `${uploadResourceUuid}.${fileExtention}`;
  const fileResourceUri = `share://${fileResourceName}`;

  const insertFileQuery = ` 
    PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dbpedia: <http://dbpedia.org/resource/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    
    INSERT DATA {
      GRAPH <http://mu.semte.ch/application> {
        ${sparqlEscapeUri(uploadResourceUri)} a nfo:FileDataObject ;
            nfo:fileName ${sparqlEscapeString(uploadResourceName)} ;
            mu:uuid ${sparqlEscapeString(uploadResourceUuid)} ;
            dc:format ${sparqlEscapeString(fileFormat)} ;
            nfo:fileSize ${sparqlEscapeInt(fileSize)} ;
            dbpedia:fileExtension ${sparqlEscapeString(fileExtention)} ;
            dc:created ${sparqlEscapeDateTime(now)} ;
            dc:modified ${sparqlEscapeDateTime(now)} .

        ${sparqlEscapeUri(fileResourceUri)} a nfo:FileDataObject ;
            nie:dataSource ${sparqlEscapeString(uploadResourceUri)} ;
            nfo:fileName ${sparqlEscapeString(fileResourceName)} ;
            mu:uuid ${sparqlEscapeString(fileResourceUuid)} ;
            dc:format ${sparqlEscapeString(fileFormat)} ;
            nfo:fileSize ${sparqlEscapeInt(fileSize)} ;
            dbpedia:fileExtension ${sparqlEscapeString(fileExtention)} ;
            dc:created ${sparqlEscapeDateTime(now)} ;
            dc:modified ${sparqlEscapeDateTime(now)} .
      }
    }
  `

  await update(insertFileQuery);

  var params = { 
    Bucket: 'testbucket', 
    Key: fileResourceName, 
    Body: file.data, 
    ContentType: file.mimetype,
  };
  
  await s3.upload(params).promise();

  return res.status(201).json({
    links: {
      self: req.headers['x-rewrite-url'] + '/' + uploadResourceUuid
    },
    data: {
      type: 'files',
      id: uploadResourceUuid,
      attributes: {
        name: uploadResourceName,
        format: fileFormat,
        size: fileSize,
        extension: fileExtention
      }
    },
  });
}