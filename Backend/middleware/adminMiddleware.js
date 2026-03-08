module.exports = function (req, res, next) {

  // Check if user exists (from authMiddleware)
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  // Check role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
};