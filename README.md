# 🔮 Escuela de hechicería Hogwarts 🔮
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

### Rutas de la API

#### **Autenticación**
- `POST /register`  
  Registro de un nuevo usuario.
- `POST /login`  
  Inicio de sesión del usuario.
- `POST /logout`  
  Cierre de sesión (requiere autenticación).

#### **Administración (Requiere rol específico)**
- `GET /admin/users`  
  Listar todos los usuarios (Roles permitidos: `dumbledore`, `admin`).
- `GET /admin/user/{id}`  
  Ver detalles de un usuario por ID (Roles permitidos: `dumbledore`, `teacher`, `student`).
- `POST /admin/user`  
  Crear un nuevo usuario (Roles permitidos: `dumbledore`, `admin`).
- `PUT /admin/user/{id}`  
  Actualizar un usuario por ID (Roles permitidos: `dumbledore`, `admin`).
- `DELETE /admin/user/{id}`  
  Eliminar un usuario por ID (Roles permitidos: `dumbledore`, `admin`).
- `POST /admin/user-rol/{id}`  
  Asignar un rol a un usuario (Roles permitidos: `dumbledore`, `admin`).
- `DELETE /admin/user-rol/{id}`  
  Retirar un rol a un usuario (Roles permitidos: `dumbledore`, `admin`).

#### **Casas**
- `GET /getHouse`  
  Obtener información de las casas (requiere autenticación).

#### **Asignaturas**
- `GET /subjects`  
  Listar todas las asignaturas.
- `GET /subject/{id}`  
  Ver detalles de una asignatura por ID.
- `POST /subjects`  
  Crear una nueva asignatura.
- `PUT /subject/{id}`  
  Actualizar una asignatura por ID.
- `DELETE /subject/{id}`  
  Eliminar una asignatura por ID.
- `POST /subjects/{subjectId}/assign-subject`  
  Asignar una asignatura a un usuario.
- `DELETE /subjects/{subjectId}/remove-subject`  
  Retirar una asignatura de un usuario.
- `GET /user/{id}/subjects`  
  Listar asignaturas de un usuario por ID.

#### **Ingredientes**
- `GET /ingredients`  
  Listar todos los ingredientes (requiere autenticación).
- `POST /ingredients`  
  Crear un nuevo ingrediente (Roles permitidos: `dumbledore`, `admin`, `teacher`).
- `DELETE /ingredients/{id}`  
  Eliminar un ingrediente por ID (Roles permitidos: `dumbledore`, `admin`, `teacher`).

#### **Pociones**
- `GET /potions`  
  Listar todas las pociones.
- `POST /potions`  
  Crear una nueva poción.
- `GET /potions/{id}`  
  Ver detalles de una poción por ID.
- `PUT /potions/{id}`  
  Actualizar una poción por ID.
- `DELETE /potions/{id}`  
  Eliminar una poción por ID.
- `POST /approve/{potionId}`  
  Aprobar una poción (requiere autenticación).

#### **Hechizos**
- `GET /spell/`  
  Listar todos los hechizos (Roles permitidos: `dumbledore`, `teacher`).
- `POST /spell/`  
  Crear un nuevo hechizo (Roles permitidos: `student`, `teacher`, `dumbledore`).
- `PUT /spell/{id}`  
  Actualizar un hechizo por ID (Roles permitidos: `teacher`, `dumbledore`).
- `DELETE /spell/{id}`  
  Eliminar un hechizo por ID (Roles permitidos: `teacher`, `dumbledore`).

#### **Duelos**
- `GET /duels/`  
  Listar todos los duelos activos (requiere autenticación).
- `POST /duels/create`  
  Crear un nuevo duelo (requiere autenticación).
- `POST /duels/castSpells`  
  Lanza hechizos en un duelo (requiere autenticación).

### Ejemplo de Solicitudes
Usa herramientas como Postman o cURL para probar las rutas. Ejemplo:

bash
curl -X GET "http://localhost:8000/api/admin/users" -H "Authorization: Bearer <TOKEN>"


---

## Contribuidores

- *Monica Méndez del Campo*
- *Miguel León Fernández*
- *Cynthia Rivas del Moral*

---

## Licencia

Este proyecto está bajo la licencia Apache-2.0 license.

---