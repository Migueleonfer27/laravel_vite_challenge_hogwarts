//Monica
const validateName = (name)=> {
    let re = /^[a-zA-Z\s]{3,}$/;
    return re.test(name);
}
//Monica
const validateLevel = (level)=> {
    return level >= 1 && level <= 5;
}
//Monica
const validateAttribute = (attribute)=> {
    return attribute >= 0 && attribute <= 100;
}
//Monica
const validateIsNotEmpty = (value) => {
    return value.trim !== '';
}
//Monica
export {
    validateName,
    validateLevel,
    validateAttribute,
    validateIsNotEmpty
}