function getCondoSizeValue(x) {
    if(between(x, 0, 10)){
        return "<10";
    }
    else if(between(x, 11, 49)){
        return "11-49";
    }
    else if(between(x, 50, 200)){
        return "50-200";
    }
    else {
        return ">200";
    }
}


function calculateCharges(stat, query){
    var charges = 0;
    if(between(stat.condo_size, 0, 49)) {
        charges += stat.service_none;
        if(query.elevator === "true"){
            charges += stat.service_elevator;
        }
        if(query.heating === "true"){
            charges += stat.service_heater;
        }
    }
    else {
        if(query.elevator === "true"){
            charges += stat.service_elevator;
        }
        if(query.heating === "true" || query.elevator === "true" || query.employee === "true"){
            charges += stat.service_elevator_heater_employee;
        }
        if(query.heating === "true" || query.elevator === "true"){
            charges += stat.service_elevator_heater;
        }
    }
    return charges;
}

function between(x, min, max) {
    return x >= min && x <= max;
}


module.exports = {getCondoSizeValue, calculateCharges};