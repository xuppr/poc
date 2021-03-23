const fs = require("fs");
const path = require("path");
const idManger = require("./id-manager");
const cryptography = require("../cryptography/cryptography");

const poc_dir = path.join(require("os").homedir(), ".poc");

const STORE_FILE_PATH = path.join(poc_dir, "store.json");

const keys = {
  TITLE: "title",
  USERNAME: "username",
  EMAIL: "email",
  DATE: "date",
};

// ###### public ########

function addNew(account, pin) {
  const store = getStore();

  store.push({
    ...account,
    password: cryptography.encrypt(account.password, pin),
    date: new Date(Date.now()).toLocaleString(),
    id: idManger.newId(),
  });

  writeStore(store);

  return true;
}

function getAll({ title = false, reverse = false, pin }) {
  if (title) {
    return decryptAccounts(getSortedByKey({ key: keys.TITLE, reverse }), pin);
  }

  return decryptAccounts(getSortedByKey({ key: keys.DATE, reverse }), pin);
}

function getById(id, pin) {
  const account = getStore().find((account) => account.id === id);
  return account ? decryptAccounts([account], pin) : [];
}

function getByFilter({
  filter = keys.TITLE,
  alphabetic = false,
  reverse = false,
  value = "",
  pin,
}) {
  if (!Object.values(keys).includes(filter)) {
    throw new Error("incorrect filter argument");
  }

  let filtered = getFilteredByKeyValue({ key: filter, value });

  if (alphabetic) {
    let localKey = filter;
    if (localKey === keys.DATE) {
      localKey = keys.TITLE;
    }

    sortAccountsByKey({ accounts: filtered, key: localKey, reverse });
  } else {
    sortAccountsByKey({ accounts: filtered, key: keys.DATE, reverse });
  }

  return decryptAccounts(filtered, pin);
}

function deleteById(id) {
  const filtered = getStore().filter((account) => account.id !== id);
  writeStore(filtered);
}

function deleteByTitle(title) {
  const filtered = getStore().filter((account) => account.title !== title);
  writeStore(filtered);
}

function erase() {
  idManger.resetId();
  writeStore([]);
}
// ######################

function writeStore(store) {
  const data = JSON.stringify(store);
  fs.writeFileSync(STORE_FILE_PATH, data);
}

function getStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE_FILE_PATH));
  } catch (err) {
    return [];
  }
}

function getFilteredByKeyValue({ key = keys.TITLE, value = "" }) {
  return getStore().filter((account) =>
    account[key].toLowerCase().includes(value.toLowerCase())
  );
}

function sortAccountsByKey({ key, reverse, accounts }) {
  let left = 1;
  let right = -1;

  let parser = (toParse) => toParse;

  if (key === keys.DATE) {
    left = -1;
    right = 1;
    parser = (toParse) => new Date(toParse);
  }

  accounts.sort((a, b) => (parser(a[key]) > parser(b[key]) ? left : right));

  if (reverse) {
    accounts.reverse();
  }
}

function getSortedByKey({ key = keys.TITLE, reverse = false }) {
  let left = 1;
  let right = -1;

  let parser = (toParse) => toParse.toLowerCase();

  if (key === keys.DATE) {
    left = -1;
    right = 1;
    parser = (toParse) => new Date(toParse);
  }

  const sorted = getStore().sort((a, b) =>
    parser(a[key]) > parser(b[key]) ? left : right
  );

  if (reverse) {
    sorted.reverse();
  }

  return sorted;
}

function decryptAccounts(accounts, pin) {
  return accounts.map((account) => {
    return {
      ...account,
      password: cryptography.decrypt(account.password, pin),
    };
  });
}

module.exports = {
  getByFilter,
  getById,
  getAll,
  addNew,
  deleteById,
  deleteByTitle,
  erase,
};
