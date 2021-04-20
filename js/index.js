const logClock = (name, time) => {
    console.log(`${name}: ${time.hours}:${time.minutes}:${time.seconds}`);
}

const asDoubleDigit = num => ((num < 10) ? ("0" + num) : num.toString())

function updateClockDom(domElement, clock) {
    domElement.find("h1.hours").html(asDoubleDigit(clock.hours));
    domElement.find("h1.mins").html(asDoubleDigit(clock.minutes));
    domElement.find("h1.secs").html(asDoubleDigit(clock.seconds));
}

function assignVelocityController(worker, domElements) {
    let velocity = 1.0;
    let delta = 0.1;
    let maximum = 2;

    (function () {
        console.log("Assigning callbacks");
        domElements.increase.on('click', function (e) {
            e.preventDefault();
            if ((velocity - delta) > 0) {
                velocity -= delta;
                console.log("Increasing velocity to " + velocity);
                worker.postMessage({
                    action: 'setVelocity',
                    velocity: velocity
                });
            }
        });
        domElements.decrease.on('click', function (e) {
            e.preventDefault();
            if ((velocity + delta) < maximum) {
                velocity += delta;
                console.log("Decreasing velocity to " + velocity);
                worker.postMessage({
                    action: 'setVelocity',
                    velocity: velocity
                });
            }
        });
    })();
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

    assignVelocityController(workerM, {
        increase: $(".clock#clock-m .front-step"),
        decrease: $(".clock#clock-m .back-step")
    });

    assignVelocityController(worker1, {
        increase: $(".clock#clock-1 .front-step"),
        decrease: $(".clock#clock-1 .back-step")
    });

    assignVelocityController(worker2, {
        increase: $(".clock#clock-2 .front-step"),
        decrease: $(".clock#clock-2 .back-step")
    });

    assignVelocityController(worker3, {
        increase: $(".clock#clock-3 .front-step"),
        decrease: $(".clock#clock-3 .back-step")
    });
}