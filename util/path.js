const path = require('path');

//return path to directory that contains app.js - file responsible that app is running in first place
module.exports = path.dirname(process.mainModule.filename);