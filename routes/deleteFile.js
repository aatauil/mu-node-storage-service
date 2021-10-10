import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeInt, sparqlEscapeUri, sparqlEscapeDateTime, uuid } from 'mu';
import { APPLICATION_GRAPH, BUCKET_NAME } from '../config';
import { s3 } from '../s3';
import parseResults from '../utils/parse-results';

export default async function deleteFile(req, res) {

  const fileId = req.params.id;

  const fileDataQuery = `
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    
    SELECT ?uri ?fileUrl WHERE {
      GRAPH <${APPLICATION_GRAPH}> {
        ?uri mu:uuid ${sparqlEscapeString(fileId)} .
        ?fileUrl nie:dataSource ?uri .
      }
    }
  `
  
  const { uri, fileUrl } = parseResults(await query(fileDataQuery))

  const fileKey = fileUrl.split("//").pop();

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey
  }

  await s3.deleteObject(params).promise();

  const deleteFileQuery = `
    PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dbpedia: <http://dbpedia.org/resource/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>

    DELETE WHERE {
      GRAPH <${APPLICATION_GRAPH}> {
        ${sparqlEscapeUri(uri)} a nfo:FileDataObject ;
          nfo:fileName ?upload_name ;
          mu:uuid ?upload_id ;
          dc:format ?upload_format ;
          dbpedia:fileExtension ?upload_extension ;
          nfo:fileSize ?upload_size ;
          dc:created ?upload_created ;
          dc:modified ?upload_modified .
        ${sparqlEscapeUri(fileUrl)} a nfo:FileDataObject ;
          nie:dataSource ${sparqlEscapeUri(uri)} ;
          nfo:fileName ?fileName ;
          mu:uuid ?id ;
          dc:format ?format ;
          dbpedia:fileExtension ?extension ;
          nfo:fileSize ?size ;
          dc:created ?created ;
          dc:modified ?modified .
      }
    }
  `

  await update(deleteFileQuery);

  res.sendStatus(204)
}