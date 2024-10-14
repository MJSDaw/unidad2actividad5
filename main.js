// alert("OK");

const usuarios = [];
let usuarioActivo = null;

function Usuario(username, password){
    this.username = username;
    this.password = password;
    this.categorias = [];
    this.gastos = [];
}

function cambiarTitulo(nuevoTitulo){
    document.title = nuevoTitulo;
}

function mostrarIS() {
    document.getElementById('register-box').style.display = "none";
    document.getElementById('login-box').style.display = "block";
    document.getElementById('main-box').style.display = "none";
    cambiarTitulo("Iniciar Sesión");
}

function mostrarR() {
    document.getElementById('login-box').style.display = "none";
    document.getElementById('register-box').style.display = "block";
    cambiarTitulo("Registrarse");
}
function mostrarMain(){
    document.getElementById('login-box').style.display = "none";
    document.getElementById('main-box').style.display = "block";
    cambiarTitulo("Página principal");
}

function registrarUsuario(){
    let nombre = document.getElementById("r-usuario").value;
    let contra = document.getElementById("r-contra").value;

    for (const usuario of usuarios) {
        if(usuario.username == nombre){
            alert(`El usuario identificado como ${nombre} ya esta registrado.`);
            return;
        }
    }
    usuarios.push(new Usuario(nombre, contra));
    alert("Te has registrado correctamente.");
}

function iniciarSesion(){
    let nombre = document.getElementById("is-usuario").value;
    let contra = document.getElementById("is-contra").value;

    for (const usuario of usuarios) {
        if(usuario.username == nombre){
            if(usuario.password == contra){
                alert(`Has iniciado sesion como: ${nombre}.`);
                usuarioActivo = usuario;
                mostrarMain();
                actualizarListaCategorias();
                return;
            } else {
                alert("Contraseña incorrecta.");
                return;
            }
        }
        
    }
    alert(`No existe ningún usuario registrado como ${nombre}.`);
}

function addCategoria(){
    let nuevaCategoria = document.getElementById('nombreCategoria').value;
    usuarioActivo.categorias.push(nuevaCategoria);
    document.getElementById('listarCategorias-box').innerHTML += nuevaCategoria + `<button onclick='quitarCategoria("${nuevaCategoria}")'>X</button> <br>`;
}

function quitarCategoria(categoria){
    usuarioActivo.categorias.splice(usuarioActivo.categorias.indexOf(categoria), 1);
    //alert(`Categoria ${categoria} eliminada.`);
    actualizarListaCategorias();
}

function actualizarListaCategorias(){
    let lista = document.getElementById('listarCategorias-box');
    lista.innerHTML = '';
    for(const categoria of usuarioActivo.categorias) {
        lista.innerHTML += categoria + `<button onclick='quitarCategoria("${categoria}")'>X</button> <br>`;
    }
}

function cerrarSesion(){
    mostrarIS();
    usuarioActivo = null;
}