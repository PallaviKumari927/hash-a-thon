const express = require("express");
const router = express.Router();

const {signIn,signUp} = require("../controller/employeeController");

router.route("/signIn").post(signIn);
router.route("/signUp").post(signUp);

module.exports = router;
