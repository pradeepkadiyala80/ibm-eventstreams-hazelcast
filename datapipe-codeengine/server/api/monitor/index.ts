import { Router } from 'express';
import * as controller from './monitor.controller';

let router = Router();

router.get('/v1/availability', controller.checkAvailability);

module.exports = router;
