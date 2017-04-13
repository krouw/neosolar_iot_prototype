import express from 'express'
import passport from 'passport'
import AuthController from '../controllers/auth'

const router = express.Router()
const auth = new AuthController();

router.get('/', (req, res) => res.send("get auth"));
router.post('/signin', (req, res) => auth.signin(req, res));
router.post('/signup', (req, res) => auth.signup(req, res));
router.get('/signout', (req, res) => auth.signout(req, res));
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/google/close', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => { auth.google(req,res)  }
);

/*
router.get('/google/close', (req, res, next) =>{
  passport.authenticate('google')
}); */


export default router;
