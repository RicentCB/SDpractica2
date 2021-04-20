const logClock = (name, time) => {
    console.log(`${name}: ${time.hours}:${time.minutes}:${time.seconds}`);
}

const asDoubleDigit = num => ((num < 10) ? ("0" + num) : num.toString())

const updateClockDom = (domElement, clock)=>{
    domElement.find("h1.hours").html(asDoubleDigit(clock.hours));
    domElement.find("h1.mins").html(asDoubleDigit(clock.minutes));
    domElement.find("h1.secs").html(asDoubleDigit(clock.seconds));
}

var workerM = new Worker('./js/clock.js');
var worker1 = new Worker('./js/clock.js');
var worker2 = new Worker('./js/clock.js');
var worker3 = new Worker('./js/clock.js');

//Reloj Maestro
workerM.onmessage = function (e) {
    let clockM = e.data;
    logClock('Master Clock', clockM);
    updateClockDom($(".clock#clock-m"), clockM);
}
//Reloj 1
worker1.onmessage = function (e) {
    let clock1 = e.data;
    logClock('Clock 1', clock1);
    updateClockDom($(".clock#clock-1"), clock1);
}
//Reloj 2
worker2.onmessage = function (e) {
    let clock2 = e.data;
    logClock('Clock 2', clock2);
    updateClockDom($(".clock#clock-2"), clock2);
}
//Reloj 3
worker3.onmessage = function (e) {
    let clock3 = e.data;
    logClock('Clock 3', clock3);
    updateClockDom($(".clock#clock-3"), clock3);
}

export default function main() {
    workerM.postMessage({
        name: "Reloj Maestro"
    });
    worker1.postMessage({
        name: "Reloj 1"
    });
    worker2.postMessage({
        name: "Reloj 2"
    });
    worker3.postMessage({
        name: "Reloj 3"
    });
}
