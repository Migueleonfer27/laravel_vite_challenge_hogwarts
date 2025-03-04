// Cynthia
// Miguel León Fernández
export async function loadPage(path) {
    const token = localStorage.getItem('authToken')

    if (path === '/index.html'){
        if(token != null && token !== ''){
            window.location.href = '../chooseRole/index.html'
        } else {
            const { initAuth } = await import('../auth/page-auth.js');
            initAuth();
        }
    } else if (path === '/email') {
        window.location.href = '../email/index.html'
    } else if (path === '/student-teacher' && token != null && token !== ''){
         window.location.href = '../student-teacher/student-teacher.html'
    } else if (path === '/student-teacher-profile' && token != null && token !== ''){
        window.location.href = '../student-teacher/profile.html'
    } else if (path === '/admin' && token != null && token !== ''){
        window.location.href = '../user/admin/index.html'
    } else if(path === '/dumbledore' && token != null && token !== ''){
        window.location.href = '../user/admin/index.html'
    } else if (path === '/teacher-subject-potion' && token != null && token !== ''){
        window.location.href = '../potions/potions.html'
    } else if (path === '/student-subject-potion' && token != null && token !== ''){
         window.location.href = '../potions/potions.html'
    } else if (path === '/ingredients' && token != null && token !== '') {
        window.location.href = '../ingredients/ingredients.html'
    } else if (path === '/student-subject-spell' && token != null && token !== ''){
        window.location.href = '../spell/index.html'
    } else if (path === '/teacher-subject-spell' && token != null && token !== '') {
        window.location.href = '../spell/index.html'
    } else if (path === '/start-duels' && token != null && token !== '') {
        window.location.href = '../duels/index.html'
    }else if (path === '/duels' && token != null && token !== '') {
        window.location.href = '../duels/duels.html'
    } else {
        window.location.href = '../index.html'
    }
}