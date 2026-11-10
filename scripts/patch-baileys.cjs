const fs = require("node:fs");
const path = require("node:path");

const file = path.join(
  process.cwd(),
  "node_modules",
  "baileys",
  "lib",
  "Socket",
  "socket.js"
);

if (!fs.existsSync(file)) {
  console.error("Baileys socket file not found:", file);
  process.exit(1);
}

let source = fs.readFileSync(file, "utf8");

const start = source.indexOf("const requestPairingCode = async");
const next = source.indexOf("async function generatePairingKey", start);
const target = source.indexOf("await sendNode({", start);

if (start === -1 || next === -1 || target === -1 || target > next) {
  console.error("Could not safely locate the pairing request.");
  process.exit(1);
}

if (source.slice(start, next).includes("await query({")) {
  console.log("Baileys pairing patch already applied.");
  process.exit(0);
}

source =
  source.slice(0, target) +
  source.slice(target).replace("await sendNode({", "await query({");

fs.writeFileSync(file, source, "utf8");

console.log("Baileys pairing patch applied.");
