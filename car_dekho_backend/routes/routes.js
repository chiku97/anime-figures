import routers from "express";
import {
	getAllCars,
	getFilteredCars,
	getCarById,
	getAiRecommendedCars,
} from "../controllers/car.controller.js";
import {
	saveContactRequest,
	getContactRequests,
	deleteContactRequest,
} from "../controllers/contact.controller.js";

const router = routers.Router();

router.get("/home", getAllCars);
router.get("/get-filtered-cars", getFilteredCars);
router.post("/ai-recommended-cars", getAiRecommendedCars);
router.get("/car/:id", getCarById);

// Contact routes
router.post("/contact-seller", saveContactRequest);
router.get("/contact-requests", getContactRequests);
router.delete("/contact-requests/:id", deleteContactRequest);

export default router;