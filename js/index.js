const logClock = (name, time)=>{
    console.log(`${name}: ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
}

const asDoubleDigit = num=> {
    if (num < 10)
        return "0" + num;
    else
        return num.toString();
}

const updateClockDom = (domElement, clock)=>{
    domElement.find("h1.hours").html(asDoubleDigit(clock.getHours()));
    domElement.find("h1.mins").html(asDoubleDigit(clock.getMinutes()));
    domElement.find("h1.secs").html(asDoubleDigit(clock.getSeconds()));
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
    setInterval(function () {
        workerM.postMessage(["getTime"]);
        worker2.postMessage(["getTime"]);
        worker1.postMessage(["getTime"]);
        worker3.postMessage(["getTime"]);
    }, 1000);
}
