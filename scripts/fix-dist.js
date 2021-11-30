#!/bin/env node
const fs = require("fs")
fs.writeFileSync("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }))
fs.writeFileSync("dist/mjs/package.json", JSON.stringify({ type: "module" }))
