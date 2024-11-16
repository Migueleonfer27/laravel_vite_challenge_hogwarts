export async function loadPage(path) {
    const token = localStorage.getItem('authToken')

    if (path === '/index.html'){
        if(token != null && token !== ''){
            window.location.href = '../chooseRole/index.html'
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
    }else if(path === '/dumbledore' && token != null && token !== ''){
        window.location.href = '../User/Admin/index.html'
    }
    else if (path === '/teacher' && token != null && token !== ''){
        // window.location.href = ''
    }
    else if (path === '/estudent' && token != null && token !== ''){
        // window.location.href = ''
    }
    else {
        window.location.href = '../index.html'
    }
}