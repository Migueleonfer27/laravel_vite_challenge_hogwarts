const validateName = (name)=> {
    let re = /^[a-zA-Z\s]{3,}$/;
    return re.test(name);
}

const validateLevel = (level)=> {
    return level >= 1 && level <= 5;
}

const validateAttribute = (attack)=> {
    return attack >= 0 && attack <= 100;
}

const validateIsNotEmpty = (value) => {
    return value != '';
}

export {
    validateName,
    validateLevel,
    validateAttribute,
    validateIsNotEmpty
}