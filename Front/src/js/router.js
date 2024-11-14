export async function loadPage(path) {
    const token = localStorage.getItem('authToken')
    const roles = localStorage.getItem('roles'); // Usar más adelante para controlar abilities

    if (path === '/index.html') {
        if(token != null && token !== '') {
            loadPage('/admin')
        } else {
            const { initAuth } = await import('../auth/page-auth.js');
            initAuth();
        }
    } else if (path === '/email') {
        window.location.href = '../email/index.html'
    } else if (path === '/admin' && token != null && token !== '') {
        window.location.href = '../User/Admin/index.html'
    } else if (path === '/potions' && token != null && token !== '') {
        window.location.href = '../potions/index.html'
    } else {
        window.location.href = '../index.html'
    }
}