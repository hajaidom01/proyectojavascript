
var nombreUsuario = localStorage['nombre'];
var saludo = localStorage['saludo'];

function Login(){
    var user = document.getElementById("txtUser").value.trim();
    var password = document.getElementById("txtPassword").value.trim();

    localStorage['saludo'] = 'si';
    localStorage['nombre'] = "";

    var logged = ValidarCredenciales(user,password);

    

    if(logged)
        OpenNotes(user);
}

function LogOff(){    
    window.open('index.html', '_self');
    localStorage['saludo'] = 'si';
    localStorage['nombre'] = '';
    localStorage['usuario'] = '';
    localStorage["logged"] = 'no';
    
}

function Cancelar(){
    document.getElementById("txtUser").value ="";
    document.getElementById("txtPassword").value ="";
}

function Logueado(){
    var logged = localStorage['logged'];

    if(logged == 'no'){
        alert('No cuenta con permisos para acceder a esta página.');
        window.open('Index.html', '_self');
    }
}

function ValidarCredenciales(user, password){

    var logged = false;

    if(user == '' || password == ''){
        alert('Usuario y contraseña requeridos');     
        logged = false;   
    }else{
        $.ajax('Data/Usuarios.json',{
            dataType:'json',
            contentType:'application/json',
            cache:false,
            async : false
        })
        .done(function(response){           
            
            $.each(response, function(index,element){           
                
                if(element.usuario == user && element.password == password){

                    localStorage["nombre"] = element.nombre;
                    localStorage["usuario"] = element.usuario;
                    localStorage["logged"] = 'si';


                    
                    logged = true;
                    return false;
                }

                
            })

        });

        if(!logged)
            alert('Usuario y/o contraseña incorrectos.');
    }

    
    return logged;
}


function OpenGalery(){
    window.open("Galery.html", "_self");
}

function OpenSurvey(){
    window.open("Survey.html", "_self");
}

function OpenIndex(){
    window.open("Index.html","_self");
}

function OpenWeather(){
    window.open("https://www.meteored.mx/clima_Monterrey-America+Norte-Mexico-Nuevo+Leon-MMMY-1-21045.html","_blank");
}

function OpenFime(){
    window.open("https://www.fime.uanl.mx/","_blank");
}

function OpenNotes(user){
    window.open("Notes.html", "_self");    
}

function DatosUsuario(){
    var html = "";
    

    html += '<p>' + localStorage["nombre"]; + '<p>';   

    document.getElementById("userName").innerHTML = html;

}


function Saludo(){

    var saludar = localStorage['saludo'];
    

    if(saludar == 'si'){
        alert('Bienvenido ' + localStorage["nombre"]);
        localStorage['saludo'] = 'no';
    }


    saludar = localStorage['saludo'];
    

}

function LoadTable(){

    
    
    var promedioGeneral = 0;
    
    var html = '<table class="table table-hover">';
    html += '<thead>';
    html += '<tr>';
    html += '<th scope="col">Materia</th>';
    html += '<th scope="col" class="text-center">Asistencia</th>';
    html += '<th scope="col" class="text-center">Actividades</th>';
    html += '<th scope="col" class="text-center">Tareas</th>';
    html += '<th scope="col" class="text-center">Proyecto</th>';
    html += '<th scope="col" class="text-center">Examen</th>';
    html += '<th scope="col" class="text-center">Promedio</th>';
    html += '</tr>'
    html += '</thead>';
    html += '<tbody>';

    $.ajax('Data/Calificaciones.json',{
        dataType:'json',
        contentType:'application/json',
        cache:false,
        async : false
    }).done(function(response){

       

        $.each(response, function(index,element){
            html += '<tr>'
            html += '<th scope="row">' + element.materia + '</th>';
            html += '<td class="text-center">' + element.asistencia + '</td>';
            html += '<td class="text-center">' + element.actividades + '</td>';
            html += '<td class="text-center">' + element.tareas + '</td>';
            html += '<td class="text-center">' + element.proyecto + '</td>';
            html += '<td class="text-center">' + element.examen + '</td>';

            var promedio = 0;
            var suma = 0;
            
            suma = parseFloat(element.asistencia) + parseFloat(element.actividades) + parseFloat(element.tareas) + parseFloat(element.examen);

            
            promedio = suma / 5;
            html += '<td class="text-center">' + promedio.toFixed(2) + '</td>';
            html += '</tr>';

            promedioGeneral += promedio;           
            
        })

        promedioGeneral = promedioGeneral / response.length;
        
        html += '</tbody>';
        
        
        html += '<tfoot>';
        html += '<tr>';
        html += '<td class="text-right" colspan="6"><b>Promedio General</b></td>';
        html += '<td class="text-center">' + promedioGeneral.toFixed(2) + '</td>';
        html += '</tr>';
        html += '</tfoot>';
        html += '</table>';

        document.getElementById("tableDiv").innerHTML = html;
    });
}


function Imprimir(){
    window.print();
}


function SocialNetworkConfirm(socialNetwork){
    var res = confirm('Este enlace lleva a una pagina externa, ¿Desea continuar?');

    if(res){

        switch(socialNetwork.id){
            case 'face':
                window.open('https://www.facebook.com/fime.oficial/', '_blank');
                break;
            case 'insta':
                window.open('https://www.youtube.com/channel/UCfmQiSfgZ5cMDe-kAYplmww/featured?disable_polymer=1', '_blank');
                break;
            case 'youtube':
                window.open('https://www.instagram.com/fime.oficial/?hl=es-la', '_blank');
                break;
        }

    }
}

function CargarMaterias(){
    var html ="";
    html = '<select class="form-control" onchange="MostrarGaleria(this);">';
    html +='<option value="0">Seleccione una materia</option>';

    $.ajax('Data/Materias.json',{
        dataType:'json',
        contentType:'application/json',
        cache:false,
        async : false
    }).done(function(response){
        

        $.each(response, function(index,element){
            html += '<option value="' + element.id + '">' + element.desc + '</option>';
        })       

        
    })

    html += '</select>';

    document.getElementById("select").innerHTML = html;

}


function MostrarGaleria(mat){

    
    var html = "";
    if(mat.value > 0){

        $.ajax('Data/Gallery.json',{
            dataType:'json',
            contentType:'application/json',
            cache:false,
            async : false
        }).done(function(response){

            
            html += '<div class="col  justify-content-center">'
            $.each(response, function(index,element){
               
    
                if(mat.value== element.tipo){
                    
                    html += '<a href="' + element.enlaceExterno +'" target="_blank"><img class="gallery-image img-fluid rounded" src="' + element.url +'" alt="' + element.descripcion + '" srcset=""> ';
                   
                }
                
            })
            html += '</div>';
            
        })
        .fail(function(response){
            alert('Error al cargar');
        })
    }    
    
    document.getElementById("galleryBody").innerHTML = html;
            
}

function CargarEncuesta(){
    $.ajax('Data/Encuesta.json',{
        dataType:'json',
        contentType:'application/json',
        cache:false,
        async : false
    }).done(function(response){
        
        html = "";
        
        $.each(response, function(index,element){
           
            html += '<div class="row">';
            html += '<div class="col text-left">';
            html += '<p>'+ (index + 1) + ') ' + element.pregunta ;
            html += element.imagen == '' ? '' : '   <img class="img-fit" src="'+ element.imagen +'" alt="" srcset=""></img>';
            html += '</p></div>';
            html += '<div class="col">';
            html += '<input class="form-control" type="text" name="txtPreguntas" id="pregunta' + (index + 1)  + '">';
            html += '</div>';
            html += '</div>';
            
        })

        document.getElementById("preguntas").innerHTML = html;
        
        
    })
    .fail(function(response){
        alert('Error al cargar encuestas');
    })
}

function Encuesta(btn){
    var response = false;
    var textboxes = document.getElementsByName("txtPreguntas");
    var flag = 0;
    var eliminar = false;
    
    if(btn.id == 'envia'){
        response = confirm('Desea enviar la encuesta?');
       
        if(response){
            $.each(textboxes, function(index, element){

                flag += index
                if(element.value == ''){
                    alert('Capture todos los campos.');
                    response = false;
                    return false;
                }
                    
            });
    
            if(flag == textboxes.length)
                response = true;
        }

        
    }else{
        response = confirm('Desea cancelar la encuenta?');
        eliminar = true;
    }

    if(response){
        $.each(textboxes, function(index, element){
            element.value = '';
        })

        if(!eliminar){
            alert('Encuesta enviada');
            OpenNotes();
        }
        
    }
        

    


    

}
