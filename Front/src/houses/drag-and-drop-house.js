let selectedImg = null;

// Miguel León Fernández
const handleDragStart = (e) => {
    if (e.target.tagName === 'IMG') {
        selectedImg = e.target;
    }
};

// Miguel León Fernández
const handleDragOver = (e) => {
    e.preventDefault();
    const zone = e.target.closest('.dropzone');
    if (zone) {
        const zoneImg = zone.querySelector('img');
        if (zoneImg !== selectedImg) {
            zone.classList.add('bg-ternary-person', 'rounded');
        }
    }
};

// Miguel León Fernández
const handleDragLeave = (e) => {
    e.preventDefault();
    const zone = e.target.closest('.dropzone');
    if (zone) {
        zone.classList.remove('bg-ternary-person', 'rounded');
    }
};

// Miguel León Fernández
const handleDrop = (e) => {
    e.preventDefault();
    const targetImg = e.target.closest('.dropzone')?.querySelector('img');
    const zone = e.target.closest('.dropzone');

    if (selectedImg && targetImg && selectedImg !== targetImg) {
        swapImages(selectedImg, targetImg);
    }
    resetSelection();
    zone.classList.remove('bg-ternary-person', 'rounded');
};

// Miguel León Fernández
const handleImageClick = (e) => {
    if (!selectedImg) {
        selectedImg = e.target;
        e.target.classList.add('bg-ternary-person', 'rounded');
    } else {
        const targetImg = e.target;
        if (selectedImg !== targetImg) {
            swapImages(selectedImg, targetImg);
        }
        resetSelection();
    }
};

// Miguel León Fernández
const swapImages = (img1, img2) => {
    const tempSrc = img1.src;
    img1.src = img2.src;
    img2.src = tempSrc;
};

// Miguel León Fernández
const resetSelection = () => {
    if (selectedImg) {
        selectedImg.classList.remove('bg-ternary-person', 'rounded');
        selectedImg = null;
    }
};

// Miguel León Fernández
const initializeDragAndDrop = () => {
    document.querySelectorAll('.dropzone').forEach(zone => {
        const img = zone.querySelector('img');
        img.addEventListener('dragstart', handleDragStart);
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
        img.addEventListener('click', handleImageClick);
    });
};

export {
    initializeDragAndDrop
};
