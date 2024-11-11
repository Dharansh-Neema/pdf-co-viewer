const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:5000/auth/google");
};

module.exports = ensureAuthenticated;
