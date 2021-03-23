const fs = require("fs");
const path = require("path");

const l = console.log;

exports.help = help;
exports.info = info;
exports.welcome = welcome;
exports.pinCorrectlyInitialized = pinCorrectlyInitialized;
exports.notFound = notFound;
exports.willDelete = willDelete;
exports.newAccountCreated = newAccountCreated;
exports.accountDeletedOrNot = accountDeletedOrNot;
exports.printAccount = printAccount;
exports.printAccounts = printAccounts;
exports.error = error;

const retrieveCliDocs = (file) => {
  const dir = path.join(__dirname, "..", "doc", "cli", file);
  const body = fs.readFileSync(dir, "utf8");
  return body;
};

function help() {
  l(retrieveCliDocs("help.txt"));
}

function info() {
  l("");
  l(retrieveCliDocs("info.txt"));
  l("");
  help();
}

function welcome() {
  l("Welcome! This is the first initialization!");
}

function pinCorrectlyInitialized() {
  l("Your pin has been successfully initialized! :)");
}

function newAccountCreated() {
  l("");
  l("New account created!");
}

function accountDeletedOrNot(response) {
  if (response) l("Account deleted!");
  else l("Ok, your account will stay there. Bye!");
}

function notFound() {
  l("Account not found!");
}

function willDelete(account) {
  l("this command will delete this account: ");
  printAccount(account, true);
}

function printAccount(account, verbose) {
  l("");
  l("*********************************************");
  l(`Title or site: ${account.title}`);
  l(`username: ${account.username}`);
  l(`email: ${account.email}`);
  l(`password: ${account.password}`);

  if (verbose) {
    l(`notes: ${account.notes}`);
    l(`date: ${account.date}`);
    l(`id: ${account.id}`);
  }

  l("*********************************************");
  l("");
}

function printAccounts(accounts, verbose) {
  if (accounts.length > 0) {
    accounts.forEach((account) => printAccount(account, verbose));
  } else {
    l("No accounts found!");
  }
}

function error(err) {
  // err = {type, val}
  switch (err.type) {
    case "wrong-arg":
      l(`Wrong argument: ${err.val}`);
      help();
      break;
    case "pin-wrong":
      l(`Incorrect pin! Try again!`);
      break;
    case "pin-limits":
      l("Your pin must be between 5 and 20 characters!");
      break;
    case "pin-confirm":
      l("The confirmation pin doesn't match!");
      break;
    case "len":
      l("Too many characters! (max 50)");
      break;
    case "no-id":
      l("No id provided!");
      help();
      break;
    case "wrong-id":
      l("The id must be a number!");
      break;
    case "no-search-word":
      l("No serch key passed!");
      break;
    default:
      l(err);
      break;
  }
}
