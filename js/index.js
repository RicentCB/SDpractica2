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


$(document).ready(function(){
    //Inicializar Relojes
    initClocks();

    console.log(clockM)
    console.log(clock1)
    console.log(clock2)
    console.log(clock3)
    
    
    // let interval1 = 1000;
    // setInterval(clock1.update(), interval1);


})