import { getToken } from "../../storage/tokenManager";
import {BASE_URL} from "../parameters/parameters";

//Miguel León Fernández
const getIngredients = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/ingredients`, {
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
        const response = await fetch(`${BASE_URL}/api/ingredients`, {
            method: "POST",
            headers: {
                'authorization': `Bearer ${getToken()}`,
            },
            body: ingredient,
        });

        const data = await response.json();

        if (response.ok) {
            return data.ingredient;
        } else {
            throw new Error(data.message || "Error creating ingredient");
        }
    } catch (error) {
        console.error("Error en la API:", error.message);
        return null;
    }
};

//Miguel León Fernández
const removeIngredient = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/ingredients/${id}`, {
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
    removeIngredient,
}