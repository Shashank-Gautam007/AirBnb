const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const tripPlanner = require('../controllers/tripPlanner');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, tripPlanner.renderForm);
router.post('/', isLoggedIn, wrapAsync(tripPlanner.createPlan));

module.exports = router;