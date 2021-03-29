import { Router } from "express";
import {
  createInventaris,
  getAllInventaris,
  uploadImageBarang,
  generateKodeInventaris,
  nonaktifInventaris,
  pindahInventaris,
  deleteInventaris,
  getOneInventaris,
} from "../controllers/inventaris.controller";
import { protect } from "../controllers/auth.controller";
const router = Router();

router.use(protect);

router.get("/", getAllInventaris);
router.get("/:id", getOneInventaris);
router.post("/", uploadImageBarang, createInventaris);
router.delete("/:id", deleteInventaris);
router.post("/generate", generateKodeInventaris);
router.put("/pindah/:id", pindahInventaris);
router.put("/nonaktif/:id", nonaktifInventaris);

export default router;
