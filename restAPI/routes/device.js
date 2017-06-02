import express from 'express'
import passport from 'passport'
import DeviceController from '../controllers/device'
import ConnectRoles from 'connect-roles'
import { UserDeviceRole,
         AdminRole,
         AdminMaganerRole,
         deviceRole } from '../config/roles'

const router = express.Router()
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
deviceRoles.use('access user device', '/:idDevice', UserDeviceRole)
deviceRoles.use('AdminManager', AdminMaganerRole)
deviceRoles.use('access device', '/:idDevice' ,deviceRole)
deviceRoles.use('access device msm', '/:idDevice/measurement' ,deviceRole)

router.get('/', deviceRoles.is('admin') ,(req, res) => device.getAllDev(req, res));
router.get('/:idDevice', deviceRoles.can('access user device') ,(req, res) => device.getById(req, res));
router.post('/', deviceRoles.can('AdminManager') ,(req, res) => device.createDev(req, res));
router.put('/:idDevice', deviceRoles.can('access device') ,(req, res) => device.updateDev(req, res));
router.delete('/:idDevice', deviceRoles.can('AdminManager') ,(req, res) => device.deleteDev(req, res));

router.get('/:idDevice/measurement/', (req, res) => device.getAllDevMsm(req, res));
router.get('/:idDevice/measurement/:idMeasurement', (req, res) => device.getByIdMsm(req, res));
router.post('/:idDevice/measurement/', deviceRoles.can('access device msm') ,(req, res) => device.createDevMsm(req, res));
router.put('/:idDevice/measurement/:idMeasurement', (req, res) => device.updateMsm(req, res));
router.delete('/:idDevice/measurement/:idMeasurement', (req, res) => device.deleteMsm(req, res));

export default router;
