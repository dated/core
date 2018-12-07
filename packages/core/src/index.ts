#!/usr/bin/env node

import bip38 from "bip38";
import app from "commander";
import fs from "fs";
import wif from "wif";
import { startForger, startRelay, startRelayAndForger } from "./commands";

import { version } from "../package.json";

app.version(version);

app
  .command("start")
  .description("start a relay node and the forger")
  .option("-d, --data <data>", "data directory", "~/.ark")
  .option("-c, --config <config>", "core config", "~/.ark/config")
  .option("-t, --token <token>", "token name", "ark")
  .option("-n, --network <network>", "token network")
  .option("-b, --bip38 <bip38>", "forger bip38")
  .option("-p, --password <password>", "forger password")
  .option("--network-start", "force genesis network start", false)
  .option("--disable-discovery", "disable any peer discovery")
  .option("--skip-discovery", "skip the initial peer discovery")
  .action(async (options) => startRelayAndForger(options, version));

app
  .command("relay")
  .description("start a relay node")
  .option("-d, --data <data>", "data directory", "~/.ark")
  .option("-c, --config <config>", "network config", "~/.ark/config")
  .option("-t, --token <token>", "token name", "ark")
  .option("-n, --network <network>", "token network")
  .option("-r, --remote <remote>", "remote peer for config")
  .option("--network-start", "force genesis network start", false)
  .option("--disable-discovery", "disable any peer discovery")
  .option("--skip-discovery", "skip the initial peer discovery")
  .action(async (options) => startRelay(options, version));

app
  .command("forger")
  .description("start the forger")
  .option("-d, --data <data>", "data directory", "~/.ark")
  .option("-c, --config <config>", "network config", "~/.ark/config")
  .option("-t, --token <token>", "token name", "ark")
  .option("-n, --network <network>", "token network")
  .option("-b, --bip38 <bip38>", "forger bip38")
  .option("-p, --password <password>", "forger password")
  .action(async (options) => startForger(options, version));

app
  .command("forger-plain")
  .description("set the delegate secret")
  .option("-c, --config <config>", "core config")
  .option("-n, --network <network>", "network")
  .option("-s, --secret <secret>", "forger secret")
  .action(async (options) => {
    const delegatesConfig = `${options.config}/delegates.json`;
    if (!options.config || !fs.existsSync(delegatesConfig)) {
      // tslint:disable-next-line:no-console
      console.error("Missing or invalid delegates config path");
      process.exit(1);
    }
    const delegates = require(delegatesConfig);
    delegates.secrets = [options.secret];
    delete delegates.bip38;

    fs.writeFileSync(delegatesConfig, JSON.stringify(delegates, null, 2));
  });

app
  .command("forger-bip38")
  .description("encrypt the delegate passphrase using bip38")
  .option("-c, --config <config>", "core config")
  .option("-t, --token <token>", "token name", "ark")
  .option("-n, --network <network>", "token network")
  .option("-s, --secret <secret>", "forger secret")
  .option("-p, --password <password>", "bip38 password")
  .action(async (options) => {
    const delegatesConfig = `${options.config}/delegates.json`;
    if (!options.config || !fs.existsSync(delegatesConfig)) {
      // tslint:disable-next-line:no-console
      console.error("Missing or invalid delegates config path");
      process.exit(1);
    }
    const { configManager, crypto } = require("@arkecosystem/crypto");
    configManager.setFromPreset(options.token, options.network);

    const keys = crypto.getKeys(options.secret);
    const decoded = wif.decode(crypto.keysToWIF(keys));

    const delegates = require(delegatesConfig);
    delegates.bip38 = bip38.encrypt(decoded.privateKey, decoded.compressed, options.password);
    delegates.secrets = []; // remove the plain text secrets in favour of bip38

    fs.writeFileSync(delegatesConfig, JSON.stringify(delegates, null, 2));
  });

app
  .command("*")
  .action((env) => {
    app.help();
    process.exit(0);
  });

app.parse(process.argv);