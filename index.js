#!/usr/bin/env node

const cli = require('./cli');
const cliParser = require('./cli-parser');

const args = cliParser(process.argv);

if(args.command === 'info') {
    cli.info();
    process.exit();
}

if(!cli.hasPin()) {
    cli.createPin();
} else {
    cli.askPin()
    .then(pin => {
        //const args = cliParser(process.argv);
        if(args.command) {
            if(args.command === 'new') {
                cli.addNew(pin);
            } else if (args.command === 'log') {
                cli.logAll(pin, args.flags);
            } else if (args.command === 'delete') {
                cli.deleteAccount(args.flags, pin);
            }
        } else if (args.word) {
            cli.search(pin, args.word, args.flags);
        } else if (args.error) {
            cli.error(args.error);
        }
    })
    .catch(err => cli.error(err));
}
