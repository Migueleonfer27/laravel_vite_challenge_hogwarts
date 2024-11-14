//Miguel León Fernández
const getPotions = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/potions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            return data.potions;
        } else {
            throw new Error('Error fetching potions');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

export {
    getPotions
};