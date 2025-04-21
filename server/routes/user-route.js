const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth-route");

// SIGN UP
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, firstName, lastName, password, address } = req.body;

        // Check if username has at least 4 characters
        if (username.length < 4) {
            return res.status(400).json({ message: "Username must have at least 4 characters" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if password has at least 8 characters
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must have at least 8 characters" });
        }

        // Check password complexity: one uppercase letter, one lowercase letter and one digit
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

        if (!complexityRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter and one digit"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        // Check if firstName has at least 2 characters
        if (firstName.length < 2) {
            return res.status(400).json({ message: "First name must have at least 2 characters" });
        }

        // Check if lastName has at least 2 characters
        if (lastName.length < 2) {
            return res.status(400).json({ message: "Last name must have at least 2 characters" });
        }

        // Check if firstName and lastName contain only letters and the characters "-" and "'" (no spaces, numbers or special characters)
        const nameRegex = /^[A-Za-z'-]+$/;

        if (!nameRegex.test(firstName)) {
            return res.status(400).json({
                message: "First name may contain only letters and characters (-) or (')"
            });
        }

        if (!nameRegex.test(lastName)) {
            return res.status(400).json({
                message: "Last name may contain only letters and characters (-) or (')"
            });
        }

        const newUser = new User({
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashPassword,
            address: address
        });

        await newUser.save();
        return res.status(200).json({ message: "Sign Up Successfully" })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// SIGN IN (LOG IN)
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            res.status(400).json({ message: "Invalid username" });
        }

        bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    { name: existingUser.username },
                    { role: existingUser.role }
                ];

                const token = jwt.sign({ authClaims }, "bookStore123", {
                    expiresIn: "30d"
                });

                res.status(200).json({
                    id: existingUser._id,
                    role: existingUser.role,
                    token: token
                });

            } else {
                res.status(400).json({ message: "Invalid password" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET USER INFORMATION
router.get("/get-user-info", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// UPDATE ADDRESS
router.put("/update-address", authenticateToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;