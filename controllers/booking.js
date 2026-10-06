const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Helper function: It checks whether the dates overlap or not.
const isDateOverlapping = async (listingId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    listing: listingId,
    status: { $ne: "cancelled" },
    $or: [
      { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
      { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
      { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlapping = await Booking.findOne(query);
  return overlapping !== null;
};

// create a new booking
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing nahi mili");
    return res.redirect("/listings");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Basic date validation
  if (checkInDate >= checkOutDate) {
    req.flash("error", "The check-out date must be after the check-in date!");
    return res.redirect(`/listings/${id}`);
  }

  // Past date check
  if (checkInDate < new Date().setHours(0, 0, 0, 0)) {
    req.flash("error", "The check-in date must be today or a future date!");
    return res.redirect(`/listings/${id}`);
  }

  // Overlap check
  const hasOverlap = await isDateOverlapping(id, checkInDate, checkOutDate);
  if (hasOverlap) {
    req.flash("error", "These dates are already booked. Please try different dates!");
    return res.redirect(`/listings/${id}`);
  }

  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * listing.price;

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalPrice,
  });

  await newBooking.save();
  req.flash("success", "Booking has been confirmed!");
  res.redirect(`/listings/${id}`);
};

// shows the all bookings of user
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/index", { bookings });
};

// cancel the booking
module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking nahi mili");
    return res.redirect("/listings");
  }

  // cancel can be our booking
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "Aap yeh booking cancel nahi kar sakte");
    return res.redirect("/bookings/my-bookings");
  }

  booking.status = "cancelled";
  await booking.save();

  req.flash("success", "Booking cancel kar di gayi");
  res.redirect("/bookings/my-bookings");
};

//return already book dates any listing for frontend
module.exports.getBookedDates = async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({
    listing: id,
    status: { $ne: "cancelled" },
  }).select("checkIn checkOut -_id");

  res.json(bookings);
};