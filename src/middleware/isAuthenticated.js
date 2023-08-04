import config from "../config";

const isAuthenticated = (req, res, next) => {
  if (req.session.auth) {
    req.user = req.session.auth;
    next();
  } else {
    return res.status(401).json({ message: "unauthorized!" });
  }
};

export default isAuthenticated;
