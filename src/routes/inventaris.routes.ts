import { Router } from "express";
import {
  createInventaris,
  getAllInventaris,
  uploadImageBarang,
  generateKodeInventaris,
  nonaktifInventaris,
  pindahInventaris,
} from "../controllers/inventaris.controller";
import { protect } from "../controllers/auth.controller";
const router = Router();

router.use(protect);

router.get("/", getAllInventaris);
router.post("/", uploadImageBarang, createInventaris);
router.post("/generate", generateKodeInventaris);
router.put("/pindah/:id", pindahInventaris);
router.put("/nonaktif/:id", nonaktifInventaris);

export default router;
