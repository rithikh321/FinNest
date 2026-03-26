const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const db     = require("../config/db");

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ error: "User not found" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: {
      id:         user.id,
      name:       user.name,
      email:      user.email,
      occupation: user.occupation,
      avatar_color: user.avatar_color,
    },
  });
};

exports.getMe = (req, res) => {
  const user = db.prepare(
    "SELECT id, name, email, occupation, avatar_color FROM users WHERE id = ?"
  ).get(req.user.id);
  res.json(user);
};
