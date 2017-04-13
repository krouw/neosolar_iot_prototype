import express from 'express'
import passport from 'passport'
import MeasurementController from '../controllers/measurement'

const router = express.Router()
const measurement = new MeasurementController();

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => measurement.getAllMeasurement(req, res));
router.get('/:idMeasurement', passport.authenticate('jwt', {session: false}), (req, res) => measurement.getByIdMeasurement(req, res));
router.post('/', (req, res) => measurement.createMeasurement(req, res));
router.put('/:idMeasurement', passport.authenticate('jwt', {session: false}), (req, res) => measurement.updateMsm(req, res));
router.delete('/:idMeasurement', passport.authenticate('jwt', {session: false}), (req, res) => measurement.deleteMsm(req, res));

export default router;
