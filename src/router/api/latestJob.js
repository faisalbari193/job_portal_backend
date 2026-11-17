const Express = require("express");
const {
  createJobPostController,
  getAllJobPostsController,
  updateJobPostController,
  deleteJobPostController,
} = require("../../controller/latestJob.controller");
const router = Express.Router();
router.post("/latestJob", createJobPostController);
router.get("/latestJob", getAllJobPostsController);
router.put("/latestJob/:id", updateJobPostController);
router.delete("/latestJob/:id", deleteJobPostController);
module.exports = router;
