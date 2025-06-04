export const getlocation=(callback,errorcalback)=>{
    if("getlocation" in navigator){
        navigator.geolocation.getCurrentPosition(
            (position)=>callback(position.coords),
            (error)=>errorcalback(error)
        );

    }else{
        errorcalback("geolocation not supported");
    }
}