let productos = [];

fetch("FondEnd/JavaScript/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos del JSON");
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            productos = data;
            cargarProductos(productos);
        } else {
            console.error("El formato de los datos no es un array");
        }
    })
    .catch(error => {
        console.error("Error en la carga de productos:", error.message);
    });


// Selecciona el contenedor de productos en el DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");//Para poder cambiar el titulo del producto, segun lo que se seleccione
let botonesAgregar = document.querySelectorAll(".producto-agregar"); //para agregar al carrito
const numerito = document.querySelector("#numerito");


//Funcion para cargar los productos
//Paso 2, a la función le agrego un parametro, para que me cargue el producto por categoria seleccionada.
function cargarProductos(productosElegidos){

    // Limpio el contenedor de productos, cada vez que arranque la función, porque si no lo hace, el contenedor se llena de productos
contenedorProductos.innerHTML="";


     // Recorre el array de productos y crea un div para cada producto - 
     //paso 3, en el forEach, agrego un parametro productosElegidos, para que me cargue el producto por categoria seleccionada.
    productosElegidos.forEach(producto => {
        // Crea un nuevo elemento div y agrega la clase 'producto'
        const div =document .createElement("div");
        div.classList.add("producto");

        // Añade el contenido HTML del producto al div
        div.innerHTML=`
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id= "${producto.id}">Agregar</button>
            </div>
        `;
// agrego el elemento contenerProductos al final del DOM
    contenedorProductos.appendChild(div);
    })

    actualizarBotonesAgregar(); 
}


//llamo a la funcion cargarProductos
//paso 4, paso parametro productos, para que cargue todos los productos
//cargarProductos(productos);


//cargar categorias, segun lo que el usuario seleccione
botonesCategorias .forEach(boton => {
    boton.addEventListener("click",(e)=>{
        botonesCategorias.forEach(boton => boton.classList.remove("active"));// Elimina la clase "active" de todos los botones para desactivar la selección de todos
        e.currentTarget.classList.add("active"); // Agrega la clase "active" al botón que fue clickeado para marcarlo como seleccionado

//paso 5, ahora puedo filtar la categoria seleccionada, creo una const, y lo busco con el mismo id que el boton que fue clickeado
//paso 6, agrego un if para que cargue todos los productos si el boton, es el boton todos

if(e.currentTarget.id != "todos"){
    
    const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);//busco el producto que corresponde a la categoria seleccionada
    tituloPrincipal.innerText = productoCategoria.categoria.nombre;//cambio el titulo del producto, segun lo que se seleccione
    
    const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
    cargarProductos(productosBoton);
}else{
        tituloPrincipal.innerText = "Todos los productos";//cambio el titulo del producto, a Todos los productos
        cargarProductos(productos);//llamo a la funcion cargarProductos, paso parametro productosBoton, para que cargue solo los productos de la categoria seleccionada
        }
    })
})

//Agregar productos al carrito
function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {boton.addEventListener("click",agregarAlCarrito);
    });
}



let productosEncarrito;

let productosEncarritoLS = localStorage.getItem("productos-en-carrito");

// OPERADOR OR 
productosEncarrito = JSON.parse(productosEncarritoLS) || [];


 // Define una función llamada 'agregarAlCarrito' que maneja la acción de agregar un producto al carrito.
 // Recibe un evento 'e' como parámetro, que permite acceder al elemento que disparó el evento.
function agregarAlCarrito(e){
    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ec940e, rgb(193, 152, 105))",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem",
        },
        offset: {
            x:'1.5rem',// horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y:'1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },

        onClick: function(){} // Callback after click
      }).showToast();


 // Obtiene el 'id' del botón que activó el evento (currentTarget) y lo asigna a la variable 'IdBoton'.
// Esto permite identificar el producto que se está agregando al carrito.    
const IdBoton = e.currentTarget.id;

// Busca en el array 'productos' el objeto que tiene un 'id' igual al 'IdBoton' y lo asigna a 'productoAgregado'.
// Este producto será el que se agregue al carrito.
const productoAgregado = productos.find(producto => producto.id === IdBoton);


// Verifica si ya existe en el carrito un producto con el mismo 'id' que el botón presionado.
// Si Encuentra el índice del producto dentro del array 'productosEncarrito'.


    if(productosEncarrito.some(producto => producto.id === IdBoton)){
        const index = productosEncarrito.findIndex(producto => producto.id === IdBoton);

// Incrementa en 1 la cantidad del producto existente en el carrito.

        productosEncarrito[index].cantidad++;
    }else{
// Si el producto no está en el carrito:Asigna una cantidad inicial de 1 al producto agregado.

        productoAgregado.cantidad = 1;

// Agrega el producto al array 'productosEncarrito'.
        productosEncarrito.push(productoAgregado);
    }

// Llama a la función 'actualizarNumerito' para actualizar el contador visible del carrito.
    actualizarNumerito();

//LocalStorage
// Guarda el contenido actual del array 'productosEncarrito' en el almacenamiento local del navegador (localStorage).
// Convierte el array 'productosEncarrito' en una cadena JSON utilizando 'JSON.stringify' para poder almacenarlo como texto.
// La clave utilizada para almacenar es "productos-en-carrito", lo que permite recuperarlo más tarde con esa misma clave.
localStorage.setItem("productos-en-carrito", JSON.stringify(productosEncarrito));


}

//Actualizar el numero de productos en el carrito
function actualizarNumerito(){

// Declara una variable 'nuevoNumerito' que almacena la suma total de las cantidades de productos en el carrito.
// Utiliza el método 'reduce' para iterar sobre el arreglo 'productosEncarrito', acumulando el total de las propiedades 'cantidad' de cada producto.
// El segundo argumento de 'reduce' es '0', que actúa como valor inicial del acumulador 'acc'.   
    let nuevoNumerito = productosEncarrito.reduce((acc, producto) => acc + producto.cantidad, 0);

    // Actualiza el contenido textual de un elemento HTML identificado como 'numerito' con el valor de 'nuevoNumerito'.
    // Esto sirve para reflejar en la interfaz de usuario el número total de productos en el carrito.
    numerito.innerText = nuevoNumerito;

}













