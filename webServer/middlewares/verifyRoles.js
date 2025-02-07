const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("Allowed Roles:", allowedRoles);
        console.log("User Roles:", req.roles);

        // Ensure `req.roles` exists and is an object
        if (!req?.roles || typeof req.roles !== 'object') {
            console.error("No roles found or invalid structure on the request.");
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Convert `roles` object keys into an array
        const userRoles = Object.keys(req.roles);

        // Check if user has at least one allowed role
        const hasRole = userRoles.some(role => allowedRoles.includes(role));
        console.log("Has Role:", hasRole);

        if (!hasRole) {
            console.error("User does not have the required role.");
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

module.exports = { verifyRoles };
