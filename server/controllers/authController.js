const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    // 3. Validate account role
const selectedRole = role || "customer";

if (!["customer", "worker", "admin"].includes(selectedRole)) {
  return res.status(400).json({
    message: "Invalid account type",
  });
}

// Admin registration requires a secret code
if (selectedRole === "admin") {
  const { adminCode } = req.body;

  if (!adminCode || adminCode !== process.env.ADMIN_REGISTER_CODE) {
    return res.status(403).json({
      message: "Invalid admin registration code",
    });
  }
}

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in MongoDB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: role || "customer",
    });

    // 5. Send response (never send password)
    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // 2. Find user in MongoDB
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare entered password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Return token and user details
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

module.exports = { registerUser, loginUser };