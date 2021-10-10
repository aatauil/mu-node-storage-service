import { querySudo as query } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeInt, sparqlEscapeUri, sparqlEscapeDateTime, uuid } from 'mu';
import parseResults from '../utils/parse-results';
import { s3 } from '../s3';

export default async function downloadFile(req, res) {

  const fileId = req.params.id;

  const fileDataQuery = `
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>

    SELECT ?fileUrl WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ?uri mu:uuid ${sparqlEscapeString(fileId)} .
        ?fileUrl nie:dataSource ?uri .
      }
    }
  `

  const response = await query(fileDataQuery);
  const { fileUrl } = parseResults(response);
  const fileKey = fileUrl.split("//").pop();

  const params = {
    Bucket: 'testbucket',
    Key: fileKey,
  }

  const file = s3.getObject(params);

  const stream = file.createReadStream().on('error', (err) => {
    console.error(err)
    file.abort()
  })
  
  stream.pipe(res)
}