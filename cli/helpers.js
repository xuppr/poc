const isValidInput = (input) => {
    //max 50 characters
    if(input.length > 50) return false;
    return true;
};

exports.processAccountAnswer = (asked, answer, account, resolve, reject) => {
    if(isValidInput(answer)) {
        account[asked] = answer;
        resolve();
    }else {
        // error
        reject({type: 'len'});
    }
};


exports.processPinAnswer = (pin, resolve, reject) => {
    if(pin.length < 5 || pin.length > 20) {
        reject({type:'pin-limits'});
    } else {
        resolve(pin);
    };
};

exports.checkConfirmationPin = (pin, confirmationPin, resolve, reject) => {
    if (pin === confirmationPin) {
        resolve(pin);
    } else {
        reject({type: 'pin-confirm'});
    }
};

exports.clearInputField = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
};


exports.yesOrNo = (s) => {
    const sLower = s.toLowerCase();
    switch(sLower) {
        case 'y':
        case 'yes':
            return 'yes';
        case 'n':
        case 'no':
            return 'no';
        default:
            return 'other';
    }
};