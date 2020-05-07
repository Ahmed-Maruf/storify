const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', StoreController.getStores);
router.get('/stores', StoreController.getStores);
router.get('/store/:id/edit', catchErrors(StoreController.editStore));
router.get('/add', StoreController.addStore);
router.post('/add', catchErrors(StoreController.createStore));
router.post('/add/:id', catchErrors(StoreController.updateStore));

module.exports = router;
