## LYD: Linked Yarn Dependencies

When working on a "monorepo" node application - a single repo that contains many interdependent packages - it is a pain to deal with the dependencies between them.
`lyd` is a simple tool to make managing local dependencies between packages.

lyd stores information about linked packages in a new key in package.json named `linkedDependencies`.

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

```
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
lrwxr-xr-x  1 user  gropu  50 Jan 23 08:45 node_modules/monorepo-user-auth -> /Users/user/src/monorepo/monorepo-user-auth
<Paste>


```
