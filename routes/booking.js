const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

router.post("/", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/booked-dates", wrapAsync(bookingController.getBookedDates));
router.delete("/:id", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;