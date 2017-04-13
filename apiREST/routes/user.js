import express from 'express'
import passport from 'passport'
import UserController from '../controllers/user'

const router = express.Router()
const user = new UserController();

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => user.getAll(req, res));
router.get('/:idUser', passport.authenticate('jwt', {session: false}), (req, res) => user.getById(req, res));
router.post('/', (req, res) => user.create(req, res));
router.put('/:idUser', passport.authenticate('jwt', {session: false}), (req, res) => user.update(req, res));
router.delete('/:idUser', passport.authenticate('jwt', {session: false}), (req, res) => user.delete(req, res));

router.get('/:idUser/device', passport.authenticate('jwt', {session: false}), (req, res) => user.getAllDev(req, res));
router.get('/:idUser/device/:idDevice', passport.authenticate('jwt', {session: false}), (req, res) => user.getByIdDev(req, res));
router.post('/:idUser/device', passport.authenticate('jwt', {session: false}), (req, res) => user.new(req, res));
router.put('/:idUser/device/:idDevice', passport.authenticate('jwt', {session: false}), (req, res) => user.updateDev(req, res));
router.delete('/:idUser/device/:idDevice', passport.authenticate('jwt', {session: false}), (req, res) => user.deleteDev(req, res));

export default router;
