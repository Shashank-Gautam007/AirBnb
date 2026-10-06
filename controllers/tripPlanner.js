const { generateTripPlan } = require('../utils/aiService');

module.exports.renderForm = (req, res) => {
  res.render('tripPlanner/form');
};

module.exports.createPlan = async (req, res) => {
  const { destination, days, preferences, budget, language } = req.body;
  const plan = await generateTripPlan(destination, days, preferences, budget, language);
  res.render('tripPlanner/result', { plan, destination, days });
};