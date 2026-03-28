var express = require("express");
var router = express.Router();

let roleModel = require("../schemas/roles");


router.get("/", async function (req, res, next) {
    let roles = await roleModel.findAll({ where: { isDeleted: false } });
    res.send(roles);
});


router.get("/:id", async function (req, res, next) {
    try {
        let result = await roleModel.findOne({ where: { id: req.params.id, isDeleted: false } });
        if (result) {
            res.send(result);
        }
        else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});


router.post("/", async function (req, res, next) {
    try {
        let newItem = await roleModel.create({
            name: req.body.name,
            description: req.body.description
        });
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let [updatedRowsCount] = await roleModel.update(req.body, { where: { id: id } });
        if (updatedRowsCount === 0) {
            return res.status(404).send({ message: "id not found" });
        }
        let updatedItem = await roleModel.findByPk(id);
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let [updatedRowsCount] = await roleModel.update(
            { isDeleted: true },
            { where: { id: id } }
        );
        if (updatedRowsCount === 0) {
            return res.status(404).send({ message: "id not found" });
        }
        res.send({ message: "deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;
