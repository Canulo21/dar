const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Using environment variables for sensitive data
  password: "",
  database: "react_dar_land",
});

// Login API endpoint
app.post("/login", (req, res) => {
  // Extract username and password from the request body
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Fetch user data from the database based on the username
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify the password
    const user = results[0];
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // Password is correct, user is authenticated
      res.json({
        message: "Login successful",
        user: {
          id: user.user_id,
          username: user.username,
          fname: user.fname,
          lname: user.lname,
        },
      });
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// Admin registration
app.post("/register", async (req, res) => {
  const { fname, mname, lname, username, password } = req.body;

  if (!fname || !mname || !lname || !username || !password) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  try {
    // Check if the username already exists in the database
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Message: "Error" });
        }

        if (results.length > 0) {
          // If username already exists, return an error
          return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        const query =
          "INSERT INTO users (fname, mname, lname, username, password) VALUES (?, ?, ?, ?, ?)";

        db.query(
          query,
          [fname, mname, lname, username, hashedPassword],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ Message: "Error" });
            }
            return res.status(200).json({ Status: "Success" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ Message: "Error" });
  }
});

/******* For Land Owner **********/

// get LandOwnerDetails
app.get("/getLandOwner", async (req, res) => {
  const query = "SELECT * FROM landowners ORDER BY lname";
  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ Message: "Error" });
    }
    return res.json(data);
  });
});

app.post("/addLandOwner", (req, res) => {
  // Destructure the required fields from req.body
  const {
    landowner_cloa_title_no,
    landowner_lot_no,
    area_amended,
    fname,
    mname,
    lname,
    corporate_name,
    region,
    province,
    municipality,
    barangay,
    prog_type,
  } = req.body;

  if (
    !region ||
    !province ||
    !municipality ||
    !barangay ||
    !landowner_cloa_title_no ||
    !area_amended ||
    !prog_type
  ) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  // if cloa title no is already exist
  const title_no_query =
    "SELECT * FROM landowners WHERE landowner_cloa_title_no = ?";
  db.query(title_no_query, [landowner_cloa_title_no], (error, results) => {
    if (error) {
      console.error("Error checking existing data:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
    if (results.length > 0) {
      // If results are found, it means the title number already exists
      return res.status(409).json({ error: "CLOA Title No. already exists" });
    } else {
      // If title number is not found, proceed with the insertion
      const query =
        "INSERT INTO landowners (landowner_cloa_title_no, landowner_lot_no, area_amended, fname, mname, lname, corporate_name, region, province, municipality, barangay, prog_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          landowner_cloa_title_no,
          landowner_lot_no,
          area_amended,
          fname,
          mname,
          lname,
          corporate_name,
          region,
          province,
          municipality,
          barangay,
          prog_type,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          return res
            .status(200)
            .json({ status: "Success", insertedId: result.insertId });
        }
      );
    }
  });
});

// Remove a Member
app.delete("/deleteLandOwner/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM landowners WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});
// view a Land Owner Details
app.get("/viewLandOwner/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM landowners WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "Owner not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});
// for update Land Owner Details
app.put("/editLandOwner/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body;
  const {
    landowner_cloa_title_no,
    landowner_lot_no,
    area_amended,
    fname,
    mname,
    lname,
    corporate_name,
    region,
    province,
    municipality,
    barangay,
    prog_type,
  } = data;

  if (
    !region ||
    !province ||
    !municipality ||
    !barangay ||
    !landowner_cloa_title_no ||
    !area_amended ||
    !prog_type
  ) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "UPDATE landowners SET landowner_cloa_title_no=?, landowner_lot_no=?,fname=?, area_amended=?, mname=?, prog_type=?, lname=?, corporate_name=?,region =?, province=?, municipality=?,barangay=? WHERE id=?";

  db.query(
    query,
    [
      landowner_cloa_title_no,
      landowner_lot_no,
      fname,
      area_amended,
      mname,
      prog_type,
      lname,
      corporate_name,
      region,
      province,
      municipality,
      barangay,
      id,
    ],
    (queryError, result) => {
      if (queryError) {
        console.error("updateError", queryError);
        return res.status(500).json({
          error: "EP/CLOAT Title No. Is Already Exist",
          details: queryError.message,
        });
      }
      if (!result.affectedRows) {
        return res.status(404).json({
          error: "Not found.",
        });
      }

      return res.json({ updated: true, result });
    }
  );
});

/******* For ARBS connected to Land Owner **********/
// view Land Owner Details with Arbs
app.get("/LandOwner/Arbs/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT l.id, l.landowner_cloa_title_no, a.id AS arb_id, a.fname, a.mname, a.lname, a.gender, a.arb_cloa_title_no, a.arb_lot_no, a.arb_area_individual, a.date_registered FROM arbs a INNER JOIN landowners l ON l.landowner_cloa_title_no = a.landowner_cloa_title_no WHERE l.id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      // Send all the ARBs data back to the client
      res.status(200).json(result);
    }
  });
});

// view Arbs Details
app.get("/viewArb/:id", (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM arbs WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: "ARB not found" });
      } else {
        // Send the member data back to the client
        res.status(200).json(result[0]);
      }
    }
  });
});

// Add Arbs
app.post("/addArbs", (req, res) => {
  const {
    landowner_cloa_title_no,
    arb_cloa_title_no,
    arb_lot_no,
    arb_area_individual,
    date_registered,
    fname,
    mname,
    lname,
    gender,
  } = req.body;

  if (
    !arb_cloa_title_no ||
    !arb_lot_no ||
    !arb_area_individual ||
    !date_registered ||
    !fname ||
    !lname ||
    !gender
  ) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "Insert INTO arbs (landowner_cloa_title_no,arb_cloa_title_no,arb_lot_no,arb_area_individual,date_registered,fname,mname,lname, gender) VALUES (?,?,?,?,?,?,?,?,?) ";

  db.query(
    query,
    [
      landowner_cloa_title_no,
      arb_cloa_title_no,
      arb_lot_no,
      arb_area_individual,
      date_registered,
      fname,
      mname,
      lname,
      gender,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ Message: "Error" });
      }
      return res.status(200).json({ Status: "Success" });
    }
  );
});

// delete Arbs record
app.delete("/deleteArb/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM arbs WHERE id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.status(200).json({ message: "Data deleted successfully" });
    }
  });
});

// update Arb
app.put("/editArb/:id", (req, res) => {
  const id = req.params.id;
  const { data } = req.body;
  const {
    arb_cloa_title_no,
    arb_lot_no,
    arb_area_individual,
    date_registered,
    fname,
    mname,
    lname,
    gender,
  } = data;

  if (
    !arb_cloa_title_no ||
    !arb_lot_no ||
    !arb_area_individual ||
    !date_registered ||
    !fname ||
    !lname ||
    !gender
  ) {
    return res.status(400).json({
      error: "Bad Request",
      details: "All fields are required",
    });
  }

  const query =
    "UPDATE arbs SET arb_cloa_title_no=?, arb_lot_no=?, arb_area_individual=?, date_registered=?, fname=?, mname=?, lname=?, gender=? WHERE id=?";

  db.query(
    query,
    [
      arb_cloa_title_no,
      arb_lot_no,
      arb_area_individual,
      date_registered,
      fname,
      mname,
      lname,
      gender,
      id,
    ],
    (queryError, result) => {
      if (queryError) {
        console.error("updateError", queryError);
        return res.status(500).json({
          error: "Bad Request",
          details: queryError.message,
        });
      }
      if (!result.affectedRows) {
        return res.status(404).json({
          error: "Not found.",
        });
      }

      return res.json({ updated: true, result });
    }
  );
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
