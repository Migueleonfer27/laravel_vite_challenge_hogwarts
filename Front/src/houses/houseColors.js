// Miguel León Fernández
const changeColor = async (house) => {
    const header = document.querySelector('#navbar');
    const footer = document.querySelector('#footer');

    switch (house) {
        case 'Gryffindor':
            header.classList.add('bg-griffindor');
            footer.classList.add('bg-griffindor');
            break;

        case 'Hufflepuff':
            header.classList.add('bg-hufflepuff');
            footer.classList.add('bg-hufflepuff');
            break;

        case 'Ravenclaw':
            header.classList.add('bg-ravenclaw');
            footer.classList.add('bg-ravenclaw');
            break;

        case 'Slytherin':
            header.classList.add('bg-slytherin');
            footer.classList.add('bg-slytherin');
            break;
    }
}

export {
    changeColor,
}