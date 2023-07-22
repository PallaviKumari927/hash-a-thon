const express = require("express");
const router = express.Router();

const { updateOrganizer, deleteOrganizer } = require("../controller/OrganizerController");

router.route('/profile/update').patch(updateOrganizer)
router.route('/profile/delete').delete(deleteOrganizer)

module.exports = router;