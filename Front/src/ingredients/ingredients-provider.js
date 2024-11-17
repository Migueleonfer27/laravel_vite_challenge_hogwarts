import { getToken } from "../../storage/tokenManager";

//Miguel León Fernández
const getIngredients = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/ingredients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${getToken()}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data.ingredients;
        } else {
            throw new Error(data.message || 'Error fetching ingredients');
        }
    } catch (error) {
        console.error('getIngredients error:', error.message);
        return null;
    }
}

//Miguel León Fernández
const createIngredient = async (ingredient) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/ingredients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(ingredient),
        });

        const data = await response.json();

        if (response.ok) {
            return data.ingredient;
        } else {
            throw new Error(data.message || 'Error creating ingredient');
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Miguel León Fernández
const deleteIngredient = async (id) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${getToken()}`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            return true;
        } else {
            throw new Error(data.message || 'Error deleting ingredient');
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    getIngredients,
    createIngredient,
    deleteIngredient,
}