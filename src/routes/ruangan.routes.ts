import { Router } from "express";
import {
  createRuangan,
  deleteRuangan,
  getAllRuangan,
  getOneRuangan,
  updateRuangan,
} from "../controllers/ruang.controller";
// import { protect } from "../controllers/auth.controller";
const router = Router();

router.get("/", getAllRuangan);
router.post("/", createRuangan);
router.get("/:id", getOneRuangan);
router.put("/:id", updateRuangan);
router.delete("/:id", deleteRuangan);

export default router;
