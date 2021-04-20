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
    setTime(time) {
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

// function loop for clocks without a socket server
function mainLoop(velocity) {
    return setInterval(function () {
        internal_clock.advance();
        postMessage(internal_clock.time);
    }, Math.round(1000 * velocity));
}

// function loop for socketed clocks
function mainLoopSocketed(velocity, client) {
    return setInterval(function () {
        internal_clock.advance();
        postMessage(internal_clock.getTime());

        let data = {
            time: internal_clock.getTime(),
            name: name,
        }

        let message = Buffer.from(JSON.stringify(data));

        client.send(message);
    }, Math.round(1000 * velocity));
}

var name;

function execState() {
    let velocity = 1.0;
    let mlHandler = mainLoop(velocity);
    /*
    Function executed on received message.
    Can receive a JS object with the following structure:
    (? next to a key means the key is optional)
    {
        action: action, // Action to execute ('setTime', 'setSpeed')
        time: {
            hours: Number,
            minutes: Number,
            seconds: Number
        }?, // used only on setTime action
        velocity: Float? // used only on setSpeed action
    }
    */
    return function (e) {
        if (e.data.action === 'setTime') {
            clearInterval(mlHandler);
            internal_clock.setTime(e.data.time);
            mlHandler = mainLoop(velocity);
        } else if (e.data.action === 'setSpeed') {
            clearInterval(mlHandler);
            velocity = e.data.velocity;
            mlHandler = mainLoop(velocity);
        }
    }
}

// Generator function with closure to save state
function execStateSocketed(client) {
    let velocity = 1.0;
    let mlHandler = mainLoopSocketed(velocity, client);

    /*
    Function executed on received message.
    Can receive a JS object with the following structure:
    (? next to a key means the key is optional)
    {
        action: action, // Action to execute ('setTime', 'setSpeed')
        time: {
            hours: Number,
            minutes: Number,
            seconds: Number
        }?, // used only on setTime action
        velocity: Float? // used only on setSpeed action
    }
    */
    return function (e) {
        if (e.data.action === 'setTime') {
            clearInterval(mlHandler);
            internal_clock.setTime(e.data.time);
            mlHandler = mainLoopSocketed(velocity, client);
        } else if (e.data.action === 'setSpeed') {
            clearInterval(mlHandler);
            velocity = e.data.velocity;
            mlHandler = mainLoopSocketed(client);
        }
    }
}


/*

First function executed for initialization purposes.
Can receive a JS object with the following structure:
(? next to a key means the key is optional)
{
    name: str, // Name assigned to this clock
    destAddr: {
        port: Number,
        ip: str
    }?, // If ommited, the clock won't initalize a socket

}
*/
onmessage = function initState(e) {
    name = e.data.name;
    if (e.data.hasOwnProperty('destAddr')) {
        let dest = e.data.destAddr;
        client = dgram.createSocket('udp4');
        client.connect(dest.port, dest.ip);

        this.onmessage = execStateSocketed(client);
    } else {
        this.onmessage = execState();
    }
}

