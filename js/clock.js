const dgram = require('dgram');

class Clock {
    constructor(hours = getRandom(24), mins = getRandom(60), secs = getRandom(60)) {
        hours %= 24;
        mins %= 60;
        secs %= 60;
        this._seconds = hours * 60 * 60 + mins * 60 + secs;
    }
    get time() {
        let hours = Math.floor(this._seconds / (60 * 60));
        let minutes = Math.floor((this._seconds - hours * 60 * 60) / 60);
        let seconds = this._seconds - minutes * 60 - hours * 60 * 60;
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }
    set time(time) {
        hours %= 24;
        mins %= 60;
        secs %= 60;
        this._seconds = time.hours * 60 * 60 + time.mins * 60 + time.secs;
    }
    advance() {
        this._seconds = (this._seconds + 1) % (24 * 60 * 60);
    }
}

const getRandom = maxNum => (Math.floor(Math.random() * maxNum));

var internal_clock = new Clock();


function mainLoop(velocity) {
    return setInterval(function () {
        internal_clock.advance();
        postMessage(internal_clock.time);
    }, Math.floor(1000 * velocity));
}

var name;
var client;


/*

First function executed for initialization purposes.
Can receive a JS object with the following structure:
(? next to a key means the key is optional)
{
    name: str, // Name assigned to this clock
    destAddr : {
        port: Number,
        ip: str
    }?
}
*/
onmessage = function initState(e) {

    let enableSocket = e.data.hasOwnProperty('destAddr');
    if (enableSocket) {
        let dest = e.data.destAddr;
        client = dgram.createSocket('udp4');
        client.connect(dest.port, dest.ip);
    }

    name = e.data.name;

    this.onmessage = (function execState() {
        let velocity = 1.0;
        let mlHandler = mainLoop(velocity);
        /*
        Function executed on received message.
        Can receive a JS object with the following structure:
        (? next to a key means the key is optional)
        {
            action: action, // Action to execute ('setTime', 'setVelocity')
            time: {
                hours: Number,
                minutes: Number,
                seconds: Number
            }?, // used on setTime and setAll actions
            velocity: Float? // used on setVelocity and setAll actions
        }
        */
        return function (e) {
            if (e.data.action === 'setTime') {
                clearInterval(mlHandler);
                internal_clock.time = e.data.time;
                mlHandler = mainLoop(velocity);
            } else if (e.data.action === 'setVelocity') {
                clearInterval(mlHandler);
                velocity = e.data.velocity;
                mlHandler = mainLoop(velocity);
            } else if (e.data.action === 'setAll') {
                clearInterval(mlHandler);
                internal_clock.time = e.data.time;
                velocity = e.data.velocity;
                mlHandler = mainLoop(velocity);
            } else if (e.data.action === 'stop'){
                clearInterval(mlHandler);
            } else if (e.data.action === 'send' && enableSocket) {
                console.log("Sending data to " + client);
                let data = {
                    time: internal_clock.time,
                    name: name,
                }
                let message = Buffer.from(JSON.stringify(data));

                client.send(message);
            }
        }
    })();
};

