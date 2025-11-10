const authorizeUser = (roles) => {
    return (req, res, next) => {
        if(roles.includes(req.role)) {
            next();
        } else {
            res.status(403).json({ error: "You are not admin/owner" });
        }
    }
}

module.exports = authorizeUser;