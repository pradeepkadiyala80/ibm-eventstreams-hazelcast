import * as cloudant from '../../dao/cloudant';
import * as apiHelper from '../helper/api-helper';
import * as logHelpers from '../../components/utils/logHelpers';
const loggers = logHelpers.loggers;
const logger = loggers.get('api');

export function putDocument(req, res) {
  const start = process.hrtime();
  let headers = req.headers;
  let doc = req.body;
  cloudant.getDocumentIdByKey(doc.value.key).then((res) => {
    if(res.result.docs.length === 0) {
      return cloudant.postDocument(doc);
    } else {
      let _doc = {
        _id : res.result.docs[0]._id,
        _rev: res.result.docs[0]._rev,
        key: res.result.docs[0].key,
        value: doc.value
      };
      return cloudant.putDocument(res.result.docs[0]._id, _doc);
    }
  })
  .then((resp) => apiHelper.success(res, resp, start))
  .catch((e) => apiHelper.failed(res, e, start));
}

export function deleteDocument(req, res) {
  const start = process.hrtime();
  let doc = req.body;
  cloudant.getDocumentIdByKey(doc.value.key).then((resp) => {
    if(resp.result.docs.length === 0) {
      let errorMsg = 'Unable to find the doc';
      let err = { message: errorMsg, status: 400};
      return Promise.reject(err);
    } else {
      return cloudant.deleteDocument(
        resp.result.docs[0]._id,
        resp.result.docs[0]._rev,
      );
    }
  })
  .then((resp) => apiHelper.success(res, resp, start))
  .catch((e) => apiHelper.failed(res, e, start));
}
