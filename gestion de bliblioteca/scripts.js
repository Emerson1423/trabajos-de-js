// Definición de la clase de autenticación
class Authenticator {
    constructor() {
        this.validUser = { username: 'admin', password: '12345' }; // Usuario y contraseña válidos
    }

    // Método para verificar credenciales
    authenticate(username, password) {
        return username === this.validUser.username && password === this.validUser.password;
    }

    // Método para manejar el inicio de sesión
    handleLogin(username, password) {
        if (this.authenticate(username, password)) {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'admin.html'; // Redirige a la página de administración
        } else {
            alert('Credenciales incorrectas');
        }
    }
}

// Crear una instancia de la clase Authenticator
const auth = new Authenticator();

 // Función para manejar el formulario de inicio de sesión
 document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '12345') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'admin.html'; // Redirigir a administración al iniciar sesión
    } else {
        alert('Credenciales incorrectas');
    }
});


// scripts.js

// Clase para representar un libro
class Libro {
    constructor(id, titulo, autor, categoria, fechaPublicacion, disponible) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.categoria = categoria;
        this.fechaPublicacion = fechaPublicacion;
        this.disponible = disponible;
    }
    
}

// Clase para gestionar la biblioteca
class Biblioteca {
    constructor() {
        this.libros = JSON.parse(localStorage.getItem('libros')) || [];
    }

    // Método para agregar un libro
    agregarLibro(libro) {
        this.libros.push(libro);
        this.guardarDatos();
    }

    // Método para eliminar un libro
    eliminarLibro(id) {
        this.libros = this.libros.filter(libro => libro.id !== id);
        this.guardarDatos();
    }

    // Método para buscar libros
    buscarLibros(query) {
        return this.libros.filter(libro => libro.titulo.toLowerCase().includes(query.toLowerCase()));
    }
   // Método para editar un libro
   editarLibro(id, datosActualizados) {
    const libro = this.libros.find(libro => libro.id === id);
    if (libro) {
        Object.assign(libro, datosActualizados);
        this.guardarDatos();
    }
}

    // Método para guardar datos en localStorage
    guardarDatos() {
        localStorage.setItem('libros', JSON.stringify(this.libros));
    }
}

// Instanciar la biblioteca
const biblioteca = new Biblioteca();

