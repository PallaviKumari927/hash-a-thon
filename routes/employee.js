const express = require("express");
const router = express.Router();

const {signIn,signUp,getAllParticipatedHackathons} = require("../controller/employeeController");

router.route("/signIn").post(signIn);
router.route("/signUp").post(signUp);

router.route('/hackathon/participated').get(getAllParticipatedHackathons)

module.exports = router;
