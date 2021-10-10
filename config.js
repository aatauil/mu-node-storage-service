const APPLICATION_GRAPH = process.env.SESSIONS_GRAPH || "http://mu.semte.ch/application";
const FILE_RESOURCE_BASE = process.env.FILE_RESOURCE_BASE || "http://mu.semte.ch/services/file-service/files/";
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
const BUCKET_ENDPOINT = process.env.BUCKET_ENDPOINT; 
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

if(!ACCESS_KEY_ID){
  throw `Expected a ACCESS_KEY_ID`;
}

if(!SECRET_ACCESS_KEY){
  throw `Expected a SECRET_ACCESS_KEY`;
}

if(!BUCKET_ENDPOINT){
  throw `Expected a BUCKET_ENDPOINT`;
}

if(!BUCKET_NAME){
  throw `Expected a BUCKET_NAME`;
}


export {
  APPLICATION_GRAPH,
  FILE_RESOURCE_BASE,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  BUCKET_ENDPOINT,
  BUCKET_NAME,
  BUCKET_REGION
}