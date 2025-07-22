const path = require('path');

module.exports = {
  wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  schemaOutputPath: path.join(__dirname, '../possibleTypes.json'),
  pagesDir: path.join(__dirname, '../src/pages'),
};