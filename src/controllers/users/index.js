import query from "../../database";
import config from "../../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { async } from "regenerator-runtime";

async function getAllUsers(req, res) {
  const data = await query("SELECT * from users");
  const users = data.rows;

  res.status(200).json({ users });
}

async function getSingleUser(req, res) {
  const username = req.params.username;
  const data = await query("SELECT * from users WHERE username = $1 ", [
    username,
  ]);
  const user = data.rows;
  if (user.length === 0) {
    res.status(400).json({ message: "user not found" });
  } else {
    res.status(200).json({ user });
  }
}

// async function update(req, res) {
//   console.log(req.body);
//   const data = await query("SELECT * FROM users");
//   console.log("list of accounts:", data.rows[0].username);

// try {
//   const newUsername = req.body.newUsername;
//   const data = await query(
//     "UPDATE users SET username = $1 WHERE username = $2",
//     [newUsername, req.user.id]
//   );
//   if (data.rowCount === 0) {
//     return res.status(404).json({ message: "User not found!" });
//   } else {
//     req.user.username = newUsername;
//     res.status(200).json({ message: "Username updated!", newUsername });
//   }
// } catch (error) {
//   console.error("Error updating username:", error);
//   res.status(500).json({ message: "Error updating username!" });
// }
const userController = {
  getAllUsers,
  getSingleUser,
};
// const userController = { getAllUsers, getSingleUser, update };
export default userController;
