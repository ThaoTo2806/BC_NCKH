const express = require("express");
const DegreeController = require("../controllers/degreeController");
const multer = require("multer"); // Thêm dòng này
const upload = multer({ storage: multer.memoryStorage() }); // Thêm dòng này
const verifyIdentity = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", DegreeController.getDegrees);

// router.post("/", DegreeController.upload, DegreeController.createDegree);

router.put("/:id", verifyIdentity, DegreeController.UpdateDegree);
// router.post("/", DegreeController.upload, DegreeController.createDegree);

router.get("/:id", verifyIdentity, DegreeController.getDegreeDetail);
// router.post(
//     "/upload-degree",
//     upload.fields([{ name: "front" }, { name: "back" }]),git
//     DegreeController.uploadDegree
// );

// Tạo mới một bằng cấp
router.post(
    "/",
    verifyIdentity,
    DegreeController.upload,
    DegreeController.createDegree
);

// Duyệt bằng cấp
router.put(
    "/:degreeId/approve",
    verifyIdentity,
    DegreeController.approveDegreeLevel2
);

router.patch(
    "/updateTimeQuery/:id",
    verifyIdentity,
    DegreeController.UpdateDegreeQueryTime
);

// Từ chối bằng cấp
// router.put("/:degreeId/reject", DegreeController.rejectDegree);

// Lấy danh sách bằng cấp đang chờ duyệt
router.get("/pending", verifyIdentity, DegreeController.getPendingDegrees);

// Lấy danh sách bằng cấp đang chờ duyệt hàng loạt
router.get(
    "/batch/pending",
    verifyIdentity,
    DegreeController.getPendingBatchApprovals
);

// Duyệt hàng loạt bằng cấp
router.post(
    "/batch/approve",
    verifyIdentity,
    DegreeController.approveBatchDegrees
);

// Kiểm tra trạng thái xử lý lô
router.get(
    "/batch/:batchId/status",
    verifyIdentity,
    DegreeController.getBatchStatus
);

router.get("/:id/qrcode", DegreeController.generateDegreeQRCode);
router.get("/:id/qrcode1", DegreeController.generateDegreeQRCode1);

module.exports = router;
