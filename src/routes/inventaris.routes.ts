import { Router } from "express";
import {
  createInventaris,
  getAllInventaris,
  uploadImageBarang,
  generateKodeInventaris,
} from "../controllers/inventaris.controller";
import { protect } from "../controllers/auth.controller";
const router = Router();

router.use(protect);

router.get("/", getAllInventaris);
router.post("/", uploadImageBarang, createInventaris);
router.post("/generate", generateKodeInventaris);

export default router;
