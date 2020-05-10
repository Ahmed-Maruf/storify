const express = require('express');
const router = express.Router();

const StoreController = require('../controllers/StoreController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const {catchErrors} = require('../handlers/errorHandlers');
// Do work here
router.get('/', StoreController.getStores);
router.get('/stores', StoreController.getStores);
router.get('/store/:id/edit', catchErrors(StoreController.editStore));
router.get('/add', StoreController.addStore);
router.post(
	'/add',
	StoreController.upload,
	catchErrors(StoreController.resize),
	catchErrors(StoreController.createStore)
);
router.post(
	'/add/:id',
	StoreController.upload,
	catchErrors(StoreController.resize),
	catchErrors(StoreController.updateStore)
);

router.get('/store/:slug', catchErrors(StoreController.getStoreBySlug));

router.get('/tags', catchErrors(StoreController.getStoresByTag));
router.get('/tags/:tag', catchErrors(StoreController.getStoresByTag));

router.get('/login', UserController.loginForm);
router.get('/register', UserController.registrationForm);
router.post('/register',
	UserController.validateRegistration,
	UserController.register,
	AuthController.login);
module.exports = router;
