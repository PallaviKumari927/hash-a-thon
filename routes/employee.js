const express = require("express");
const router = express.Router();

const {updateEmployee,deleteEmployee,getAllParticipatedHackathons} = require("../controller/employeeController");


router.route('/profile/update').patch(updateEmployee)
router.route('/profile/delete').delete(deleteEmployee)

router.route('/hackathon/participated').get(getAllParticipatedHackathons)

module.exports = router;
