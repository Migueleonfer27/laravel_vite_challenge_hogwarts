export async function loadPage(path) {
    const token = localStorage.getItem('authToken')

    if (path === '/'){
        if(token != null && token !== ''){
            loadPage('/admin')
        }
        else {
            const { initAuth } = await import('../auth/page-auth.js');
            initAuth();
        }
    }
    else if (path === '/email'){
        window.location.href = '../email/index.html'
    }
    else if (path === '/admin' && token != null && token !== ''){
        window.location.href = '../User/Admin/index.html'
    }
    else {
        loadPage('/')
    }
}