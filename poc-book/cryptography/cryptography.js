const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const homeDir = require("os").homedir();

const idManager = require("../store/id-manager");

const poc_dir = path.join(homeDir, ".poc");

// const PASS_FILE_PATH = path.resolve("cryptography/passphrase.json");
const PASS_FILE_PATH = path.join(poc_dir, "passphrase.json");
const TEST_PHRASE = "hello world";
const algorithm = "aes-256-ctr";

// #### public #####
function initializePassphrase(pin) {
  fs.mkdirSync(poc_dir);
  idManager.resetId(0);
  const data = JSON.stringify(encrypt(TEST_PHRASE, pin));
  fs.writeFileSync(PASS_FILE_PATH, data);
}

function validatePin(pin) {
  const passphrase = getPassphrase();
  return (
    passphrase.content ===
    encryptWithIv(TEST_PHRASE, pin, Buffer.from(passphrase.iv, "hex")).content
  );
}

function isPassphraseInitialized() {
  try {
    const pass = fs.readFileSync(PASS_FILE_PATH);
    return pass !== "";
  } catch (err) {
    return false;
  }
}

function encrypt(strToEncrypt, pin) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, generateKey(pin), iv);

  const encrypted = Buffer.concat([
    cipher.update(strToEncrypt),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function decrypt(hash, pin) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    generateKey(pin),
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

// ################

function encryptWithIv(strToEncrypt, pin, iv) {
  const cipher = crypto.createCipheriv(algorithm, generateKey(pin), iv);

  const encrypted = Buffer.concat([
    cipher.update(strToEncrypt),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function getPassphrase() {
  try {
    return JSON.parse(fs.readFileSync(PASS_FILE_PATH));
  } catch (err) {
    throw err;
  }
}

function generateKey(pin) {
  const hash = crypto.createHash("sha256");

  hash.update(String(pin));

  return hash.digest("base64").substr(0, 32);
}

module.exports = {
  initializePassphrase,
  validatePin,
  isPassphraseInitialized,
  encrypt,
  decrypt,
};
