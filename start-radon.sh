#!/usr/bin/env sh

tsc node_modules/radon-cli/src
pm2 start -n radon dist/index.js
