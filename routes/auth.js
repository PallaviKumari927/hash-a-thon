const express = require("express");
const router = express.Router();

const {employeeLogin,employeeSignUp,getEmployeeByEmail} = require("../controller/employeeController");
const {organizerLogin,organizerSignUp,getOrganizerByEmail} = require("../controller/OrganizerController");

router.route("/login/employee").post(employeeLogin);
router.route("/signUp/employee").post(employeeSignUp);
router.route('/employee/profile').get(getEmployeeByEmail)


router.route("/login/organizer").post(organizerLogin);
router.route("/signUp/organizer").post(organizerSignUp);
router.route('/organizer/profile').get(getOrganizerByEmail)


module.exports = router;