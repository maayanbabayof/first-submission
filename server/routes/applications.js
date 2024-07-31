const express = require("express");
const {
  applyToApplication,
  updateApplicationStatus,
} = require("../controller/applicationsController");
const { getUserApplications } = require("../controller/usersController");
const router = express.Router();

router.post("/apply", applyToApplication);
router.post("/user/:id", getUserApplications);
router.post("/update/:id", updateApplicationStatus);

module.exports = router;
