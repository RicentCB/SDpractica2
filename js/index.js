var clockM;
var clock1;
var clock2;
var clock3;
const getRandom = maxNum=>(Math.floor(Math.random() * (maxNum+1)))

const initClocks = ()=>{
    clockM = new Clock(getRandom(24), getRandom(60), getRandom(60));
    clock1 = new Clock(getRandom(24), getRandom(60), getRandom(60));
    clock2 = new Clock(getRandom(24), getRandom(60), getRandom(60));
    clock3 = new Clock(getRandom(24), getRandom(60), getRandom(60));
}

const incrementClocks = ()=>{
    clockM.increment();
    clock1.increment();
    clock2.increment();
    clock3.increment();
}

const updateInterface = ()=>{
    //Reloj Maestro
    let domClockM = $(".clock#clock-m")
    domClockM.find("h1.hours").html(clockM.hour);
    domClockM.find("h1.mins").html(clockM.min);
    domClockM.find("h1.secs").html(clockM.sec);
    //Reloj 1
    let domClock1 = $(".clock#clock-1")
    domClock1.find("h1.hours").html(clock1.hour);
    domClock1.find("h1.mins").html(clock1.min);
    domClock1.find("h1.secs").html(clock1.sec);
    //Reloj 2
    let domClock2 = $(".clock#clock-2")
    domClock2.find("h1.hours").html(clock2.hour);
    domClock2.find("h1.mins").html(clock2.min);
    domClock2.find("h1.secs").html(clock2.sec);
    let domClock3 = $(".clock#clock-3")
    //Reloj 2
    domClock3.find("h1.hours").html(clock3.hour);
    domClock3.find("h1.mins").html(clock3.min);
    domClock3.find("h1.secs").html(clock3.sec);
}

//Inicializar Relojes
initClocks();
$(document).ready(function(){

})
