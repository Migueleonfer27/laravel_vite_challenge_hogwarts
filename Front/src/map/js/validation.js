const validationSeconds = () => {
    const seconds = document.getElementById('seconds').value;
    if (seconds < 0 || seconds > 59) {
        document.getElementById('seconds').value = 1;
    }
}