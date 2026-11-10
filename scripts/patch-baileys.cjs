
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
  console.error("Baileys socket.js not found.");
  process.exit(1);
}

let source = fs.readFileSync(file, "utf8");

const start = source.indexOf("const requestPairingCode = async");

if (start === -1) {
  console.error("requestPairingCode not found.");
  process.exit(1);
}

const bodyStart = source.indexOf("{", start);
const returnIndex = source.indexOf(
  "return authState.creds.pairingCode",
  bodyStart
);

if (bodyStart === -1 || returnIndex === -1) {
  console.error("Could not safely locate pairing function.");
  process.exit(1);
}

let section = source.slice(bodyStart, returnIndex);

if (!section.includes("clearTimeout(qrTimer)")) {
  source =
    source.slice(0, bodyStart + 1) +
    "\n\t\tclearTimeout(qrTimer);\n" +
    source.slice(bodyStart + 1);
}

const newStart = source.indexOf("const requestPairingCode = async");
const newBody = source.indexOf("{", newStart);
const newReturn = source.indexOf(
  "return authState.creds.pairingCode",
  newBody
);

section = source.slice(newBody, newReturn);

if (section.includes("await sendNode({")) {
  const target = source.indexOf("await sendNode({", newBody);
  source =
    source.slice(0, target) +
    "await query({" +
    source.slice(target + "await sendNode({".length);
} else if (!section.includes("await query({")) {
  console.error("Could not locate pairing request.");
  process.exit(1);
}

fs.writeFileSync(file, source, "utf8");

console.log("Baileys pairing patch applied successfully.");
