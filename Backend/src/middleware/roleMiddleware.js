/**
 * Role authorization middleware.
 * Restricts access to specific user roles.
 * Must be used after authMiddleware has populated req.user.
 * 
 * @param {...string} roles - The list of roles authorized to access the route.
 */
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Authentication is required before authorization.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Access is restricted to these roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export default allowRoles;
