// Miguel León Fernández
const buildSearch = async (id, nameElement, fatherContainer, onSearchCallback) => {
    const searchContainer = document.createElement("div");
    searchContainer.className = "container-fluid mt-4 bg-gradient-potions p-4 rounded border text-shadow-person";
    searchContainer.innerHTML = `
        <h3 class="text-primary-person">Buscador de ${nameElement}</h3>
        <input type="text" id="${id}" class="form-control text-primary-person bg-hexa-person fs-5 fs-md-1 text-shadow-light-person" placeholder="Buscar ${nameElement}...">
    `;
    fatherContainer.appendChild(searchContainer);
    const searchInput = searchContainer.querySelector(`#${id}`);
    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        if (onSearchCallback && typeof onSearchCallback === "function") {
            onSearchCallback(query);
        }
    });
};

export {
    buildSearch
}