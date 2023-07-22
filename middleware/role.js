const checkOrganizerRole = (req, res, next) => {

    if (req.user.role === 'company' || req.user.role === 'admin') {
        next();
    } else {
        const error = new Error('Access denied. Only users with the role "company" or "Admin" can access this route.');
        error.statusCode = 403;
        next(error);
    }
};

const checkEmployeeRole = (req, res, next) => {

    if (req.user.role === 'employee' || req.user.role === 'admin') {
        next();
    } else {
        const error = new Error('Access denied. Only users with the role "employee" or "Admin" can access this route.');
        error.statusCode = 403;
        next(error);
    }
};
module.exports = {
    checkOrganizerRole,
    checkEmployeeRole
};