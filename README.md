## LYD: Linked Yarn Dependencies

When working on a "monorepo" node application - a single repo that contains many interdependent packages - it is a pain to deal with the dependencies between them.

`lyd` is a simple tool to help with managing local dependencies between packages.

I created it to work around issues I had while working with yarn, but you can also use it with npm if you like.

## How it works

lyd stores information about linked packages in a new key in package.json named `linkedDependencies`.

## Installation

You can install lyd locally in your project, in the root of your monorepo, or globally.
Personally, I try to minimize global package install, but it's your life.

If you like, you can add lyd as a preinstall or postinstall step in package.json, so that it is run before/after `npm install` or `yarn install`.

## Commands

`lyd` has three commands:

### add

`lyd add {path to package}`

Adds a new entry to linkedDependencies in the current directory's package.json

### remove

`lyd remove {name of package}`

Removes an entry from linkedDependencies in the current directory's package.json

### install-links

`lyd install-links`
... or ...
`lyd`

Create symlinks in `{pwd}/node_modules` to all of the packages specified in the `linkedDependencies` section of the package.json

### Example usage

```shell
$ cd ~/src/monorepo
$ ls
monorepo-api monorepo-user-auth

$ cd monorepo-api
$ lyd add ../monorepo-user-auth
$ cat package.json

{
  ...
  "linkedDependencies": {
    "monorepo-user-auth": "../monorepo-user-auth"
  }
  ...
}

$ lyd  # install links to dependencies in node_mdules

$ ls -al node_modules/monorepo-user-auth
lrwxr-xr-x  1 user  group  50 Jan 23 08:45 node_modules/monorepo-user-auth -> /Users/user/src/monorepo/monorepo-user-auth

```
