const express = require("express");
const router = express.Router();


const {
    getAllHackathon,
    addHackathon,
    deleteHackathon,
    updateHackathon,
    addParticipate,
    searchHackathon,
    getParticipate,
    getAllParticipate
} = require("../controller/hackathonController");

const {
    checkOrganizerRole,
    checkEmployeeRole
} = require('../middleware/role');

router.route("/").get(getAllHackathon);
router.route("/").post(checkOrganizerRole, addHackathon);
router.route("/:id").delete(checkOrganizerRole, deleteHackathon);
router.route("/:id").patch(checkOrganizerRole, updateHackathon);

router.route("/:id/participate").post(addParticipate)
router.route("/:id/participate").get(getParticipate)
router.route("/participates").get(getAllParticipate)

router.route("/hackathon").get(searchHackathon)


module.exports = router;
