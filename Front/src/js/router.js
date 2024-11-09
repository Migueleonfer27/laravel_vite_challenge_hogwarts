export async function loadPage(path) {
    const contentDiv = document.getElementById('main-container');

    // con este if se realiza una carga perezosa(lazy load) de las paginas
    if (path === '/'){
        const { initAuth } = await import('../auth/page-auth.js');
        initAuth();
    }
    else if (path === '/email'){
        const { default: email } = await import('../email/js/email.js');
        email();
    }
    // else if (path === '/home'){
    //     if(comprobar tiken){
    //         const { default: home } = await import('../home/js/home.js');
    //         home();
    //     }else{
    //         const { initAuth } = await import('../auth/page-auth.js');
    //         initAuth();
    //     }
    //
    // }
    else {
        contentDiv.innerHTML = '<h1 class="text-light ">404 - Página no encontrada</h1>'
    }
}