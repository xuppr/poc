const readLine = require('readline');
const Writable = require('stream').Writable;
const book = require('../poc-book');
const cliPrinter = require('../cli-printer');
const {processAccountAnswer, processPinAnswer, checkConfirmationPin, clearInputField, yesOrNo} = require('./helpers');
const l = console.log;


exports.hasPin = hasPin;
exports.askPin = askPin;
exports.createPin = createPin;
exports.addNew = addNew;
exports.logAll = logAll;
exports.search = search;
exports.deleteAccount = deleteAccount;
exports.error = error;
exports.info = info;



function hasPin() {
    return book.isPinInitialized();
} 



function createPin() {
    cliPrinter.welcome();

    const mutedStdOut = new Writable({
        write: function(chunk, encoding, callback) {
            if (!this.muted) process.stdout.write(chunk, encoding);
            callback();
        }
    });

    mutedStdOut.muted = false;
    
    const rl = readLine.createInterface({
        input: process.stdin,
        output: mutedStdOut,
        terminal: true
    });


    new Promise((resolve, reject) => 
        rl.question('Insert a valid pin (min 5, max 20): ', pin => {
            mutedStdOut.muted = false;
            processPinAnswer(pin, resolve, reject);
        })
    )
    .then(pin => new Promise((resolve, reject) => {
            rl.question('Confirm pin: ', confirmPin => {
                checkConfirmationPin(pin, confirmPin, resolve, reject);
            });
            mutedStdOut.muted = true;
        })
    )
    .then(pin => {
        clearInputField();
        book.initializePin(pin);
        cliPrinter.pinCorrectlyInitialized();
    })
    .catch(err => {
        clearInputField()
        cliPrinter.error(err);
    })
    .finally(_ => rl.close());

    mutedStdOut.muted = true;
}



function askPin() {
    const mutedStdOut = new Writable({
        write: function(chunk, encoding, callback) {
            if (!this.muted) process.stdout.write(chunk, encoding);
            callback();
        }
    });

    mutedStdOut.muted = false;
    
    const rl = readLine.createInterface({
        input: process.stdin,
        output: mutedStdOut,
        terminal: true
    });

    const p = new Promise((resolve, reject) => {
        rl.question('Insert pin: ', pin => {
            clearInputField();
            rl.close();
            if(book.validatePin(pin)) resolve(pin);
            else reject({type: 'pin-wrong'});
        });

    });

    mutedStdOut.muted = true;

    return p;
}



function addNew(pin) {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const newAccount = {};

    const askTitle = () => {
        return new Promise((resolve, reject) => {
            rl.question('title or site: ', title => processAccountAnswer('title', title, newAccount, resolve, reject));
        });
    };

    const askUsername = () => {
        return new Promise((resolve, reject) => {
            rl.question('username: ', username => processAccountAnswer('username', username, newAccount, resolve, reject));
        });
    };

    const askEmail = () => {
        return new Promise((resolve, reject) => {
            rl.question('email: ', email => processAccountAnswer('email', email, newAccount, resolve, reject));
        });
    };

    const askPassword = () => {
        return new Promise((resolve, reject) => {
            rl.question('password: ', password => processAccountAnswer('password', password, newAccount, resolve, reject));
        });
    };

    const askNotes = () => {
        return new Promise((resolve, reject) => {
            rl.question('notes: ', notes => processAccountAnswer('notes', notes, newAccount, resolve, reject));
        });
    };

    askTitle()
    .then(askUsername)
    .then(askEmail)
    .then(askPassword)
    .then(askNotes)
    .then(res => {
        book.writeAccount(newAccount, pin);
        cliPrinter.newAccountCreated();
    })
    .catch(err => cliPrinter.error(err))
    .finally(() => rl.close());

}




function deleteAccount(flags, pin) {
    const accountsArr = book.getById(flags.id, pin);
    
    if(accountsArr.length === 0) {
        cliPrinter.notFound();
        return;
    }
    
    cliPrinter.willDelete(accountsArr[0]);
    
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let count = 0;

    const infiniteAsk = () => {
        const p = new Promise((resolve, reject) => {
            rl.question(count > 0 ? 'Be precise! yes or no? ' : 'Are you sure? (yes/no) ', userInput => {
                const response = yesOrNo(userInput);
                if(response === 'yes') {
                    rl.close();
                    book.deleteById(flags.id);
                    resolve(true);
                } else if(response === 'no') {
                    rl.close();
                    resolve(false);
                } else {
                    reject();
                    infiniteAsk();
                }
            });
        });

        count++;
        
        p.then(response => cliPrinter.accountDeletedOrNot(response))
        .catch(err => {});
        
        return p;
    };

    infiniteAsk();
}



function error(err) {
   cliPrinter.error(err)
}



function logAll(pin, flags) {
    const accountsArr = book.getAll({title:flags.alphabetic, reverse:flags.reverse, pin });
    cliPrinter.printAccounts(accountsArr, flags.verbose);
}



function search(pin, word, flags) {
    const accountsArr = book.getByFilter({value: word, filter: flags.searchKey, pin, reverse: flags.reverse, alphabetic: flags.alphabetic});
    cliPrinter.printAccounts(accountsArr, flags.verbose);
}



function info() {
    cliPrinter.info();
}
