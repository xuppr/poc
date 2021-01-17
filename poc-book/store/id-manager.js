const fs = require("fs");
const path = require("path");
const ID_FILE_PATH = path.join(__dirname, 'id.json');

function newId() {
  const currentId = getId();
  const newId = currentId + 1;
  writeId(newId);
  return newId;
}

function resetId() {
  writeId(0);
}

function getId() {
  try {
    return JSON.parse(fs.readFileSync(ID_FILE_PATH)).id;
  } catch (err) {
    throw new Error("error reading id file.");
  }
}

function writeId(newId) {
  const data = JSON.stringify({ id: newId });
  fs.writeFileSync(ID_FILE_PATH, data);
}
module.exports = { newId, resetId };
