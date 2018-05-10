var events = require('events');
var fs = require('fs');
var config = require('./config').events;
module.exports = (sub, votesArr) => {
    var vote = new Vote(sub, votesArr);
    vote.on(config.CHANGED, displayVotes);
    vote.on(config.CHANGED, checkMax);
    return vote;
}

class Vote extends events.EventEmitter{
    constructor(sub, votesArr){
        super();
        this.maxVotes = 10;
        this.subject = sub;
        this.votes = votesArr;
        this.setZero();
    }

    writeLog(message){
        fs.appendFile('message.txt', `Action: \t ${message} \nDate: \t\t ${Date()} \n\n`, function (err) {
            if (err) throw err;
        });
    }

    setZero(){
        this.votes.forEach( (val) => {
            this.votes[val] = 0;
        });
        this.emit(config.CHANGED);
        this.writeLog("restarted");
    }

    doVote(vote){
        this.votes[vote]++;
        this.emit(config.CHANGED);
        this.writeLog(`${vote} voted`);
    }

    getAllVotes(){
        console.log(`Subject: \t ${this.subject} \n`);
        this.votes.forEach( (val, key) => {
            console.log(`${this.votes[key]}: \t\t ${this.votes[val]}`);
        });
        console.log('\n');
    }

    deleteFile(){
        fs.unlink('message.txt', (err) => {
            if (err) throw err;
            console.log('file was deleted');
        });
    }
}

function displayVotes(){
    this.getAllVotes();
}

function checkMax(){
    var sum = 0;
    this.votes.forEach( (val) => {
        sum += this.votes[val];
    });
    if(sum >= this.maxVotes){
        console.log(`The maximum votes are: ${this.maxVotes}`);
    }
}
