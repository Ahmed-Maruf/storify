const express = require('express');
const router = express.Router();

const StoreController = require('../controllers/StoreController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const {catchErrors} = require('../handlers/errorHandlers');
// Do work here
router.get('/', StoreController.getStores);
router.get('/stores', StoreController.getStores);
router.get('/store/:id/edit', AuthController.isLoggedIn, catchErrors(StoreController.editStore));
router.get('/add', AuthController.isLoggedIn, StoreController.addStore);
router.post(
	'/add',
	AuthController.isLoggedIn,
	StoreController.upload,
	catchErrors(StoreController.resize),
	catchErrors(StoreController.createStore)
);
router.post(
	'/add/:id',
	AuthController.isLoggedIn,
	StoreController.upload,
	catchErrors(StoreController.resize),
	catchErrors(StoreController.updateStore)
);

router.get('/store/:slug', catchErrors(StoreController.getStoreBySlug));

router.get('/tags', catchErrors(StoreController.getStoresByTag));
router.get('/tags/:tag', catchErrors(StoreController.getStoresByTag));

router.get('/login', UserController.loginForm);
router.post('/login', AuthController.login);
router.get('/register', UserController.registrationForm);
router.post('/register',
	UserController.validateRegistration,
	UserController.register,
	AuthController.login);

router.get('/logout', AuthController.logout);

module.exports = router;
