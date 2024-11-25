const validateEmail = (email) => {
    let re = /\S+@\S+\.\S{3,}/;
    return re.test(email);
}

const validatePassword = (password) => {
    let re = /^.{6,}$/;
    return re.test(password);
}

const validateIsNotEmpty = (value) => {
    return value !== '';
}

export  {
    validateEmail,
    validatePassword,
    validateIsNotEmpty
}