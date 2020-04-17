const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
let dir = path.join(__dirname , '../logs');
let date = new Date().getDate();
let month = new Date().getMonth();
let year = new Date().getFullYear();
let fullDate = `${date}${month}${year}`;

class Logger {
    infoStream;
    debugStream;
    errorStream;
    warningStream;
    
    constructor(){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        this.infoStream = fs.createWriteStream(`${dir}/${fullDate}-info.txt`, { flags: 'a' });
        this.debugStream = fs.createWriteStream(`${dir}/${fullDate}-debug.txt`, { flags: 'a' });
        this.errorStream = fs.createWriteStream(`${dir}/${fullDate}-error.txt`, { flags: 'a' });
        this.warningStream = fs.createWriteStream(`${dir}/${fullDate}-warning.txt`, {flags: 'a'});
    }


    getDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString(undefined, options);
        const time = new Date().toLocaleTimeString();
        return `${date} ${time}`;
    }

    info(message) {
        message = `${this.getDate()} | INFO | ${message} \n\n`;
        this.infoStream.write(message);
    }

    debug(message) {
        message = `${this.getDate()}| DEBUG | ${message} \n\n`;
        this.debugStream.write(message);
    }

    error(message) {
        message = `${this.getDate()} | ERROR | ${message} \n\n`;
        this.errorStream.write(message);
    }

    warning(message) {
        message = `${this.getDate()} | WARN | ${message} \n\n`;
        this.warningStream.write(message);
    }
}

const logger = new Logger();

 
var job = schedule.scheduleJob(' 1 0 * * *', function(){
    this.infoStream = fs.createWriteStream(`${dir}/${fullDate}-info.txt`, { flags: 'a' });
    this.debugStream = fs.createWriteStream(`${dir}/${fullDate}-debug.txt`, { flags: 'a' });
    this.errorStream = fs.createWriteStream(`${dir}/${fullDate}-error.txt`, { flags: 'a' });
    this.warningStream = fs.createWriteStream(`${dir}/${fullDate}-warning.txt`, {flags: 'a'});
    logger.info('script runs successfully');
});

module.exports = logger;