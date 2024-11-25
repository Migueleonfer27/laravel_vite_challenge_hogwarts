// Miguel León Fernández
const buildNavIngredients = (idContainer) => {
    const container = document.querySelector(idContainer);
    const currentPath = window.location.pathname;

    if (currentPath.includes('ingredients') || currentPath.includes('potions')) {
        container.innerHTML += `
            <nav id="secondary-nav" class="navbar bg-primary-person p-0 m-0">
                <div class="container-fluid p-0">
                    <ul class="nav nav-pills w-100 flex-column flex-md-row m-0">
                        <li class="nav-item flex-fill text-center fs-5 mb-md-0 border">
                            <a class="nav-link btn text-shadow-person text-primary-person bg-gradient-creator border-0 rounded-0 py-3 ${currentPath.includes('ingredients') ? 'active' : ''}" 
                               href="../ingredients/ingredients.html">
                                Crear Ingredientes
                            </a>
                        </li>
                        <li class="nav-item flex-fill text-center fs-5 border">
                            <a class="nav-link btn text-shadow-person text-primary-person bg-gradient-creator border-0 rounded-0 py-3 ${currentPath.includes('potions') ? 'active' : ''}" 
                               href="../potions/potions.html">
                                Crear Pociones
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }
};

export { buildNavIngredients };
