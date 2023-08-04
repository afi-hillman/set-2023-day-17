import query from "../../database";
import bcrypt from "bcryptjs";

async function register(req, res) {
  // receieve data from body
  const { email, username, password } = req.body;
  const is_admin = req.body?.is_admin ? true : false;

  // hashed password data from body
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await query(
    "INSERT INTO users (email, username, password, is_admin) VALUES ($1, $2, $3, $4)",
    [email, username, hashedPassword, is_admin]
  )
    .then(function (resDb) {
      res.status(200).json({ message: "user created" });
    })
    .catch(function (errDb) {
      res.status(500).json({ message: "server error!", error: errDb });
    });
}

async function login(req, res) {
  const { identifier, password } = req.body;
  const data = await query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [identifier]
  );
  const [user] = data.rows;
  if (!user) {
    res
      .status(400)
      .json({ message: "login unsucessful!", error: "invalid credentials!" });
    return;
  }

  // compare hashed password
  bcrypt.compare(password, user.password, (error, bcryptRes) => {
    if (bcryptRes) {
      req.session.auth = user.id;
      const serverRes = {
        message: "Login successful!",
        data: user,
        session: req.session,
      };
      res.status(200).json(serverRes);
    } else {
      const serverRes = {
        message: "login unsuccessful",
        error: "invalid credentials",
        data: error,
      };
      res.status(401).json(serverRes);
    }
  });
}

async function logout(req, res) {
  const session = req.session.destroy();
  console.log(session);
  res.status(200).json({ message: "logout successful!" });
}

const authController = { register, login, logout };
export default authController;
