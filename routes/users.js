var express = require("express");
var router = express.Router();
let { validatedResult, CreateAnUserValidator, ModifyAnUserValidator } = require('../utils/validator')
let userModel = require("../schemas/users");
let userController = require('../controllers/users')
let { CheckLogin, CheckRole } = require('../utils/authHandler')
const ExcelJS = require('exceljs');
const crypto = require('crypto');
const mailHandler = require('../utils/mailHandler');
const roleModel = require('../schemas/roles');
const path = require('path');

router.post("/import", async function (req, res, next) {
  try {
    // Find the 'USER' role
    let userRole = await roleModel.findOne({ name: 'USER', isDeleted: false });
    if (!userRole) {
      userRole = await roleModel.findOne({ name: 'user', isDeleted: false });
    }
    
    if (!userRole) {
      userRole = new roleModel({ name: 'USER', description: 'Default user role' });
      await userRole.save();
    }

    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, '../user.xlsx');
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);
    const usersCreated = [];

    // Use a regular for loop to handle async/await correctly
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const username = row.getCell(1).value;
      let email = row.getCell(2).value;

      // Handle formula objects in email column
      if (email && typeof email === 'object' && email.result) {
        email = email.result;
      }

      if (username && email) {
        // Generate 16-char random password
        const password = crypto.randomBytes(8).toString('hex');

        try {
          const newUser = await userController.CreateAnUser(
            username,
            password,
            email,
            userRole._id,
            null, // session
            username, // fullName
            undefined, // avatarUrl
            true, // status
            0 // loginCount
          );

          // Send email
          await mailHandler.sendPassword(email, username, password);
          usersCreated.push({ username, email, password });
        } catch (err) {
          console.error(`Failed to create user ${username}:`, err.message);
        }
      }
    }

    res.send({ 
      message: "Import process completed", 
      count: usersCreated.length,
      users: usersCreated 
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get("/", CheckLogin,CheckRole("ADMIN", "USER"), async function (req, res, next) {
    let users = await userModel
      .find({ isDeleted: false })
    res.send(users);
  });

router.get("/:id", async function (req, res, next) {
  try {
    let result = await userModel
      .find({ _id: req.params.id, isDeleted: false })
    if (result.length > 0) {
      res.send(result);
    }
    else {
      res.status(404).send({ message: "id not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

router.post("/", CreateAnUserValidator, validatedResult, async function (req, res, next) {
  try {
    let newItem = await userController.CreateAnUser(
      req.body.username, req.body.password, req.body.email, req.body.role,
      req.body.fullName, req.body.avatarUrl, req.body.status, req.body.loginCount)
    res.send(newItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", ModifyAnUserValidator, validatedResult, async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedItem) return res.status(404).send({ message: "id not found" });

    let populated = await userModel
      .findById(updatedItem._id)
    res.send(populated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;