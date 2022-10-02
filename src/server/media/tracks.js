const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/:id", (req, res) => {
  const id = +req.params.id;

  if (isNaN(id)) {
    res.sendStatus(404).send();
  }

  const file = db.files.getTrackById(id);

  if (!file) {
    res.sendStatus(404).send();
  } else {
    res.sendFile(file.filepath);
  }
});

module.exports = router;
