export const validationSeconds = () => {
    let valid = true;
    const seconds = document.getElementById('seconds').value;
    if (seconds < 0) {
        document.getElementById('seconds').value = 1;
        valid = false;
    }
    return valid;
}
export const validationEmpty = () => {
    let valid = true;
    const seconds = document.getElementById('seconds').value;
    if (seconds === '') {
        document.getElementById('seconds').value = 1;
        valid = false;
    }
    return valid;
}