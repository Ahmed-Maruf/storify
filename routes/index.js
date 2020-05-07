const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { catchErrors } = require('../handlers/errorHandlers');

exports.catchErrors = (fn) => {
	return function(req, res, next) {
		return fn(req, res, next).catch(next);
	};
};

// Do work here
router.get('/', StoreController.homePage);
router.get('/add', StoreController.addStore);
router.post('/add', catchErrors(StoreController.createStore));
module.exports = router;
