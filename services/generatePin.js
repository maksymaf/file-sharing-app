const bcrypt = require('bcryptjs');
const File = require('../models/File');
const crypto = require('crypto');

async function generatePin() {
  let pin;
  let exists = true;

  while (exists) {
    pin = crypto.randomInt(100000, 1000000).toString();
    const files = await File.find();
    exists = false;
    for (const f of files) {
      if (await bcrypt.compare(pin, f.pin)) {
        exists = true;
        break;
      }
    }
  }

  const pinHash = await bcrypt.hash(pin, 7);
  return { pin, pinHash };
}

module.exports = generatePin;

