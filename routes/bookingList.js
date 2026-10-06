const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));

module.exports = router;