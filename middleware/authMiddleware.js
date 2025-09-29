import jwt from "jsonwebtoken";

export const protect = (roles = []) => {
  return (req, res, next) => {
    console.log("Protect middleware triggered");
    const token = req.cookies.token;

    console.log("Cookies:", req.cookies);

    if (!token) return res.status(401).json({ error: "Not authorised" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
