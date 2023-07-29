export const ageValidator = (age)=>{
    if(parseInt(age) < 40){
        return false;
    }
    if(parseInt(age) > 80){
        return false;
    }
    return true;
}