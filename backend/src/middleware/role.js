module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ success: false, message: "دسترسی شما غیر مجاز می‌باشد" });
    }
    console.log((req.user.role), "نقش کاربر")
    console.log(allowedRoles)
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "شما اجازه دسترسی به این بخش را ندارید",
        });
    }
    next();
  };
};
