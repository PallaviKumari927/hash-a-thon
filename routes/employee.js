const express = require("express");
const router = express.Router();

const {
    updateEmployee,
    deleteEmployee,
    getAllParticipatedHackathons
} = require("../controller/employeeController");

const {
    checkOrganizerRole,
    checkEmployeeRole
} = require('../middleware/role');

router.route('/profile/update').patch(checkEmployeeRole,updateEmployee)
router.route('/profile/delete').delete(checkEmployeeRole,deleteEmployee)

router.route('/hackathon/participated').get(checkEmployeeRole,getAllParticipatedHackathons)

module.exports = router;
