import { Router } from "express";
import userController from "../controllers/users";
import authController from "../controllers/auth";
import isAuthenticated from "../middleware/isAuthenticated";
import isAdmin from "../middleware/isAdmin";
import postController from "../controllers/content/post";
import commentController from "../controllers/content/comment";

const apiRoutes = Router();

apiRoutes.get("/users", isAuthenticated, isAdmin, userController.getAllUsers);
apiRoutes.get(
  "/users/:username",
  isAuthenticated,
  userController.getSingleUser
);

apiRoutes.put("/users/update", isAuthenticated, userController.updateUser);
apiRoutes.post("/register", authController.register);
apiRoutes.post("/login", authController.login);
apiRoutes.get("/logout", isAuthenticated, authController.logout);

// posts
apiRoutes.get("/posts", isAuthenticated, postController.getAllPosts);
apiRoutes.get("/posts/:slug", isAuthenticated, postController.getSinglePost);
apiRoutes.post("/create-post", isAuthenticated, postController.insertPost);

// comments
apiRoutes.get(
  "/posts/:slug/comments",
  isAuthenticated,
  commentController.getPostWithComments
);
apiRoutes.post(
  "/posts/:slug/create-comment",
  isAuthenticated,
  commentController.insertComment
);
// apiRoutes.get(
//   "/posts/comments/:slug",
//   isAuthenticated,
//   contentController.getSingleComment
// );
// apiRoutes.put(
//   "/posts/:slug/edit-comment",
//   isAuthenticated,
//   commentController.editComment
// );

export default apiRoutes;
