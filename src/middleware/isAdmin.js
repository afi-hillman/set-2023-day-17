import jwt from "jsonwebtoken";
import config from "../config";
import query from "../database";

async function isAdmin(req, res, next) {
  const data = await query("SELECT is_admin FROM users WHERE id = $1", [
    req.user.id,
  ]);
  //   console.log("WTF", data);
  const user = data.rows[0];
  console.log(data.rows[0]);
  if (user.is_admin === true) {
    next();
  } else {
    return res.status(401).json({
      message: "User is not an admin, permission to pass is denied!",
    });
  }
}

export default isAdmin;
