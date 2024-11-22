const validateName = (name)=> {
    let re = /^[a-zA-Z\s]{3,}$/;
    return re.test(name);
}

const validateLevel = (level)=> {
    return level >= 1 && level <= 5;
}

const validateAttribute = (attribute)=> {
    return attribute >= 0 && attribute <= 100;
}

const validateIsNotEmpty = (value) => {
    return value.trim !== '';
}

export {
    validateName,
    validateLevel,
    validateAttribute,
    validateIsNotEmpty
}