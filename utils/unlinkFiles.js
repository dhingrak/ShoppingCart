const path = require('path');
const fs = require('fs');
require('express-async-errors');

// Remove files from uploads folder (During validation process)
function deleteFiles(files) {

    files.forEach((file) => {
        const fileDestination = path.join(__dirname, '../public/uploads/' + file.filename);
        fs.unlink(fileDestination, (err) => {
            if(err) throw err;
        });
    })
}


// Remove files from upload folder (During deletion process) 
function daleteDatabaseFiles(files) {
    
    files.forEach((file) => {
        fs.unlink(file.fullPath, (err) => {
            if(err) throw err;
        });
    })
}

module.exports = {
    deleteFiles,
    daleteDatabaseFiles
}
