const express = require("express");
const router = express.Router();
const db = require("../../db");
const { encodeName } = require("../../utils");

function getTree(files) {
  const tree = {};

  for (let file of files) {
    const parts = file.filepath.split("\\");

    let folderPath = "";
    let sub = tree;
    let prev;
    let i = 0;

    for (let part of parts) {
      folderPath += `${part}/`;

      if (i === parts.length - 1) {
        prev.files = [...(prev.files || []), { ...file, id: file.$loki }];
        break;
      }

      if (!sub[part]) {
        sub[part] = {
          id: encodeName(folderPath.substring(0, folderPath.length - 1)),
          files: [],
        };

        sub[part].folders = {};
      }

      prev = sub[part];
      sub = sub[part].folders;
      i++;
    }
  }

  return {
    root: {
      folders: tree,
    },
  };
}

router.get("/", (req, res) => {
  const filesCollection = db.getCollection("files");
  const files = filesCollection.find();
  const dirTree = getTree(files);
  res.json(dirTree);
});

module.exports = router;
