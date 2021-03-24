import { Router } from "express";
import { createBarang, deleteBarang, getAllBarang, updateBarang } from "../controllers/barang.controller";
import { protect } from "../controllers/auth.controller";
const router = Router();

router.use(protect);

router.get("/", getAllBarang);
router.post("/", createBarang);
router.delete("/", deleteBarang);
router.put("/:id", updateBarang);

export default router;
