import { Router } from "express";
import userController from "../controllers/users";
import authController from "../controllers/auth";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";

const apiRoutes = Router();

apiRoutes.get("/users", isAuthenticated, isAdmin, userController.getAllUsers);
apiRoutes.get(
  "/users/:username",
  isAuthenticated,
  userController.getSingleUser
);
// apiRoutes.post("/update", userController.update);
apiRoutes.put("/users", userController.update);
// apiRoutes.put("/users", isAuthenticated, userController.update);
apiRoutes.post("/register", authController.register);
apiRoutes.post("/login", authController.login);

export default apiRoutes;
