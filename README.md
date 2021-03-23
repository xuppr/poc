# POC

### A minimal command-line tool to save and retrieve your accounts with password encryption.

> **_NOTE:_** &nbsp;This app is for fun at the moment. Use this for unimportant accounts for now.

## Usage

Initialize your pocket with a pin for password encryption:

```
$ sudo poc new
Welcome! This is the first initialization?
Insert a valid pin (min 5, max 20):
Confirm pin:
```

now you can save your accounts (for every command you'll be asked for the pin):

```
$ poc new
Insert pin:

title or site: little-poc.com
username: bomber
email:  me@anyemail.com
password: ImGoInGTobeencrypted
notes: This app is for fun at the moment.
```

retrieve an account using a keyword. This will search for accounts by title:

```
$ poc little-poc.com
```

retrieve all accounts:

```
$ poc log
```

use -v flag for a verbose output so you can find the account id:

```
$ poc little -v
```

delete by account id:

```
$ poc delete 1
```

for other info:

```
$ poc
```
