import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { BASE_URL, EVICTION_POLICY, PORT, STORE_CAPACITY } from "../utils/envSchema.js";


export function serverEnvFileExistenceChecker() {
  const filePath = path.join(process.cwd(), ".env");
  const fileExists = fs.existsSync(filePath);
  if (fileExists) console.log("the env exists");
  else console.log("env doest exists");
}

export function startRadonServer(options: { global?: boolean }) {
  const cmd = options.global ? "sh start-radon-global.sh" : "sh node_modules/radon-cli/start-radon.sh"
  exec(cmd, (error, stdout, stderr) => {
    if (error) console.log(error);
    else if (stderr) console.log(stderr);
    else {
      console.log(stdout);
      console.log("Server started with following options");
      console.log("Eviction Policy: ", EVICTION_POLICY);
      console.log("Store Capacity: ", STORE_CAPACITY);
      console.log("Port: ", PORT);
      console.log("Base Url", BASE_URL);
    }
  });
}

export function stopRadonServer(options: { global?: boolean }) {
  const cmd = options.global ? "sh stop-radon-global.sh" : "sh node_modules/radon-cli/stop-radon.sh"
  exec(cmd, (error, stdout, stderr) => {
    if (error) console.log(error);
    else if (stderr) console.log(stderr);
    else console.log(stdout);
  });
}

export function listWorkingDirOfPackage() {
  exec("ls -la", (error, stdout, stderr) => {
    if (error) console.log(error);
    else if (stderr) console.log(stderr);
    else console.log(stdout);
  })
}

export async function setKeyValueInRadon(
  key: string,
  value: string,
  options: SetRadonOptions,
) {
  try {
    if (options.parse) value = JSON.parse(value);
    const url = options.url || BASE_URL;
    const response = await fetch(`${url}/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        ttl: options.ttl,
      }),
    });
    const body = await response.json();
    console.log(body);
  } catch (error) {
    console.log(error);
    console.log("Kindly use -p flag for objects/arrays");
  }
}

export async function getValueFromRadon(
  key: string,
  options: { url?: string; parse?: boolean },
) {
  try {
    const url = options.url || BASE_URL;
    const response = await fetch(`${url}/get/${key}`, {
      method: "GET",
    });
    const body = await response.json();
    console.log(body);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteValueFromRadon(
  key: string,
  options: { url?: string },
) {
  try {
    const url = options.url || BASE_URL;
    const response = await fetch(`${url}/del/${key}`, {
      method: "DELETE",
    });
    const body = await response.json();
    console.log(body);
  } catch (error) {
    console.log(error);
  }
}
