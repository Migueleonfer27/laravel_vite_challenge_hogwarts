//Monica
const validateEmail = (email) => {
    let re = /\S+@\S+\.\S{3,}/;
    return re.test(email);
}
//Monica
const validatePassword = (password) => {
    let re = /^.{6,}$/;
    return re.test(password);
}
//Monica
const validateIsNotEmpty = (value) => {
    return value !== '';
}
//Monica
export  {
    validateEmail,
    validatePassword,
    validateIsNotEmpty
}