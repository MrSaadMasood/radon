#!/usr/bin/env sh

tsc node_modules/radon-cli/src
pm2 start -n radon node_modules/radon-cli/dist/index.js
