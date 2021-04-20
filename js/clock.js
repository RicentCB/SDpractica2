class Clock{
    constructor(hour, min, sec){
        this._hour = hour;
        this._min = min;
        this._sec = sec;
    }
    get hour(){
        if(this._hour.toString().length < 2)
            return `0${this._hour}`;
    }
    get min(){
        if(this._min.toString().length < 2)
            return `0${this._min}`;
    }
    get sec(){
        if(this._sec.toString().length < 2)
            return `0${this._sec}`;
    }
    set hour(newHour){
        this._hour = newHour;
    }
    set min(newMin){
        this._min = newMin;
    }
    set sec(newSec){
        this._sec = newSec;
    }

    update(){
        this._sec += 1;
        if(this._sec == 60){
            this._sec = 0
            this._min += 1;
        }
        if(this._min == 60){
            this._min = 0
            this._hour += 1;
        }
        if(this._hour == 25){
            this._hour = 0
        }
    }
}