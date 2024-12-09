# laravel_vite_challenge_hogwarts
Este proyecto es una plataforma de aprendizaje para estudiantes y profesores de Hogwarts, diseñada como una aplicación web con funcionalidades interactivas y simulaciones de las actividades mágicas más icónicas de la escuela.
---

# Escuela de Hechicería - Proyecto Laravel 11

Este proyecto simula una escuela de hechicería inspirada en el universo de Harry Potter. Está desarrollado en Laravel 11 para el backend y Vite para la gestión del frontend, utilizando Bootstrap y JavaScript para una interfaz interactiva y amigable.

## Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Ejecución](#ejecución)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Rutas de la API](#rutas-de-la-api)
6. [Contribuidores](#contribuidores)
7. [Licencia](#licencia)

---

## Requisitos

Antes de iniciar, asegúrate de tener instalados los siguientes componentes:

- PHP 8.1 o superior
- Composer
- Node.js y npm
- Servidor web como Apache o Nginx

---

## Instalación

1. Clona este repositorio:
   bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>


2. Instala las dependencias de PHP con Composer:
   bash
   composer install


3. Configura el archivo .env:
    - Copia el archivo de ejemplo:
      bash
      cp .env.example .env

    - Configura las variables de entorno, incluyendo la base de datos.

4. Genera la clave de la aplicación:
   bash
   php artisan key:generate


5. Instala las dependencias de Node.js:
   bash
   npm install


---

## Ejecución

### Backend
1. Actualiza las dependencias de Composer:
   bash
   composer update


2. Inicia el servidor de desarrollo:
   bash
   php artisan serve

   O, para especificar un host personalizado:
   bash
   php artisan serve --host="IP_DESEADA"


### Frontend
1. Compila y sirve los recursos con Vite:
   bash
   npm start


---

## Estructura del Proyecto

- *Backend (Laravel 11)*:
    - Controladores: Manejan la lógica del negocio.
    - Rutas: Definidas en routes/api.php.
    - Middleware: Control de acceso y autenticación.
- *Frontend (Vite, Bootstrap, JavaScript)*:
    - Estilos y diseño con Bootstrap.
    - Funcionalidades dinámicas con JavaScript.

---

## Rutas de la API

### Rutas principales
- *Autenticación*:
    - POST /register: Registro de usuario.
    - POST /login: Inicio de sesión.
    - POST /logout: Cierre de sesión.

- *Administración*:
    - GET /admin/users: Listado de usuarios.
    - POST /admin/user: Crear usuario.
    - ...

[Consulta routes/api.php para más detalles.](#)

### Ejemplo de Solicitudes
Usa herramientas como Postman o cURL para probar las rutas. Ejemplo:

bash
curl -X GET "http://localhost:8000/api/admin/users" -H "Authorization: Bearer <TOKEN>"


---

## Contribuidores

- *Monica*
- *Miguel León Fernández*
- *Cynthia*

---

## Licencia

Este proyecto está bajo la licencia Apache-2.0 license.

---