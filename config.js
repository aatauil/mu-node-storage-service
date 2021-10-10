const APPLICATION_GRAPH = process.env.SESSIONS_GRAPH || "http://mu.semte.ch/application";
const FILE_RESOURCE_BASE = process.env.FILE_RESOURCE_BASE || "http://mu.semte.ch/services/file-service/files/";
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

if(!BUCKET_NAME){
  throw `Expected a BUCKET_NAME`;
}

export {
  APPLICATION_GRAPH,
  FILE_RESOURCE_BASE,
  BUCKET_NAME
}