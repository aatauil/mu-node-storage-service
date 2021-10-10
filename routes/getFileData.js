import { querySudo as query } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString } from 'mu';
import parseResults from '../utils/parse-results';

export default async function getFileData(req, res) {

  const fileId = req.params.id;

  const fileDataQuery = `
    PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dbpedia: <http://dbpedia.org/resource/>

    SELECT ?uri ?name ?format ?size ?extension WHERE {
      GRAPH <http://mu.semte.ch/application> {
        ?uri mu:uuid ${sparqlEscapeString(fileId)} ;
            nfo:fileName ?name ;
            dc:format ?format ;
            dbpedia:fileExtension ?extension ;
            nfo:fileSize ?size .
      }
    }
  `

  const response = await query(fileDataQuery);
  const fileData = parseResults(response);

  return res.status(201).json({
    links: {
      self: req.headers['x-rewrite-url']
    },
    data: {
      type: 'files',
      id: fileId,
      attributes: {
        name: fileData.name,
        format: fileData.format,
        size: fileData.size,
        extension: fileData.extension
      }
    },
  });
}