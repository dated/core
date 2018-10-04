![ARK Core](https://i.imgur.com/1aP6F2o.png)

# ARK Core - Snapshots-CLI

The purpose of this plugin is to provide local snapshot functionality, so in case of issues the blockchain can be rebuild locally from own exported data.
The plugin provides a cli interface, with the following available commands:

- create (with option to append, or to select start end end block height to export)
- slice
- import
- verify

The commands and their usage is described below.

## Installation

```bash
yarn add @arkecosystem/core-snapshots
```
## Usage
The plugin allows for manipulation, creation and import functionality of various snapshots via CLI interface

### Creating a fresh new snapshot
The following action creates a new snapshot in .ark/snapshots/devnet/ folder.
```bash
yarn create:devnet
```
The command will generate snapshot files in your configured folder. By default this folder will be in `~.ark/NETWORK_NAME/snapshots`.
Files are named following this pattern:  `table.startHeight.endHeight.dat`. For example, command `yarn create:devnet` will create:
- blocks.0.331985.dat
- transactions.dat
- rounds.dat (last few rounds)

### Append data to an existing snapshot
To enable rolling snapshost and their faster import execution, it is possible to append data to the existing snapshot.
The command is the same as for creating of snapshot with additional parameter for `-f` or `--filename` where we specify the existing snapshot we want to apped.
As a filename you only provide the `blocks` filename, for example `blocks.0.331985.dat`. Other files (`transactions.dat, rounds.dat`) are auto appended.

>Warning: The appened files are renamed to last exported height and timestamp (according to the naming structure). If you want to keep old snapshot, please archive, or copy it somewhere.
```bash
yarn create:devnet -f blocks.331985.47970112.dat
```

### Importing a snapshot
The following action imports a snapshot from .ark/snapshots/devnet/ folder. Snapshot filename must be specified. You specify only first filename - from the blocks.
>Make sure that your node is not running.
```bash
yarn import:devnet -f blocks.0.331985.dat
```
> Add option `--truncate` to empty all the tables before import
```bash
yarn import:devnet -f blocks.0.331985.dat --truncate
```
>If you want to use a periodic snapshot, use the option without `--truncate`.

### Verify existing snapshot
If is wise to validate a snapshot. Functionality is simillar to import, just that there is no database interaction - so is basic chain validation with crypto. To check your snapshot run the following command.
```bash
yarn verify:devnet -f blocks.0.331985.dat
```

## Security
If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

- [Kristjan Košič](https://github.com/kristjank)
- [All Contributors](../../../../contributors)

## License

[MIT](LICENSE) © [ArkEcosystem](https://ark.io)