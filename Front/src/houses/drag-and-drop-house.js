let draggedImg = null;

// Miguel León Fernández
const handleDragStart = (e) => {
    if (e.target.tagName === 'IMG') {
        draggedImg = e.target;
    }
};

// Miguel León Fernández
const handleDragOver = (e) => {
    e.preventDefault();
};

// Miguel León Fernández
const handleDrop = (e) => {
    e.preventDefault();
    const targetImg = e.target.closest('.dropzone').querySelector('img');

    if (draggedImg && targetImg && draggedImg !== targetImg) {
        const tempSrc = draggedImg.src;
        draggedImg.src = targetImg.src;
        targetImg.src = tempSrc;
    }
};

// Miguel León Fernández
const initializeDragAndDrop = () => {
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragstart', handleDragStart);
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
};

export {
    initializeDragAndDrop
}