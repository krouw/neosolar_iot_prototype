import express from 'express'
import passport from 'passport'
import DeviceController from '../controllers/device'
import MeasurementController from '../controllers/measurement'
import ConnectRoles from 'connect-roles'
import { UserRole,
         AdminRole, } from '../config/roles'

const router = express.Router()
const measurement = new MeasurementController()
const device = new DeviceController()
const deviceRoles = new ConnectRoles({
  failureHandler: function (req, res, next) {
    // optional function to customise code that runs when
    // user fails authorization
    return res.status(403).json({ status: 'Unauthorized', error: { authorization: 'Acceso Denegado, no tienes suficientes permisos.' } })
  }
});

router.use(passport.authenticate('jwt', {session: false}))
router.use(deviceRoles.middleware());

//Roles
deviceRoles.use('admin', AdminRole)

router.get('/', deviceRoles.is('admin') ,(req, res) => device.getAllDev(req, res));
router.get('/:idDevice', (req, res) => device.getByIdDev(req, res));
router.post('/', (req, res) => device.createDev(req, res));
router.put('/:idDevice', (req, res) => device.updateDev(req, res));
router.delete('/:idDevice', (req, res) => device.deleteDev(req, res));

router.get('/:idDevice/measurement/', (req, res) => measurement.getAllMsm(req, res));
router.get('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.getByIdMsm(req, res));
router.post('/:idDevice/measurement/', (req, res) => measurement.createMsm(req, res));
router.put('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.updateMsm(req, res));
router.delete('/:idDevice/measurement/:idMeasurement', (req, res) => measurement.deleteMsm(req, res));

export default router;
