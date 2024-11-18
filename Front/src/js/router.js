export async function loadPage(path) {
    const token = localStorage.getItem('authToken')
    const roles = localStorage.getItem('roles'); // Usar más adelante para controlar abilities

    if (path === '/index.html') {
        if (token != null && token !== '') {
            loadPage('/admin')
        } else {
            const {initAuth} = await import('../auth/page-auth.js');
            initAuth();
        }
    } else if (path === '/email') {
        window.location.href = '../email/index.html'
    } else if (path === '/admin' && token != null && token !== '') {
        window.location.href = '../user/admin/index.html'
    } else if (path === '/potions' && token != null && token !== '') {
        window.location.href = '../potions/potions.html'
    } else if (path === '/ingredients' && token != null && token !== '') {
        window.location.href = '../ingredients/ingredients.html'
    } else {
        window.location.href = '../index.html'
    }
}