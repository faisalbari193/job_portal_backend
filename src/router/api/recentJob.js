const Express = require("express");
const {
  createRecentJobController,
  getRecentJobController,
  updateRecentJobController,
  deleteRecentJobController,
} = require("../../controller/recentJob.controller");
const router = Express.Router();
router.post("/create-recent-job", createRecentJobController);
router.get("/get-recent-job", getRecentJobController);
router.put("/update-recent-job/:id", updateRecentJobController);
router.delete("/delete-recent-job/:id", deleteRecentJobController);
module.exports = router;
