class Clock{
    constructor(hour, min, sec){
        this._hour = hour;
        this._min = min;
        this._sec = sec;
    }
    get hour(){
        if(this._hour.toString().length < 2)
            return `0${this._hour}`;
        return this._hour;
    }
    get min(){
        if(this._min.toString().length < 2)
            return `0${this._min}`;
        return this._min;
    }
    get sec(){
        if(this._sec.toString().length < 2)
            return `0${this._sec}`;
        return this._sec;
    }


    increment(){
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