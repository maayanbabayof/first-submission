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
    console.log("User role:", userRole);
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: "Access denied." });
    }
  };
};

const getOpportunities = async (req, res) => {
  try {
    console.log(pool.user, pool.password);
    const [rows] = await pool.query("SELECT * FROM tbl_119_OPPORTUNITY");
    console.log("Opportunities fetched:", rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching opportunities:", err);
    res.status(500).json({ error: "Failed to fetch opportunities." });
  }
};

const getOpportunityById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tbl_119_OPPORTUNITY WHERE opportunity = ?",
      [id]
    );
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "Opportunity not found" });
    }
  } catch (err) {
    console.error("Error fetching opportunity:", err);
    res.status(500).json({ error: "Failed to fetch opportunity." });
  }
};

const createOpportunity = async (req, res) => {
  const { userID, title, region, city, img, date, description } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO tbl_119_OPPORTUNITY (userID, title, region, city, img, date, description, rate, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)",
      [userID, title, region, city, img, date, description]
    );
    res
      .status(201)
      .json({
        id: result.insertId,
        userID,
        title,
        region,
        city,
        img,
        date,
        description,
      });
  } catch (err) {
    console.error("Error creating opportunity:", err);
    res.status(500).json({ error: "Failed to create opportunity." });
  }
};

async function deleteOpportunity(req, res) {
  const { id } = req.params;

  try {
    // Delete related records in tbl_119_APPLICATIONS
    await pool.query('DELETE FROM tbl_119_APPLICATIONS WHERE opportunityID = ?', [id]);

    // Delete the opportunity
    const [result] = await pool.query('DELETE FROM tbl_119_OPPORTUNITY WHERE opportunity = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
}
const updateOpportunity = async (req, res) => {
  const { id } = req.params;
  const { title, region, city, date, description } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE tbl_119_OPPORTUNITY SET title = ?, region = ?, city = ?, date = ?, description = ? WHERE opportunity = ?",
      [title, region, city, date, description, id]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Opportunity updated successfully." });
    } else {
      res.status(404).json({ error: "Opportunity not found." });
    }
  } catch (err) {
    console.error("Error updating opportunity:", err);
    res.status(500).json({ error: "Failed to update opportunity." });
  }
};

module.exports = {
  checkRole,
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
};
