#!/usr/bin/env node

import { Command } from "commander";
import {
  deleteValueFromRadon,
  getValueFromRadon,
  listWorkingDirOfPackage,
  serverEnvFileExistenceChecker,
  setKeyValueInRadon,
  startRadonServer,
  stopRadonServer,
} from "./cliHelpers.js";

const program = new Command();

program
  .name("radon")
  .description("CLI for Radon - an in-memory key value store like Redis")
  .version("1.0.0");

program
  .command("check-env")
  .description("checks if the env file exists for the server")
  .action(serverEnvFileExistenceChecker);

program
  .command("ldir")
  .description("lists the current working directory")
  .action(listWorkingDirOfPackage)


program
  .command("start")
  .option("-g, --global", "use when you directly cloned the github repo and installed package globally")
  .description("starts the radon server on the port as specified by env file")
  .action(startRadonServer);

program
  .command("stop")
  .option("-g, --global", "use when you directly cloned the github repo and installed package globally")
  .description("stops the radon server")
  .action(stopRadonServer);

program
  .command("set")
  .description("set the key in the key-value store")
  .argument("key", "key to store")
  .argument("value", "value to store")
  .option("-t, --ttl <ttl>", "time to live for key")
  .option(
    "-p, --parse",
    "is value parseable -- use in case of objects and arrays",
  )
  .option("-u, --url <string>", "url of in memory store")
  .action(setKeyValueInRadon);

program
  .command("get")
  .description("get the value from the key-value store")
  .argument("key", "key in store")
  .option("-u, --url <string>", "url of in memory store")
  .action(getValueFromRadon);

program
  .command("delete")
  .description("delete key from key-value store")
  .argument("key", "key in store")
  .option("-u, --url <string>", "url of in memory store")
  .action(deleteValueFromRadon);

program.parse();
