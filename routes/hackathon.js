const express = require("express");
const router = express.Router();

const {getAllHackathon,addHackathon,deleteHackathon,updateHackathon} = require("../controller/hackathonController");

router.route("/").get(getAllHackathon);
router.route("/").post(addHackathon);
router.route("/:id").delete(deleteHackathon);
router.route("/:id").patch(updateHackathon);

module.exports = router;
