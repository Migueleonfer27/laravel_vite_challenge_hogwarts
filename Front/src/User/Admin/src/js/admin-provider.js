//Monica

export async function getUsuario(id){
    const opciones = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let url = 'http://127.0.0.1:8000/api/user/' + id

    const res = await fetch(url, opciones)
    const data = await res.json()
    return data
}