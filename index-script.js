let main = document.getElementsByTagName("main");
let header = document.createElement("header")
let div_reloj = document.createElement("div")
div_reloj.className = "div_reloj"
let div_ubicacion = document.createElement("div")
div_ubicacion.className = "div_ubicacion"
let div_inputs_login = document.createElement("div")
div_inputs_login.className = "div_inputs_login"

//  INTEGRAR ELEMENTOS EN LOGIN
main.item(0).append(header)
header.append(div_reloj, div_ubicacion)
main.item(0).append(div_inputs_login)

//  INNERHTML CON INPUTS LOGIN
div_inputs_login.innerHTML = "<input type='text' placeholder='Ingrese su correo' id='input_correo_login' class='register_input'><input type='password' placeholder='Ingrese su contraseña' id='input_password_login' class='register_input'><input type='password' placeholder='Repita su contraseña' id='input_repetir_password' class='register_input'>"

/*_______________________________________________________________________________________________________________

                                CONFIGURACION RELOJ
______________________________________________________________________________________________________________*/

function reloj(){
    let date = new Date()

    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    
    let valores_reloj = [hours, minutes, seconds]

    for (let i = 0; i < valores_reloj.length; i++) {
        const valores_menordiez = valores_reloj[i];

        if (valores_menordiez < 10 && valores_menordiez == valores_reloj[0]){
            hours = `0${valores_menordiez}`
        }

        else if (valores_menordiez < 10 && valores_menordiez == valores_reloj[1]){
            minutes = `0${valores_menordiez}`
        }

        if (valores_menordiez < 10 && valores_menordiez == valores_reloj[2]){
            seconds = `0${valores_menordiez}`
        }

        var reloj = `${hours}:${minutes}:${seconds}`
    }

    div_reloj.innerHTML = reloj
}
setInterval(reloj, 1000)

//  FETCH API IP
fetch("https://api.country.is")
.then(response => response.json())
.then(data => {
    div_ubicacion.innerHTML = `<strong>User Country:</strong> &nbsp <u>${data.country}</u> &nbsp &nbsp &nbsp <strong>User IP:</strong> &nbsp <u>${data.ip}</u>`
});



/*____________________________________________________________________________________________________________________
                                    FORMULARIO PARA TOKEN
_____________________________________________________________________________________________________________________*/

    //  almaceno en variable los input para reciclarlo debajo
    let correo_ingresado_registrar = document.getElementById("input_correo_login")
    let registrar_password = document.getElementById("input_password_login")
    let repetir_registrar_password = document.getElementById("input_repetir_password")
    
//_____________________________________________________________________________________________________________________
    


/*********************************************************************************************************************
    formulario para que envíe todos los datos junto con token y al confirmar, que almacene los utiles en la base de datos
 *************************************************************************************************************/    

    // FRAME PARA QUE NO RECARGUE LA PAGUINA AL ENVIAR TOKEN
    let iframe = document.createElement("iframe")
    iframe.setAttribute("id", "dummyframe")
    iframe.setAttribute("name", "dummyframe")
    iframe.setAttribute("style", "display: none")
    div_inputs_login.append(iframe)
    

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    //  FORMULARIO PARA REGISTRAR USUARIO Y ENVIAR TOKEN
    let form_token = document.createElement("form")
    form_token.setAttribute("id", "form_token")
    form_token.setAttribute("method", "POST")
    form_token.setAttribute("target", "dummyframe")

    function mail_receptor(valor_correo){
        valor_correo = correo_ingresado_registrar.value
        form_token.setAttribute("action", `https://formsubmit.co/${valor_correo}`)
    }
    correo_ingresado_registrar.addEventListener("change", mail_receptor)


    div_inputs_login.append(form_token)
    
    import {login_token} from "./token_function.js";
//____________________________________________________________________________________________________________________

//********************************************************************************************************************
    //  guardo en una variable el token para poder manipularlo en la sesion. Si se reinicia la pagina, cambia el token.
    let codigo_sesion = login_token().slice(6)

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    //  generar el token invisiblemente, pero el boton si envía dicho token y todo el resto de los datos
    form_token.innerHTML = `<input id='token' type="hidden" name="code" value=${codigo_sesion}><input type="hidden" name="_next" value=false><input type="hidden" name="_captcha" value="false"><button id="btn_registrar" type="submit" class="btn_registrar">Registrarse</button>`
/********************************************************************************************************************/

/*_______________________________________________________________________________________________________________________________________________________________________________________________________________________________

                        bloquear envio de datos mientras algun input sea incorrecto
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/
let btn_registrar = document.getElementById("btn_registrar") 

/*______________________________________________________________________________________________________________

                            GENERAR CONSTANTE DE MAIL Y CONTRASEÑA INGRESADA:
______________________________________________________________________________________________________________*/

    function usuario_mail(){
        const usuario_registrado = correo_ingresado_registrar.value
        console.log(usuario_registrado)
        return usuario_registrado
    }
    
    function usuario_password(){
        const password_registrada = registrar_password.value
        console.log(password_registrada)
        return password_registrada
    }

    let datos_de_usuario = {correo: usuario_mail(), password: usuario_password()}

    btn_registrar.addEventListener("click", usuario_mail)
    btn_registrar.addEventListener("click", usuario_password)

//______________________________________________________________________________________________
    function activar_desactivar_btn(){
        if (registrar_password.value != repetir_registrar_password.value || correo_ingresado_registrar.value == "" || registrar_password.value == "" || repetir_registrar_password.value == ""){
            btn_registrar.disabled = true
        }

        else if (registrar_password.value == repetir_registrar_password.value){
            btn_registrar.disabled = false
        }
    }

    let inputs_registrar = [correo_ingresado_registrar, registrar_password, repetir_registrar_password]

    for (let i = 0; i < inputs_registrar.length; i++) {
        const input = inputs_registrar[i];
        input.addEventListener("input", activar_desactivar_btn)
    }

    if (correo_ingresado_registrar.value == "" || registrar_password.value == "" || repetir_registrar_password.value == ""){
        activar_desactivar_btn()
    }
/*_____________________________________________________________________________________________________________________________________________________________________________________________________________________________*/


/*--------------------------------------------------------------------------------------------------------------
                                    CONFIRMAR TOKEN
--------------------------------------------------------------------------------------------------------------*/
function verificar_token(){
    div_inputs_login.innerHTML = `<h2>Type your code</h2><input type='text' id='input_code' maxlength='5'><button id='btn_validar'>Validar</button>`

/****************************************************************************************************************
                            VALIDAR CODIGO Y GUARDAR DATOS DE REGISTRO EN "BD"
***************************************************************************************************************/
                        //  (dentro de la misma funcion de verificar token)

    let input_code = document.getElementById("input_code")
    let btn_validar = document.getElementById("btn_validar")

    //  Activar boton validacion cuando token tiene los suficientes caracteres
    function desactivar(){
        if (input_code.value.length != codigo_sesion.length || input_code.value == ""){
            btn_validar.disabled = true
        }

        else {
            btn_validar.disabled = false
        }
    }
    btn_validar.disabled = true
    input_code.addEventListener("input", desactivar)

/*_______________________________________________________________________________________________________________

                                Funciones para registrar el usuario en la BD
_______________________________________________________________________________________________________________*/

//  GUARDAR VARIABLES DE INPUTS EN BASE DE DATOS    
let lista_usuarios_registrados = [];

    function save_data(){
        lista_usuarios_registrados.push(datos_de_usuario)
        console.log(datos_de_usuario)
        console.log(lista_usuarios_registrados)
    }

btn_validar.addEventListener("click", save_data)

// CONFIRMAR TOKEN

    function confirmar(){
        if (input_code.value == codigo_sesion){
            alert("te registraste con exito")
            console.log(lista_usuarios_registrados)

            back_home()
            
            // volver a home si el usuario se registro correctamente
            function back_home(){
                window.location.reload
            }
            
            setTimeout(back_home, 1000)
        }

        if (input_code.value != codigo_sesion){
            alert("le erraste capo, enviar codigo nuevamente")
        }
    }
    
    btn_validar.addEventListener("click", confirmar)
}



//________________________________________________________________________________________________________________________________________________________________________________________________________________________________
function vaciar_inputs(){
    correo_ingresado_registrar.value = ""
    registrar_password.value = ""
    repetir_registrar_password.value = ""
    
    setTimeout(verificar_token, 1500)
}

form_token.addEventListener("submit", vaciar_inputs)