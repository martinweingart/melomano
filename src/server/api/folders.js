const express = require("express");
const router = express.Router();
const db = require("../../db");
const { isExtensionValid } = require("../../utils");

function getTree(files) {
  const tree = {};

  for (let file of files) {
    const parts = file.filepath.split("\\");

    let folderPath = "";
    let sub = tree;
    let prev;

    for (let part of parts) {
      folderPath += `${part}/`;

      if (part.indexOf(".mp3") !== -1) {
        prev.files = [...(prev.files || []), file];
        break;
      }

      if (!sub[part]) {
        sub[part] = {
          id: folderPath.substring(0, folderPath.length - 1),
          files: [],
        };

        sub[part].folders = {};
      }

      prev = sub[part];
      sub = sub[part].folders;
    }
  }

  return tree;
}

router.get("/", (req, res) => {
  const filesCollection = db.getCollection("files");
  const files = filesCollection.find();
  const dirTree = getTree(files);
  res.json(dirTree);
});

module.exports = router;
