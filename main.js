// Definición de un array para almacenar usuarios registrados
const usuarios = [new Usuario("", "")];
let usuarioActivo = null; // Variable que mantiene al usuario activo

// Constructor de la clase Usuario que incluye nombre de usuario, contraseña, categorías, gastos y presupuestos
function Usuario(username, password){
    this.username = username;
    this.password = password;
    this.categorias = []; // Array de categorías creadas por el usuario
    this.gastos = [];     // Array de gastos del usuario
    this.pres = [];       // Array de presupuestos por categoría
}

// Función para cambiar el título de la página
function cambiarTitulo(nuevoTitulo){
    document.title = nuevoTitulo;
}

// Muestra la pantalla de inicio de sesión y oculta las demás
function mostrarIS() {
    document.getElementById('register-box').style.display = "none";
    document.getElementById('login-box').style.display = "block";
    document.getElementById('main').style.display = "none";
    cambiarTitulo("Iniciar Sesión");
    // Limpiar los campos de inicio de sesión
    document.getElementById("is-usuario").value = '';
    document.getElementById("is-contra").value = '';
}

// Muestra la pantalla de registro y oculta las demás
function mostrarR() {
    document.getElementById('login-box').style.display = "none";
    document.getElementById('register-box').style.display = "block";
    cambiarTitulo("Registrarse");
    // Limpiar los campos de registro
    document.getElementById("r-usuario").value = '';
    document.getElementById("r-contra").value = '';
}

// Muestra la pantalla principal (después de iniciar sesión)
function mostrarMain() {
    document.getElementById('login-box').style.display = "none";
    document.getElementById('main').style.display = "block";
    cambiarTitulo("Página principal");
    gastosInput(); // Actualizar el formulario de gastos
    pressInput();  // Actualizar el formulario de presupuestos
    actualizarListaCategorias(); // Actualizar las categorías y el select de filtro
    actualizarListaGastos();     // Actualizar la lista de gastos
}

// Función para registrar un nuevo usuario
function registrarUsuario(){
    let nombre = document.getElementById("r-usuario").value.trim();
    let contra = document.getElementById("r-contra").value.trim();

    // Verificar que los campos no estén vacíos
    if (nombre === '' || contra === '') {
        alert('El nombre de usuario y la contraseña no pueden estar vacíos.');
        return;
    }

    // Verificar si el usuario ya existe
    for (const usuario of usuarios) {
        if(usuario.username == nombre){
            alert(`El usuario identificado como ${nombre} ya está registrado.`);
            return;
        }
    }

    // Si no existe, registrar el nuevo usuario
    usuarios.push(new Usuario(nombre, contra));
    alert("Te has registrado correctamente.");
}

// Función para iniciar sesión
function iniciarSesion(){
    let nombre = document.getElementById("is-usuario").value;
    let contra = document.getElementById("is-contra").value;

    // Verificar si el usuario está registrado y la contraseña es correcta
    for (const usuario of usuarios) {
        if(usuario.username == nombre){
            if(usuario.password == contra){
                usuarioActivo = usuario; // Establecer el usuario activo
                mostrarMain(); // Mostrar la pantalla principal
                return;
            } else {
                alert("Contraseña incorrecta.");
                return;
            }
        }
    }
    alert(`No existe ningún usuario registrado como ${nombre}.`);
}

// Función para cerrar sesión y regresar a la pantalla de inicio de sesión
function cerrarSesion(){
    mostrarIS();
    usuarioActivo = null; // Eliminar el usuario activo
}

// Función para agregar una nueva categoría
function addCategoria() {
    let nuevaCategoria = document.getElementById('nombreCategoria').value.trim();

    // Verificar si la categoría no está vacía
    if (nuevaCategoria === '') {
        alert('No se puede agregar una categoría vacía.');
        return;
    }

    // Verificar si la categoría ya existe
    if (usuarioActivo.categorias.includes(nuevaCategoria)) {
        alert(`La categoría ${nuevaCategoria} ya existe.`);
        return;
    }

    // Agregar la nueva categoría y actualizar la interfaz
    document.getElementById('nombreCategoria').value = '';
    usuarioActivo.categorias.push(nuevaCategoria);
    actualizarListaCategorias(); // Actualizar lista de categorías
    gastosInput();               // Actualizar formulario de gastos
    pressInput();                // Actualizar formulario de presupuestos
}

// Función para eliminar una categoría
function quitarCategoria(categoria){
    usuarioActivo.categorias.splice(usuarioActivo.categorias.indexOf(categoria), 1); // Eliminar categoría
    actualizarListaCategorias(); // Actualizar la interfaz
    gastosInput();
    pressInput();
}

// Función para eliminar un gasto
function quitarGasto(index) {
    usuarioActivo.gastos.splice(index, 1); // Eliminar gasto del array
    actualizarListaGastos(); // Actualizar la interfaz
}

// Actualiza la lista de categorías y el select para filtrar
function actualizarListaCategorias() {
    let lista = document.getElementById('listarCategorias-box');
    lista.innerHTML = '';
    
    let filtro = document.getElementById('filtroCategoria');
    filtro.innerHTML = '<option value="">Todas las categorías</option>'; // Resetear las opciones de filtro

    for (const categoria of usuarioActivo.categorias) {
        lista.innerHTML += categoria + `<button class="btn_quitarCat" onclick='quitarCategoria("${categoria}")'>X</button> <br>`;
        filtro.innerHTML += `<option value="${categoria}">${categoria}</option>`; // Agregar opciones al filtro
    }
}

// Función para mostrar el formulario de gastos
function gastosInput(){
    let contenido = `<label for="cantidad">Cantidad: </label><input type="number" id="cantidad" value="0"><br><select name="gastos" id="categoriasGastos">`;
    for(const categoria of usuarioActivo.categorias) {
        contenido += `<option value="${categoria}">${categoria}</option>`;
    }
    contenido += `</select>  <button onclick="addGasto()">Añadir gasto</button>`;
    document.getElementById("addGasto-box").innerHTML = contenido;
}

// Función para agregar un gasto
function addGasto() {
    let nuevoGasto = parseFloat(document.getElementById('cantidad').value);
    document.getElementById('cantidad').value = 0;
    let nuevoGastoCat = document.getElementById('categoriasGastos').value;

    // Verificar si hay un presupuesto para la categoría
    const presupuestoActual = usuarioActivo.pres.find(p => p.categoria === nuevoGastoCat);
    const totalGastosCategoria = usuarioActivo.gastos
        .filter(g => g.categoria === nuevoGastoCat)
        .reduce((sum, g) => sum + parseFloat(g.cantidad), 0);

    // Si hay presupuesto, verificar que no se exceda
    if (presupuestoActual) {
        if (totalGastosCategoria + nuevoGasto > parseFloat(presupuestoActual.cantidad)) {
            alert(`No puedes añadir este gasto. Superas el presupuesto de ${presupuestoActual.cantidad} para la categoría ${nuevoGastoCat}.`);
            return;
        }
    }

    // Agregar el nuevo gasto si es válido
    usuarioActivo.gastos.push({ cantidad: nuevoGasto, categoria: nuevoGastoCat });
    actualizarListaGastos(); // Actualizar la lista de gastos
}

// Función para actualizar la lista de gastos
function actualizarListaGastos(filtroCategoria = '') {
    let lista = document.getElementById('listarGastos-box');
    lista.innerHTML = '';

    let totalGastado = 0;
    const gastosFiltrados = filtroCategoria 
        ? usuarioActivo.gastos.filter(gasto => gasto.categoria === filtroCategoria) 
        : usuarioActivo.gastos; // Filtrar por categoría o mostrar todos

    for (const [index, gasto] of gastosFiltrados.entries()) {
        lista.innerHTML += `${gasto.categoria} - ${gasto.cantidad} <button class="btn_quitarCat" onclick='quitarGasto(${index})'>X</button> <br>`;
        totalGastado += parseFloat(gasto.cantidad); // Sumar el gasto actual al total
    }

    // Mostrar el total gastado para la categoría o en general
    lista.innerHTML += `<br><strong>Total gastado: ${totalGastado}</strong>`;
}

// Función para mostrar el formulario de presupuestos
function pressInput(){
    let contenido = `<label for="cantidad">Cantidad: </label><input type="number" id="presCantidad" value="0"><br><select name="gastos" id="categoriasGastosPress">`;
    for(const categoria of usuarioActivo.categorias) {
        contenido += `<option value="${categoria}">${categoria}</option>`;
    }
    contenido += `</select>  <button onclick="addPres()">Añadir presupuesto</button>`;
    document.getElementById("addPres-box").innerHTML = contenido;
}

// Función para agregar un presupuesto
function addPres() {
    let nuevoPres = document.getElementById('presCantidad').value;
    document.getElementById('presCantidad').value = 0;
    let nuevoPresCat = document.getElementById('categoriasGastosPress').value;

    // Verificar si ya existe un presupuesto para la categoría
    const presExistente = usuarioActivo.pres.find(p => p.categoria === nuevoPresCat);
    if (presExistente) {
        presExistente.cantidad = nuevoPres; // Actualizar el presupuesto si ya existe
    } else {
        usuarioActivo.pres.push({ categoria: nuevoPresCat, cantidad: nuevoPres }); // Crear un nuevo presupuesto
    }

    alert("Presupuesto añadido o actualizado.");
}

// Función para filtrar los gastos por categoría
function filtrarGastosPorCategoria(){
    const categoriaFiltrar = document.getElementById('filtroCategoria').value;
    actualizarListaGastos(categoriaFiltrar); // Mostrar gastos filtrados
}
