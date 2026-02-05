const User = require("../models/User");
const { Parser } = require("json2csv");

// ✅ Create User
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const profileImage = req.file ? req.file.filename : "";

    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
      profileImage,
    });

    res.status(201).json({ success: true, message: "User created", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Users (Pagination)
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update User
exports.updateUser = async (req, res) => {
  try {
    const profileImage = req.file ? req.file.filename : null;

    const updateData = { ...req.body };
    if (profileImage) updateData.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Search Users
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const regex = new RegExp(q.trim(), "i");

    const filter = {
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { mobile: regex },
        { location: regex },
         {
      $expr: {
        $regexMatch: {
          input: { $concat: ["$firstName", " ", "$lastName"] },
          regex: q.trim(),
          options: "i",
        },
      },
    },
      ],
    };

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Export Users to CSV
exports.exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const fields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "gender",
      "status",
      "location",
      "profileImage",
      "createdAt",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
