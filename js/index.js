import {data, carrito} from './data.js'

const categorias = document.querySelectorAll('.categoria')
const contenedor = document.querySelector('.section3__productos')
const cantidad = document.querySelector('.cantidad')
const lista = document.querySelectorAll('nav ul li')
const carritoCantidad = document.querySelector('.carrito-cantidad')
const closeModal = document.getElementById('close-modal')
const modal = document.querySelector('.modal')
const containerProductos = document.querySelector('.container-productos')
const divTotalPagar = document.querySelector('.total-pagar')
const menu = document.querySelector('.menu')
const options = document.querySelector('.lista')

menu.addEventListener('click', ()=>{
    options.classList.toggle('active')
    if (options.classList.contains('active')) {
        menu.setAttribute('name', 'close')
    }else{
        menu.setAttribute('name', 'menu')
    }
})

lista.forEach(item => {
    item.addEventListener('click', ()=>{
        deleteClass()
        item.classList.add('active')
    })
})

const deleteClass=()=>{
    lista.forEach(item=>item.classList.remove('active'))
}

let categoriaId = 'fruta'

categorias.forEach(cate =>{
    cate.addEventListener('click', ()=>{
        removeClass()
        cate.classList.add('active')
        categoriaId = cate.id
        filtrarData(categoriaId)
    })
})

const removeClass=()=>{
    categorias.forEach(cate=>cate.classList.remove('active'))
}

window.addEventListener('load', ()=>{
    filtrarData(categoriaId)
    llenarCarrito(carrito)
    // totalPagar(carrito)
})

const filtrarData=(id)=>{
    const array = data.filter(item => item.tipo == id)
    mostrarData(array)
}

const mostrarData=(array)=>{
    contenedor.innerHTML = ''
    array.forEach(item => {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="img-container">
                <img src=${item.img} alt="">
            </div>
            <div class="detalles">
                <h5>${item.nombre}</h5>
                <del>Precio Antes: S/${item.precioAntes.toFixed(2)}</del>
                <p>Precio Ahora: S/${item.precioAhora.toFixed(2)}</p>
                <a id="btn-añadir">Añadir al Carrito</a>
            </div>
        `
        contenedor.appendChild(div)

        const addCarrito = div.querySelector('#btn-añadir')
        addCarrito.addEventListener('click', ()=>{
            agregarCarrito(item)
        })
    })
}

const agregarCarrito=(item)=>{
    const validacion = carrito.find(prod => prod.nombre == item.nombre)
    if (validacion) {
        console.log('ya existe')
    }else{
        const producto = {
            ...item,
            cantidad: 1
        }
        carrito.push(producto)
    }
    cantidad.textContent = carrito.length
    llenarCarrito(carrito)
}

closeModal.addEventListener('click', ()=>{
    modal.classList.remove('active')
})

carritoCantidad.addEventListener('click', ()=>{
    modal.classList.add('active')
})

const llenarCarrito=(carrito)=>{
    if (carrito.length == 0) {
        containerProductos.innerHTML = ''
        const div = document.createElement('div')
        div.classList.add('no-productos')
        div.innerHTML = `
            <img src="recursos/carrito vacio.png" alt="">
            Carrito Vacio :( 
        `
        containerProductos.appendChild(div)
        divTotalPagar.style = 'display: none'
    }else{
        containerProductos.innerHTML = ''
        carrito.forEach((item,id) => {
            const div = document.createElement('div')
            div.classList.add('producto')
            div.innerHTML += `
                <img src="${item.img}" alt="">
                <p>${item.nombre}</p>
                <p>Max. Cantidad: ${item.stock}</p>
                <p>Precio: S/${item.precioAhora.toFixed(2)}</p>
                <div class="cantidad">
                    <button class="menosCantidad">-</button>
                    <span class="producto-cantidad">${item.cantidad}</span>
                    <button class="masCantidad">+</button>
                </div>
                <button id="eliminarProducto">X</button>
            `
            containerProductos.append(div)

            const elimProducto = div.querySelector('#eliminarProducto')
            eliminarProducto(elimProducto, carrito, id)
            totalPagar(carrito)

            const menosCantidad = div.querySelector('.menosCantidad')
            const masCantidad = div.querySelector('.masCantidad')
            const productCantidad = div.querySelector('.producto-cantidad')
            actualizarCantidad(menosCantidad, masCantidad, item.nombre, productCantidad)
        })
    }
}

const eliminarProducto=(btn, array, id)=>{
    btn.addEventListener('click', ()=>{
        array.splice(id, 1)
        llenarCarrito(array)
        cantidad.textContent = array.length
    })
}

const actualizarCantidad=(btnMenos, btnMas, nombre, htmlCantidad)=>{
    btnMenos.addEventListener('click', ()=>{
        carrito.map(item=>{
            if (item.nombre == nombre) {
                if (item.cantidad > 1) {
                    item.cantidad--
                    htmlCantidad.textContent = item.cantidad
                    totalPagar(carrito)
                }else{
                    return
                }
            }
        })
    })

    btnMas.addEventListener('click', ()=>{
        carrito.map(item=>{
            if (item.nombre == nombre) {
                if (item.cantidad < item.stock) {
                    item.cantidad++
                    htmlCantidad.textContent = item.cantidad
                    totalPagar(carrito)
                }else{
                    return
                }
            }
        })
    })
}

const totalPagar=(array)=>{
    let totalPagar = 0
    array.forEach(item=>{
        totalPagar += item.precioAhora * item.cantidad
    })

    if (array.length >= 1) {
        divTotalPagar.style = 'display: block'
        divTotalPagar.textContent = `Total a Pagar: ${totalPagar.toFixed(2)}`
    }
}