function parseAddNewFlags(arr) {
    if(arr.length > 0) return {error: { type: 'wrong-arg', val:arr[0]}};
    return {command: 'new'};
}

function parseLogFlags(arr) {
    const flags = {
        verbose: false,
        alphabetic: false,
        reverse: false,
    }

    for(let i = 0; i < arr.length; i++) {
        const flag = arr[i];
        if(flag === '-v' || flag === '--verbose') {
            flags.verbose = true;
        } else if (flag === '-a' || flag === '--alphabetic') {
            flags.alphabetic = true;
        } else if (flag === '-r' || flag === '--reverse') {
            flags.reverse = true;
        } else {
            return {error: {type: 'wrong-arg', val: flag}};
        }
    }

    return {command: 'log', flags};
}

function parseDeleteFlags(arr) {
    let word = '';
    const flags = {
        id: null
    };

    if (arr.length === 0) {
        return {error: {type: 'no-id'}}; 
    }


    for(let i = 0; i < arr.length; i++) {
        const flag = arr[i];
        
        if (!flags.id) {
            const n = /^\d+$/.test(flag) ? +flag : null;
            if(n) flags.id = n;
            else return {error: {type: 'wrong-id', val: flag}};

        } else {
            return {error: {type: 'wrong-arg', val: flag}};
        }
    }

    return {command: 'delete', flags};
}


function parseSearchFlags(arr) {
    let word = '';
    const flags = {
        searchKey: 'title', //email or username
        verbose: false,
        alphabetic: false,
        reverse: false,
    };

    let isKeySwitched = false;

    for(let i = 0; i < arr.length; i++) {
        const flag = arr[i];

        if(flag === '-u' || flag === '--username' ) {
            if(isKeySwitched) continue;

            flags.searchKey = 'username';
            isKeySwitched = true;

        } else if (flag === '-e' || flag === '--email') {
            if(isKeySwitched) continue;

            flags.searchKey = 'email';
            isKeySwitched = true;

        } else if (flag === '-v' || flag === '--verbose') {
            flags.verbose = true;

        } else if (flag === '-a' || flag === 'alphabetic') {
            flags.alphabetic = true;

        } else if (flag === '-r' || flag === '--reverse') {
            flags.reverse = true;

        } else if (!word){
            word = flag;

        } else {
            return {error: {type: 'wrong-arg', val: flag}};
        }
    }

    if (!word) return {error: {type: 'no-search-word'}};

    return {word, flags};
}




module.exports = function(argv) {
    let args = argv.slice(2);

    
    if(args[0] === 'new') {
        return parseAddNewFlags(args.slice(1));

    } else if(args[0] === 'log') {
        return parseLogFlags(args.slice(1));

    }else if(args[0] === 'delete') {
        return parseDeleteFlags(args.slice(1));

    } else if(args.length >= 1) {
        return parseSearchFlags(args);

    } else {
        return {command: 'info'};
    }
}