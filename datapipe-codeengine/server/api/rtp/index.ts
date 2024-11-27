import { Router } from 'express';
import * as controller from './rtp.controller';

let router = Router();

router.route('/v1/document')
  .post(controller.putDocument)
  .put(controller.putDocument)
  .delete(controller.deleteDocument);

module.exports = router;
