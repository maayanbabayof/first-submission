const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.body.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied." });
    }
  };
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE tbl_119_APPLICATIONS SET status = ? WHERE applicationID = ?`,
      [status, id]
    );

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Application status updated successfully." });
    } else {
      res.status(404).json({ error: "Application not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update application." });
  }
};

const applyToApplication = async (req, res) => {
  const { volunteerId, farmerId, opportunityID } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO tbl_119_APPLICATIONS (farmerID, volunteerID, opportunityID, status) VALUES (?, ?, ?, 'pending')`,
      [farmerId, volunteerId, opportunityID]
    );

    res.status(201).json({
      message: "Application created successfully.",
      applicationID: result.insertId,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to create application." });
  }
};

module.exports = {
  checkRole,
  updateApplicationStatus,
  applyToApplication,
};
