const express = require("express");
const router = express.Router();

const {
    employeeLogin,
    employeeSignUp,
    getEmployeeByEmail
} = require("../controller/employeeController");

const {
    organizerLogin,
    organizerSignUp,
    getOrganizerByEmail
} = require("../controller/OrganizerController");

const {
    getAllHackathon,
    getHackathonActiveStatus,
    getHackathonPastStatus,
    getHackathonUpcomingStatus
} = require('../controller/hackathonController');

router.route("/login/employee").post(employeeLogin);
router.route("/signUp/employee").post(employeeSignUp);
router.route('/employee/profile').get(getEmployeeByEmail)


router.route("/login/organizer").post(organizerLogin);
router.route("/signUp/organizer").post(organizerSignUp);
router.route('/organizer/profile').get(getOrganizerByEmail)

router.route("/").get(getAllHackathon);

router.route("/hackathon/active").get(getHackathonActiveStatus);
router.route("/hackathon/past").get(getHackathonPastStatus);
router.route("/hackathon/upcoming").get(getHackathonUpcomingStatus);



module.exports = router;