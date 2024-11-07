// Miguel León Fernández
export function setToken(token) {
    localStorage.setItem('authToken', token);
}

// Miguel León Fernández
export function getToken() {
    return localStorage.getItem('authToken');
}

// Miguel León Fernández
export function removeToken() {
    localStorage.removeItem('authToken');
}
