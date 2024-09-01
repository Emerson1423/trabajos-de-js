// --- Datos iniciales y funciones generales ---
let games = JSON.parse(localStorage.getItem('gamesData')) || [];
let categories = JSON.parse(localStorage.getItem('categoriesData')) || ['Acción', 'Aventura', 'Deportes'];
let editGameId = null;

// Función para guardar datos en localStorage
function saveGames() {
    console.log(games); // Verifica los datos antes de guardarlos
    localStorage.setItem('gamesData', JSON.stringify(games));
}


// Función para guardar categorías en localStorage
function saveCategories() {
    localStorage.setItem('categoriesData', JSON.stringify(categories));
}

// Función para mostrar alertas
function showAlert(message) {
    alert(message); // Podrías mejorar esto con una función personalizada para mostrar mensajes en pantalla
}

// --- Funciones para la página de inicio (index.html) ---

// Función para cargar el filtro de categorías
function loadCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">Todas</option>'; // Opción para mostrar todas las categorías
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
}

// Función para manejar el formulario de búsqueda
document.getElementById('searchForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    const category = document.getElementById('categoryFilter').value;
    const filteredGames = searchGames(query, category);
    displayGames(filteredGames);
});

// Función para mostrar los juegos en la lista
function displayGames(gamesToDisplay) {
    const gamesList = document.getElementById('gamesList');
    if (gamesList) {
        gamesList.innerHTML = ''; // Limpiar la lista antes de añadir nuevos elementos
        gamesToDisplay.forEach(game => {
            const li = document.createElement('li');
            li.innerHTML = `
                <br> Nombre: ${game.name}
                <br> Género: ${game.category}
                <br> Precio: $${game.price}
                <br> Fecha de Lanzamiento: ${game.releaseDate}
                <br> Descripción: ${game.description}
            `;
            
            // Solo agregar los botones de edición/eliminación si estamos en la página de admin
            if (window.location.pathname.includes('admin.html')) {
                li.appendChild(createEditButton(game.id));
                li.appendChild(createDeleteButton(game.id));
            }

            gamesList.appendChild(li);
        });
    }
}



// Función para mostrar/ocultar el botón de gestión
function toggleAdminButton() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const adminButton = document.getElementById('adminButton');
    const logoutButton = document.getElementById('logoutButton');
    if (adminButton && logoutButton) {
        if (isLoggedIn) {
            adminButton.style.display = 'block'; // Mostrar botón de gestión
            logoutButton.style.display = 'block'; // Mostrar botón de cerrar sesión
        } else {
            adminButton.style.display = 'none'; // Ocultar botón de gestión
            logoutButton.style.display = 'none'; // Ocultar botón de cerrar sesión
        }
    }
}

// Llama a esta función al cargar la página
toggleAdminButton();

// Función para manejar el cierre de sesión
document.getElementById('logoutButton')?.addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html'; // Redirige al usuario a la página de inicio
});

// Cargar juegos desde un archivo JSON (solo para la página de inicio)

// Función para cargar juegos desde localStorage

function loadGames() {
    


    if (window.location.pathname.includes('admin.html')) {
        loadGamesForAdmin();
    } else {
        const storedGames = JSON.parse(localStorage.getItem('gamesData')) || [];
        fetch('gamesData.json')
            .then(response => response.json())
            .then(data => {
                const allGames = [...data, ...storedGames];
                displayGames(allGames);
            })
            .catch(error => console.error('Error loading games:', error));
    }
}




// Función para cargar los juegos (se utiliza también en admin.html)
function loadGamesForAdmin() {
    displayGames(games); // Reutilizar la función de displayGames
}

// Función para buscar juegos
function searchGames(query, category) {
    return games.filter(game => {
        const matchesQuery = game.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category ? game.category === category : true;
        return matchesQuery && matchesCategory;
    });
}

// --- Funciones para la página de administración (admin.html) ---

// Función para cargar las categorías en el select
function loadCategories() {
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Función para crear el botón de editar
function createEditButton(id) {
    const btn = document.createElement('button');
    btn.textContent = 'Editar';
    btn.onclick = function () {
        const game = games.find(g => g.id === id);
        if (game) {
            document.getElementById('name').value = game.name;
            document.getElementById('category').value = game.category;
            document.getElementById('releaseDate').value = game.releaseDate;
            document.getElementById('price').value = game.price;
            document.getElementById('description').value = game.description;
            editGameId = id;
        }
    };
    return btn;
}

// Función para crear el botón de eliminar
function createDeleteButton(id) {
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = function () {
        deleteGame(id);
    };
    return btn;
}


// Función para agregar o editar un juego
document.getElementById('gameForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar los datos del formulario
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value.trim();
    const releaseDate = document.getElementById('releaseDate').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value.trim();

    // Validar los datos
    if (!name || !category || !releaseDate || isNaN(price) || price <= 0) {
        showAlert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Agregar o editar el juego
    if (editGameId) {
        const game = games.find(g => g.id === editGameId);
        if (game) {
            game.name = name;
            game.category = category;
            game.releaseDate = releaseDate;
            game.price = price;
            game.description = description;
            editGameId = null;
        }
    } else {
        const newGame = {
            id: Date.now(),
            name: name,
            category: category,
            releaseDate: releaseDate,
            price: price,
            description: description
        };
        games.push(newGame);
    }

    // Guardar en localStorage y recargar juegos
    saveGames();
    loadGames();
    this.reset();
});


// Función para agregar una nueva categoría
document.getElementById('categoryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const newCategory = document.getElementById('newCategory').value.trim();

    if (!newCategory) {
        showAlert('Por favor, ingresa un nombre de categoría.');
        return;
    }

    if (!categories.includes(newCategory)) {
        categories.push(newCategory);
        saveCategories();
        loadCategories();
        showAlert('Categoría agregada exitosamente.');
    } else {
        showAlert('La categoría ya existe.');
    }

    this.reset();
});

// Admin: Función para verificar si el usuario está logueado
function checkAdminAccess() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
        alert('Debes iniciar sesión para acceder a la administración.');
        window.location.href = 'login.html';
    }
}

// Admin: Llama a esta función al cargar la página admin.html
if (window.location.pathname.includes('admin.html')) {
    checkAdminAccess();
}

// Admin: Función para manejar el cierre de sesión
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

// Admin: Inicializar
document.getElementById('logoutButton')?.addEventListener('click', logout);

// --- Funciones para la página de login (login.html) ---
const validUser = { username: "admin", password: "12345" }; // Variables y datos válidos

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUser.username && password === validUser.password) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        showAlert('Credenciales incorrectas');
    }
});

// --- Funciones comunes para inicialización ---
function initialize() {
    loadCategories(); // Cargar categorías en admin
    loadCategoryFilter(); // Cargar categorías en el filtro de búsqueda
    loadGames(); // Cargar juegos
}

document.addEventListener('DOMContentLoaded', initialize);


initialize();
