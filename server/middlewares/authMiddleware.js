import express from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

const protectRoute = (req, res, next) => {
  try {
    let token = req.cookie.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const response = UserModel.find(decoded.userId).select("isAdmin email");

      req.user = {
        email: response.email,
        isAdmin: response.isAdmin,
        userId: decoded.userId,
      };
      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && res.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { isAdminRoute, protectRoute };