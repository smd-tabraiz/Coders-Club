const crypto = require('crypto');

const generateTicketId = () => {
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CC-GPREC-${randomStr}`;
};

module.exports = generateTicketId;
