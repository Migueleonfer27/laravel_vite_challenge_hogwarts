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
         window.location.href = '../student/index.html'
    }
    else if (path === '/student' && token != null && token !== ''){
         window.location.href = '../student/index.html'
    }
    else if (path === '/student-profile' && token != null && token !== ''){
        window.location.href = '../student/profile.html'
    }
    else {
        window.location.href = '../index.html'
    }
}