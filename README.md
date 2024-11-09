# Radon-CLI

Radon-CLI is an in-memory key-value store similar to Redis, featuring Time-To-Live (TTL) expiration, Least Recently Used (LRU) and Least Frequently Used (LFU) eviction policies, and a command-line interface (CLI) for easy interaction. This project is implemented in TypeScript and is designed to handle concurrent operations and custom serialization and deserialization.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

## Features

- **In-Memory Storage**: Stores key-value pairs in memory for fast access.
- **TTL (Time-To-Live)**: Automatically expires keys based on a user-defined TTL value.
- **Eviction Policies**:
  - **LRU (Least Recently Used)**: Removes the least recently accessed items when the store reaches capacity.
  - **LFU (Least Frequently Used)**: Removes the least frequently accessed items when the store reaches capacity.
- **CLI Interaction**: Manage the store using commands like `set`, `get`, and `delete` from a custom CLI.
- **Concurrency Management**: Uses `AsyncLock` and `ACID` principles to prevent concurrent write conflicts.
- **Environment-Based Configuration**: Configurable settings for server port, eviction policy, and storage capacity.
- **CI/CD Pipeline**: Automated testing and deployment scripts.

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Installation by cloning repo

1. Clone the repository:

   ```bash
   git clone git@github.com:MrSaadMasood/radon.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file in the root directory.

4. Start/stop the http server using:

   ```bash
   npm run start

   OR

   npm run start:prod // starts the server in the background

   // stop the server running in the background

   npm run stop:prod

   ```

### Installation as dependency

You can directly install radon-cli as a dependency in your project, start the radon server and make http requests to the
server to store, retrieve and delete keys. To install the `radon-cli` npm package use:

```
npm i radon-cli
```

### CLI Usage If Repo Cloned

Without global installation you need to prefix `npx` with every cli command i.e `npx radon start -g`, `npx radon stop -g`.
With global installation you dont need to prefix `npx`. You can just use the cli directly.
To install radon-cli globally

```
  npm i -g .
```

**Important**

To start and stop the radon server if cloned locally you just need to add the '-g' flag

```
radon start -g // start radon if globally installed
radon stop -g // stop radon if globally installed

OR

npx radon start -g // if using with local installation
npx radon stop -g // if using with local installation
```

All other commands don't need the '-g' flag

### CLI usage if installed as dependency

To use CLI as dependency, you just need to prefix with `npx`. No extra flags are needed

```
npx radon start
npx radon stop
npx radon get <key>
```

## Usage

### Setting a Key

Use the CLI to set a key in the store:

```bash
radon set <key> <value> --ttl <ttl>
```

--ttl flag is optional, use it when you need to set a time to live for the key.

### Retrieving a Key

Retrieve a key from the store:

```bash
radon get <key>
```

### Deleting a Key

Delete a key from the store:

```bash
radon delete <key>
```

### check-env

Checks if the environment file exists.

```bash
radon check-env
```

## Environment Variables

Configure the following variables in your `.env` file:

- `BASE_URL`: The base URL of the server.
- `PORT`: The port on which the server runs.
- `STORE_CAPACITY`: The maximum number of entries the store can hold.
- `EVICTION_POLICY`: Set to `LRU` or `LFU`.

Defaults To:

```env
BASE_URL=http://localhost:4772
PORT=4772
STORE_CAPACITY=10000000
EVICTION_POLICY=LRU
```

## Testing

Run tests with:

```bash
npm test
```

## Project Structure

- `src`: Contains all TypeScript source files.
- `src/cli`: CLI utilities and commands.
- `src/utils`: Utility functions and helpers.

## API Documentation

Base URL

```
http://localhost:<PORT>  // as specified in .env (for cloned project)
                        //or in node_modules/radon-cli/.env (for dependency install)
```

### Endpoints

1. **GET `/get/:key`**

   - **Description**: Retrieve the value associated with a specific key.
   - **Parameters**:
     - `key` (string, path): Key for which value needs to be fetched.
   - **Responses**:
     - `200 OK`: Returns the value.
     - `404 Not Found`: Key does not exist.
     - `422 Unprocessable Entity`: Invalid key format.
   - **Example**:

     ```
     GET /get/sampleKey
     ```

2. **POST `/set`**

   - **Description**: Add or update a key-value pair, with an optional TTL (time-to-live).
   - **Request Body**:
     - `key` (string): The key to store the value.
     - `value` (any): The value to store.
     - `ttl` (string | number, optional): Expiration time in seconds.
   - **Responses**:
     - `200 OK`: Key added successfully.
     - `400 Bad Request`: Failed to add or update the key.
   - **Example**:

     ```
     POST /set
     {
       "key": "sampleKey",
       "value": "sampleValue",
       "ttl": 60
     }
     ```

3. **DELETE `/del/:key`**

   - **Description**: Delete a key-value pair.
   - **Parameters**:
     - `key` (string, path): Key to delete.
   - **Responses**:
     - `200 OK`: Key deleted successfully.
     - `422 Unprocessable Entity`: Invalid key format.
   - **Example**:

     ```
     DELETE /del/sampleKey
     ```

4. **GET `/ping`**

   - **Description**: Health check endpoint to verify server status.
   - **Responses**:
     - `200 OK`: Returns `pong`.
   - **Example**:

     ```
     GET /ping
     ```

### Error Handling

- **500 Internal Server Error**: General fallback for any unhandled errors.

## License

This project is licensed under the MIT License.
