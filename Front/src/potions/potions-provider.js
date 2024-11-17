import { getToken } from "../../storage/tokenManager";

//Miguel León Fernández
const getPotions = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/potions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
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
    }
};

//Miguel León Fernández
const removePotion = async (id) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/potions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            return true;
        } else {
            throw new Error('Error fetching potions');
        }
    } catch (error) {
        console.error(error);
    }
};

// Miguel León Fernández
const updatePotion = async (id, name, ingredients) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/potions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ name, ingredients }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Potion updated:", data);
            return true;
        } else {
            console.error("Error updating potion:", data);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};


// Miguel León Fernández
const createPotion = async (name, ingredients) => {
    try {
        const creator = localStorage.getItem("name");
        const response = await fetch(`http://127.0.0.1:8000/api/potions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                name: name,
                creator: creator,
                ingredients: ingredients,
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Potion created:", data);
            return true;
        } else {
            console.log('Error creating potion');
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

export {
    getPotions,
    removePotion,
    updatePotion,
    createPotion,
};