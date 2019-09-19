$(document).ready(function(){

    //--------------------- SELECCIONAR FOTO PRODUCTO ---------------------
    $("#foto").on("change",function(){
        var uploadFoto = document.getElementById("foto").value;
        var foto       = document.getElementById("foto").files;
        var nav = window.URL || window.webkitURL;
        var contactAlert = document.getElementById('form_alert');
        
            if(uploadFoto !='')
            {
                var type = foto[0].type;
                var name = foto[0].name;
                if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png')
                {
                    contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';                        
                    $("#img").remove();
                    $(".delPhoto").addClass('notBlock');
                    $('#foto').val('');
                    return false;
                }else{  
                        contactAlert.innerHTML='';
                        $("#img").remove();
                        $(".delPhoto").removeClass('notBlock');
                        var objeto_url = nav.createObjectURL(this.files[0]);
                        $(".prevPhoto").append("<img id='img' src="+objeto_url+">");
                        $(".upimg label").remove();
                        
                    }
              }else{
                alert("No selecciono foto");
                $("#img").remove();
              }              
    });

    $('.delPhoto').click(function(){
        $('#foto').val('');
        $(".delPhoto").addClass('notBlock');
        $("#img").remove();

        if($("#foto_actual") && $("#foto_remove")){
            $("#foto_remove").val('img_producto.png');
        }

    });

    //modal form add product

    $('.add_product').click(function(e){

        e.preventDefault();
        var producto = $(this).attr('product');
        var action = 'infoProducto';

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            async: true,
            data: {action:action,producto:producto},

            success: function(response){

                if(response != 'error'){
                    var info = JSON.parse(response);
                    //$('#producto_id').val(info.codproducto);
                    //$('.nameProducto').html(info.descripcion);

                    $('.bodyModal').html('<form action="" method="post" name="form_add_product" id="form_add_product" onsubmit="event.preventDefault(); sendDataPoduct();">'+
                                            '<h1>Agregar Producto</h1>'+
                                            '<h2 class="nameProducto">'+info.descripcion+'</h2><br>'+
                                            '<input type="number" name="cantidad" id="txtCantidad" placeholder="Cantidad del Producto" required><br>'+
                                            '<input type="text" name="precio" id="txtPrecio" placeholder="Precio del Producto" required>'+
                                            '<input type="hidden" name="producto_id" id="producto_id" value="'+info.codproducto+'" required>'+
                                            '<input type="hidden" name="action" value="addProduct" required>'+
                                            '<div class="alert alertAddProduct"></div>'+
                                            '<button type="submit" class="btn_new">Agregar</button>'+
                                            '<a href="#" class="btn_ok closeModal" onclick="closeModal();">Cerrar</a>'+
                                        '</form>');
                }
            },

            error: function(error){
                console.log(error);
            }
        });

        $('.modal').fadeIn();
    });

    //modal form delete product

    $('.del_product').click(function(e){

        e.preventDefault();
        var producto = $(this).attr('product');
        var action = 'infoProducto';

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            async: true,
            data: {action:action,producto:producto},

            success: function(response){

                if(response != 'error'){
                    var info = JSON.parse(response);
                    //$('#producto_id').val(info.codproducto);
                    //$('.nameProducto').html(info.descripcion);

                    $('.bodyModal').html('<form action="" method="post" name="form_del_product" id="form_del_product" onsubmit="event.preventDefault(); delPoduct();">'+
                                            '<h1>Eliminar Producto</h1>'+

                                            '<p>¿Esta seguro de eliminar el siguiente registro?</p>'+
                        
                                            '<h2 class="nameProducto">'+info.descripcion+'</h2><br>'+
                                            
                                            '<input type="hidden" name="producto_id" id="producto_id" value="'+info.codproducto+'" required>'+
                                            '<input type="hidden" name="action" value="delProduct" required>'+
                                            '<div class="alert alertAddProduct"></div>'+

                                            '<a href="#" class="btn_cancel" onclick="closeModal();">Cerrar</a>'+
                                            '<input type="submit" value="Aceptar" class="btn_ok">'+

                                        '</form>');
                }
            },

            error: function(error){
                console.log(error);
            }
        });

        $('.modal').fadeIn();
    });

    $('#search_proveedor').change(function(e){
        e.preventDefault();
        var sistema = getUrl();
        location.href = sistema ='buscar_productos.php?proveedor='+$(this).val();
    })


    //PARTE DE SEBASTIAN DESDE AQUI PARA ABAJO

    //activacion para campo de registro cliente

    $('.btn_new_cliente').click(function(e){
            e.preventDefault();
            $('#nom_cliente').removeAttr('disabled');
            $('#tel_cliente').removeAttr('disabled');
            $('#dir_cliente').removeAttr('disabled');

            $('#div_registro_cliente').slideDown();
    });

    //buscar cliente
    $('#nit_cliente').keyup(function(e){
                e.preventDefault();

                var cl = $(this).val();
                var action ='searchCliente';
                $.ajax({
                url:'ajax.php',
                type 'POST',
                async: true,
                data: {action:action,cliente:cl},

                success:function(response){

                if (response == 0){
                    $('#idcliente').val('');
                    $('#nom_cliente').val('');
                    $('#tel_cliente').val('');
                    $('#dir_cliente').val('');
                    //mostrar boton agregar
                    $('.btn_new_cliente').slideDown();
                }else{
                    var data = $.parseJSON(response); //porque aparece el signo "$" en color minuto 8:57 parte 52
                    $('#idcliente').val(data.idcliente);
                    $('#nom_cliente').val(data.nombre);
                    $('#tel_cliente').val(data.telefono);
                    $('#dir_cliente').val(data.direccion);
                    //ocultar boton agregar
                    $('.btn_new_cliente').slideUp();
                    //  Bloqueo campos
                    $('#nom_cliente').attr('disabled','disabled');
                    $('#tel_cliente').attr('disabled','disabled');
                    $('#dir_cliente').attr('disabled','disabled');
                    //oculta boton guardar
                    $('#div_registro_cliente').slideUp();
                }
            },
            error: function(error) {
            }
        });

    });

    //crear cliente. ventas function.js

    $('#form_new_cliente_venta').submit(function(e){
    e.preventDefault();

    $.ajax({
    url: 'ajax.php',
    type "$POST",
    async : true,
    data:('#form_new_cliente_venta').serialize(),

    success: function(response)
    {
    if(response !='error'){
        //agregar id a input hiden
    $('#idcliente').val(response);
    //bloquee campos
    $('#nom_cliente').attr('disabled','disabled');
    $('#tel_cliente').attr('disabled','disabled');
    $('#dir_cliente').attr('disabled','disabled');
    
    //oculta botom agregar
    $('.btn_new_cliente').slideUp();
    //oculta boton guardar
    $('#div_registro_cliente')slideUp();

    }

},
    error: function(error){

    }

    });
});
    //buscar producto

$('#txt_cod_producto').keyup(function(e){
    e.preventDefault();

    var producto = $(this).val();
    var action = 'infoProducto';

    
    if(producto !=''){

    $.ajax({
        url: 'ajax.php',
        type "$POST",
        async : true,
        data:{action:action,producto:producto},
        success: function(response)
        {
        if(response != 'error')
        {  
            var info = JSON.parse(response);
            $('#txt_descripcion').html(info.description);
            $('#txt_existencia').html(info.existencia);
            $('#txt_cant_producto').val('1');
            $('#txt_precio').html(info.precio);
            $('#txt_precio_total').html(info.precio);

            // activar cantidad
            $('#txt_cant_producto').remmoveAttr('disabled');

            //mostrar boton agregar
            $('#add_product_venta').slideDown();
        }else{
            $('#txt_description').html('-');
            $('#txt_existencia').html('-'); 
            $('#txt_cant_producto').val('0');
            $('#txt_precio').html('0.00');
            $('#txt_precio_total').html('0.00');

            //bloquear cantidad
            $('txt_cant_producto').attr('disabled','disabled');

            //ocultar boton agregar
            $('#add_product_venta').slideUp();
            }

        },
        error: function(error){
        }
    });

    }
    
});

// validar cantidad de productos antes de agregar


$('#txt_cant_producto')keyupu(function(e){
    e.preventDefault();

    var precio total = $(this).val() * $('#txt_precio').html();
    var existencia = parseInt($('#txt_existencia')html());
    
    $('#txt_precio_total').html('precio_total');

    //oculta en boton agregar si la cantidad es menor a 1

    if(   ($(this).val() < 1 || isNaN($(this).val())) || ($(this).val() >existencia)  ){
    $('#add_product_venta').slideUp();
}else{
    $('#add_product_venta')slideDown();
}
});

//Agregar producto al detalle  

$('#add_product_venta')click(function(e){
    e.preventDefault();
    if($('#txt_cant_producto').val() > 0)
    {
        var codproducto = $('#txt_cod_producto').val();
        var cantidad = $('#txt_cant_producto').val();
        var action = 'addProductoDetalle';

        $.ajax({
            url: 'ajax.php',
            type "$POST",
            async : true,
            data:{action:action,producto:codproducto,cantidad:cantidad},

        success: function(response)
        {
             if(response != 'error'){
                 var info = JSON.parse(response);
                 $('#detalle_venta').html(info.detalle);
                 $('#detalle_totales').html(info.totales);

                 $('#txt_cod_producto').val('-');
                 $('#txt_descripcion').html('-');
                 $('#txt_existencia').html('-');
                 $('#txt_cant_producto').val('0');
                 $('#txt_precio').html('0.00');
                 $('#txt_precio_total').html('0.00');

                 //bloquear cantidad

                 $('#txt_cant_producto').attr('disabled','disabled');

                 //ocultar boton

                 $('#add_product_venta').slideUp();


             }else{
             console.log('no data');
             
             }
             viewProcesar();
        },
        error: function(error){

            
        }

        });
    }
});

$('#btn_factura_venta').click(function(e){
e.preventDefault();

        var rows = $('#detalle_venta tr').legth;

        if(rows > 0)
{
    var action = 'procesarVenta';
    var codcliente = $('#idcliente').val();
    $.ajax({
            url: 'ajax.php',
            type "$POST",
            async : true,
            data:{action:action,codcliente:codcliente},

        success: function(response){
            if(response !='error'){
            //var info = JSON.parse(response);
            //console.log(info);
            location.reload();          
            }else{
                console.log('no data');
            }
        },
        error: function(error){

        }
    });
    }
});


}); //end ready
function del_product_detalle(correlativo){
    
var action = 'delProductoDetalle';
    var id_detalle = correlativo;


    $.ajax({
            url: 'ajax.php',
            type "$POST",
            async : true,
            data:{action:action,id_detalle:id_detalle},

        success: function(response){

            if(response != 'error')
            {
                var info = JSON.parse(response);


                $('#detalle_venta').html(info.detalle);
                $('#detalle_totales').html(info.totales);

                 $('#txt_cod_producto').val('-');
                 $('#txt_descripcion').html('-');
                 $('#txt_existencia').html('-');
                 $('#txt_cant_producto').val('0');
                 $('#txt_precio').html('0.00');
                 $('#txt_precio_total').html('0.00');

                 //bloquear cantidad

                 $('#txt_cant_producto').attr('disabled','disabled');

                 //ocultar boton

                 $('#add_product_venta').slideUp();

            }else{
                $('#detalle_venta').html('');
                $('#detalle_totales').html('');

            }

            viewProcesar();

         },
        
        error: function(error){

        }
    });


}
//mostrar/ocultar boton procesar

function viewProcesar(){
if($('#detalle_venta tr').length > 0)
{
    $('#btn_facturar_venta').show();

}else {
    $('#btn_facturar_venta').hide();
    }
    
}

function serchForDetalle(id){
    var action = 'serchForDetalle';
    var user = id;
    $.ajax({
            url: 'ajax.php',
            type "POST",
            async : true,
            data:{action:action,user:user},

        success: function(response)
        {
         if(response != 'error')
         {

                 var info = JSON.parse(response);
                 $('#detalle_venta').html(info.detalle);
                 $('#detalle_totales').html(info.totales);

             }else{
             console.log('no data');             
             }
             viewProcesar();
        },
        error: function(error){
        }
    });
}
//anular venta
$('#btn_anular_venta').click(function(e){
e.preventDefault();

var rows = $('#detalle_venta tr').legth;
if(rows > 0)
{
    var action = 'anularVenta';

    $.ajax({
            url: 'ajax.php',
            type "$POST",
            async : true,
            data:{action:action},

        success: function(response){

            if(response !='error'){

            location.reload();
            }
        },
        error: function(error){

        }
});
    }
});


function getUrl(){
    var loc = window.location;
    var pathname = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0,loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathname.length));
}

function sendDataPoduct(){
    $('.alertAddProduct').html('');

    $.ajax({
            url: 'ajax.php',
            type: 'POST',
            async: true,
            data: $('#form_add_product').serialize(),

            success: function(response){
                if(response == 'error')
                {
                    $('.alertAddProduct').html('<p style="color: red;">Error al agregar el producto</p>');
                }else{
                    var info = JSON.parse(response);
                    $('.row'+info.producto_id+' .celPrecio').html(info.nuevo_precio);
                    $('.row'+info.producto_id+' .celExistencia').html(info.nuevo_existencia);
                    $('#txtCantidad').val('');
                    $('#txtPrecio').val('');
                    $('.alertAddProduct').html('<p>Guardado Correctamente</p>');
                }
            },

            error: function(error){
                console.log(error);
            }
        });
}

//eliminar producto
function delPoduct(){
    var pr = $('#producto_id').val();
    $('.alertAddProduct').html('');

    $.ajax({
            url: 'ajax.php',
            type: 'POST',
            async: true,
            data: $('#form_del_product').serialize(),

            success: function(response){
                console.log(response);
                
                if(response == 'error')
                {
                    $('.alertAddProduct').html('<p style="color: red;">Error al eliminar el producto</p>');
                }else{
                    $('.row'+pr).remove();
                    $('#form_del_product .btn_ok').remove();
                    $('.alertAddProduct').html('<p>Producto eliminado Correctamente</p>');
                }
                
            },

            error: function(error){
                console.log(error);
            }
        });
}

function closeModal(){
    $('.alertAddProduct').html('');
    $('#txtCantidad').val('');
    $('#txtPrecio').val('');
    $('.modal').fadeOut();
}