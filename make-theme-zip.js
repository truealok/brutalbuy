#!/usr/bin/env node
/* Fallback zip writer for make-theme-zip.sh — used when `zip` and python are
   both unavailable. Writes a stored/deflated zip with a proper central
   directory, so the result is a normal .zip any tool can open.

   Usage: node make-theme-zip.js <output.zip> <dir> [dir...] */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const [out, ...dirs] = process.argv.slice(2);
if (!out || dirs.length === 0) {
  console.error("usage: node make-theme-zip.js <output.zip> <dir> [dir...]");
  process.exit(1);
}

function collect(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full, out);
    else out.push(full);
  }
  return out;
}

const files = dirs.flatMap((d) => collect(d)).sort();
if (files.length === 0) {
  console.error("No files found to zip.");
  process.exit(1);
}

const localParts = [];
const centralParts = [];
let offset = 0;

for (const file of files) {
  const data = fs.readFileSync(file);
  const deflated = zlib.deflateRawSync(data, { level: 9 });
  const name = Buffer.from(file.split(path.sep).join("/"), "utf8");
  const crc = zlib.crc32 ? zlib.crc32(data) : require("zlib").crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); // local file header signature
  local.writeUInt16LE(20, 4);         // version needed
  local.writeUInt16LE(0, 6);          // flags
  local.writeUInt16LE(8, 8);          // method: deflate
  local.writeUInt32LE(0, 10);         // mod time/date (zeroed for reproducibility)
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(deflated.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);

  localParts.push(local, name, deflated);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); // central directory signature
  central.writeUInt16LE(20, 4);         // version made by
  central.writeUInt16LE(20, 6);         // version needed
  central.writeUInt16LE(0, 8);          // flags
  central.writeUInt16LE(8, 10);         // method
  central.writeUInt32LE(0, 12);         // mod time/date
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(deflated.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt16LE(0, 30);         // extra length
  central.writeUInt16LE(0, 32);         // comment length
  central.writeUInt16LE(0, 34);         // disk number
  central.writeUInt16LE(0, 36);         // internal attrs
  central.writeUInt32LE(0, 38);         // external attrs
  central.writeUInt32LE(offset, 42);    // offset of local header

  centralParts.push(central, name);

  offset += local.length + name.length + deflated.length;
}

const centralDir = Buffer.concat(centralParts);

const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);        // end of central directory
end.writeUInt16LE(0, 4);                 // disk number
end.writeUInt16LE(0, 6);                 // disk with central dir
end.writeUInt16LE(files.length, 8);      // entries on this disk
end.writeUInt16LE(files.length, 10);     // total entries
end.writeUInt32LE(centralDir.length, 12);
end.writeUInt32LE(offset, 16);           // offset of central dir
end.writeUInt16LE(0, 20);                // comment length

fs.writeFileSync(out, Buffer.concat([...localParts, centralDir, end]));
console.log(`Wrote ${out} with ${files.length} files.`);
