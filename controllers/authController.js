// const passport = require("passport");
// exports.authenticate = (req, res) => {
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   });
// };
// exports.authenticateCallBack = (req, res) => {
//   passport.authenticate("google", {
//     failureRedirect: "/",
//     successRedirect: "/dashboard",
//   });
// };
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const googleClient = require("../config/google");

const authController = {
  // Generate Google OAuth URL
  async getAuthUrl(req, res) {
    try {
      const url = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      });
      res.json({ url });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  },

  // Handle Google OAuth callback
  async googleCallback(req, res) {
    try {
      const { code } = req.query;

      // Exchange auth code for tokens
      const { tokens } = await googleClient.getToken(code);
      googleClient.setCredentials(tokens);

      // Get user info from Google
      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials(tokens);

      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const userData = await response.json();

      // Find or create user in our database
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          isAdmin: false, // Set admin status based on your requirements
        });
      }

      // Generate JWT
      const jwtToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set cookie and redirect to frontend
      res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Redirect to frontend with success parameter
      res.redirect(`${process.env.FRONTEND_URL}/auth-success`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/auth-error`);
    }
  },

  // Check authentication status
  async checkAuth(req, res) {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({ authenticated: false });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-__v");

      if (!user) {
        return res.status(401).json({ authenticated: false });
      }

      res.json({
        authenticated: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      res.status(401).json({ authenticated: false });
    }
  },

  // Logout
  async logout(req, res) {
    res.clearCookie("jwt");
    res.json({ success: true });
  },
};

module.exports = authController;
