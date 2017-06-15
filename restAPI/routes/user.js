import express from 'express'
import passport from 'passport'
import UserController from '../controllers/user'
import ConnectRoles from 'connect-roles'
import { UserRole,
         AdminRole, } from '../config/roles'

const router = express.Router()
const user = new UserController();
const userRoles = new ConnectRoles({
  failureHandler: function (req, res, next) {
    // optional function to customise code that runs when
    // user fails authorization
    return res.status(403).json({ status: 'Unauthorized', error: { authorization: 'Acceso Denegado, no tienes suficientes permisos.' } })
  }
});

//Middlewares
  //Primero se verifica el token por passport y se pasa el usuario encontrado al middleware de Autorizacion de Roles
router.use(passport.authenticate('jwt', {session: false}));
router.use(userRoles.middleware());

//Roles
userRoles.use('access user', '/:idUser', UserRole)
userRoles.use('access user device', '/:idUser/device', UserRole)
userRoles.use('access device user', '/:idUser/device/:idDevice', UserRole)
userRoles.use('admin', AdminRole)

//Rutas
router.get('/', userRoles.is('admin') ,(req, res) => user.getAll(req, res));
router.get('/:idUser', userRoles.can('access user') ,(req, res) => user.getById(req, res));
router.post('/', userRoles.is('admin') ,(req, res) => user.create(req, res));
router.put('/:idUser', userRoles.can('access user') ,(req, res) => user.update(req, res));
router.delete('/:idUser', userRoles.can('access user') ,(req, res) => user.delete(req, res));

router.get('/:idUser/device', userRoles.can('access user device') ,(req, res) => user.getAllDev(req, res));
router.get('/:idUser/device/:idDevice', userRoles.can('access device user') ,(req, res) => user.getByIdDev(req, res));
router.post('/:idUser/device', userRoles.can('access user device') ,(req, res) => user.createDev(req, res));
router.put('/:idUser/device/:idDevice', userRoles.can('access device user') ,(req, res) => user.updateDev(req, res));
router.delete('/:idUser/device/:idDevice', userRoles.can('access device user') ,(req, res) => user.deleteDev(req, res));

//refreshToken
router.post('/token', (req, res) => user.refreshTokenUser(req, res))
router.post('/token/reject', userRoles.is('admin') ,(req, res) => user.deleteRefreshTokenUser(req, res) )

export default router;
