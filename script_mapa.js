//MI IP: 181.231.68.168
//API key de ipapi.com
var access_key_ipapi = '0fe00d7be5d627eba3c1342a22fd6907';
// API key openweather.org
var access_key_openwe = '7dc0fd11d872c5087f99c2e5debc2413';
//API key de api.ipdata.co
// var acces_key_ipdata = 'ddab562a0a81f6589d4744f5db975f0555a394a5bf2cd896adbb58dd'

$.get('http://api.ipapi.com/check?access_key=' + access_key_ipapi, function(respuesta_ip) {

  var ip = respuesta_ip['ip'];
  // Obtengo los resultados de la API a través de ajax
  $.ajax({
    url: 'http://api.ipapi.com/' + ip + '?access_key=' + access_key_ipapi,   
    dataType: 'jsonp',
    success: function(json) {

        var d = new Date();
        ipapi_data = JSON.stringify(json);
        localStorage.setItem("testJSON", ipapi_data);
        
        var pais = json['country_name']
        var ciudad = json['region_name'];
        var localidad = json['city'];
        var img_bandera = json['location']['country_flag'];
        var zip_code = json['zip'];
        var lat = json['latitude'].toFixed(1);
        var lon = json['longitude'].toFixed(1);
   
        $('#localidad').text(localidad)
        $('#ciudad').text(ciudad);
        $('#flag').attr('src', img_bandera);
        $('#pais').text(pais)

        $.get("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + access_key_openwe, function(wResponse) {
          var respuesta_openwe = wResponse;
          var temp_c = ((respuesta_openwe['main']['temp'] - 273.15).toFixed(0) + '°');
          var cielo = respuesta_openwe['weather'][0]['description'];
          var codigo_icono = respuesta_openwe['weather'][0]['icon'];

          traductor_clima = {
            'clear sky': 'Despejado',
            'few clouds': 'Ligeramente Nublado',
            'scattered clouds': 'Nubes dispersas',
            'broken clouds': 'Nublado',
            'shower rain': 'Llovizna',
            'rain': 'Lluvia',
            'thunderstorm': 'Tormenta',
            'snow': 'Nieve',
            'mist': 'Niebla',
            'light rain': 'Lluvia ligera'
          }
  
          $('#temperatura').text(temp_c);
          $('#cielo').text(traductor_clima[cielo]);
      
          $('#icono_clima').attr('src', 'http://openweathermap.org/img/wn/' + codigo_icono + '@2x.png');

        });
    }
  });
});


// FUNCIÓN PARA MOSTRAR LAS TABLAS
function mostrarTabla() {
  $('#tabla_ipapi').css('display', 'block');
  $('#tabla_ipapi').css('visibility', 'visible');
  $('#tabla_weather').css('display', 'block');
  $('#tabla_weather').css('visibility', 'visible');
  $('#contenedor_tablas').css('height', '10rem');

  $('.mas_info').text('Ocultar');
  $('.mas_info').css('width', '6rem');
  $('.mas_info').attr('onclick', 'ocultarTabla()')
}

// FUNCIÓN PARA OCULTAR LAS TABLAS
function ocultarTabla() {
  $('#tabla_ipapi').css('display', 'none');
  $('#tabla_ipapi').css('visibility', 'hidden');
  $('#tabla_weather').css('display', 'none');
  $('#tabla_weather').css('visibility', 'hidden');
  $('#contenedor_tablas').css('height', '6.8rem');
  $('.mas_info').text('+info');
  $('.mas_info').css('width', '3.3rem');
  $('.mas_info').attr('onclick', 'mostrarTabla()')
}

function obtenerIP() {
  var result = null;
  var urlIP = 'https://api.ipify.org/?format=json';
  $.ajax({
    url: urlIP,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
      // result = JSON.parse(data);
      result_ip = data.ip;
      

}


function conocerUbicacion() {
  var miIP = obtenerIP();
  // var miIP = '181.118.77.198';
  console.log(miIP);
  var urlGeo = "https://freegeoip.app/json/" + miIP;
  var ubicacionCliente = null;
  $.ajax({
      url: urlGeo,
      type: 'get',
      dataType: 'json',
      async: false,
      success: function(data) {
        console.log(data);
        ubicacionCliente = data['region_name'];
        console.log(ubicacionCliente)
      }
     
  });
  // console.log(ubicacionCliente)
  return ubicacionCliente; 
}

// <!-- Widget clima Buenos Aires-->
// <!-- https://forecast7.com/es/n34d60n58d38/buenos-aires/ -->
// <!-- Widget clima Neuquen-->
// <!-- https://forecast7.com/es/n38d95n68d06/neuquen/ -->
// <!-- Widget Puerto Madryn -->
// <!-- https://forecast7.com/es/n42d77n65d03/puerto-madryn/ -->
var bsas = 'https://forecast7.com/es/n34d60n58d38/buenos-aires/';
var nqn = 'https://forecast7.com/es/n38d95n68d06/neuquen/';
var chubut = 'https://forecast7.com/es/n42d77n65d03/puerto-madryn/';
var ubicacion = conocerUbicacion();
var forecastElegido = '';

if (ubicacion == 'Buenos Aires') {
  forecastElegido = bsas;
} else if (ubicacion == 'Neuquén') {
  forecastElegido = nqn;
} else if (ubicacion == 'Chubut') {
  forecastElegido = pto_madryn;
}

$('#wid_set').attr('href', forecastElegido);
$('#wid_set').attr('data-label_1', ubicacion);