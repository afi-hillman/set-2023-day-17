import { Router } from "express";
import userController from "../controllers/users";
import authController from "../controllers/auth";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import contentController from "../controllers/content";

const apiRoutes = Router();

apiRoutes.get("/users", isAuthenticated, isAdmin, userController.getAllUsers);
apiRoutes.get(
  "/users/:username",
  isAuthenticated,
  userController.getSingleUser
);
// apiRoutes.post("/update", userController.update);
// apiRoutes.put("/users", userController.update);
// apiRoutes.put("/users", isAuthenticated, userController.update);
apiRoutes.post("/register", authController.register);
apiRoutes.post("/login", authController.login);
apiRoutes.get("/logout", isAuthenticated, authController.logout);

// posts,comments
apiRoutes.get("/posts", contentController.getAllPosts);
apiRoutes.get("/posts/:slug", contentController.getSinglePost);
apiRoutes.post("/create-post", contentController.insertPost);

export default apiRoutes;
