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
    getAllParticipate,
    getParticipateBasedOnFilter
} = require("../controller/hackathonController");

const {
    checkOrganizerRole,
    checkEmployeeRole
} = require('../middleware/role');


router.route("/").post(checkOrganizerRole, addHackathon);
router.route("/:id").delete(checkOrganizerRole, deleteHackathon);
router.route("/:id").patch(checkOrganizerRole, updateHackathon);

router.route("/:id/participate").post(checkEmployeeRole,addParticipate)
router.route("/:id/participate").get(checkOrganizerRole,getParticipate)
router.route("/participates").get(checkOrganizerRole,getAllParticipate)

router.route("/hackathon").get(searchHackathon)
router.route("/organizer/:hackathonId/participants").get(getParticipateBasedOnFilter)

module.exports = router;
