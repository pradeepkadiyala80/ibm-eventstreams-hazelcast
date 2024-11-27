import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import config from '../config/environment';

const keyIndex: CloudantV1.SearchIndexDefinition = {
  index: 'function (doc) {  index("key", doc.value.key); }'
}

const designDocument: CloudantV1.DesignDocument = {
  indexes: {'keys': keyIndex}
}

function getDBInstance () {

    let authenticator = new IamAuthenticator({
      apikey: config.cloudant.apiKey
    });

    let service = new CloudantV1({
      authenticator: authenticator
    });

    service.setServiceUrl(config.cloudant.url);

    return service;
}

export function getDocumentIdByKey (key: string) : Promise <any> {
  let service = getDBInstance();
  let selector = {
    value: {
      key: {
        '$eq': key
      }
    }
  };

  return service.postFind({
    db: config.cloudant.db,
    selector: selector
  });
}

export function postDocument (doc: any) : Promise <any> {
    let service = getDBInstance();
    return service.postDocument({
      db: config.cloudant.db,
      document: doc
    });
}

export function putDocument (docId: string, doc: any) : Promise <any> {
  let service = getDBInstance();
  return service.putDocument({
    db: config.cloudant.db,
    docId: docId,
    document: doc
  });
}

export function deleteDocument (docId: string, rev: string) : Promise <any> {
  let service = getDBInstance();
  return service.deleteDocument({
    db: config.cloudant.db,
    docId: docId,
    rev: rev
  });
}

getDBInstance().putDesignDocument(
  {
    db: config.cloudant.db,
    designDocument: designDocument,
    ddoc: 'alldocuments'
  }
).then(response => {
  console.log(response.result);
}).catch(e => {
  //console.error(e);
});
