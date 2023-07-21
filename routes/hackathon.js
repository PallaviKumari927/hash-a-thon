const express = require("express");
const router = express.Router();

const {getAllHackathon,addHackathon,deleteHackathon,updateHackathon,addParticipate,searchHackathon} = require("../controller/hackathonController");

router.route("/").get(getAllHackathon);
router.route("/").post(addHackathon);
router.route("/:id").delete(deleteHackathon);
router.route("/:id").patch(updateHackathon);
router.route("/:id/participate").post(addParticipate)

router.route("/hackathon").get(searchHackathon)

module.exports = router;
