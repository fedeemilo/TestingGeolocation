const cachedFetch = (url, options) => {
  let expiry = 5 * 60 // 5 min default
  if (typeof options === 'number') {
    expiry = options;
    options = undefined;
  } else if (typeof options === 'object') {
    // I hope you didn't set it to 0 seconds
    expiry = options.seconds || expiry
  }
  // Use the URL as the cache key to sessionStorage
  let cacheKey = url;
  let cached = localStorage.getItem(cacheKey);
  let whenCached = localStorage.getItem(cacheKey + ':ts');
  if (cached !== null && whenCached !== null) {
    // it was in sessionStorage! Yay!
    // Even though 'whenCached' is a string, this operation
    // works because the minus sign converts the
    // string to an integer and it will work.
    let age = (Date.now() - whenCached) / 1000;
    if (age < expiry) {
      let response = new Response(new Blob([cached]));
      return Promise.resolve(response);
    } else {
      // We need to clean up this old key
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(cacheKey + ':ts');
    }
  }

  return fetch(url, options).then(response => {
    // let's only store in cache if the content-type is
    // JSON or something non-binary
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type');
      console.log(response);
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // There is a .json() instead of .text() but
        // we're going to store it in sessionStorage as
        // string anyway.
        // If we don't clone the response, it will be
        // consumed by the time it's returned. This
        // way we're being un-intrusive.
        response.clone().text().then(content => {
          localStorage.setItem(cacheKey, content);
          localStorage.setItem(cacheKey+':ts', Date.now());
        })
      }
    }
    return response
  })
}

cachedFetch('https://httpbin.org/get')
  .then(r => r.json())
  .then(info => {
    var miIP = info.origin.split(',')[0];
    console.log('Tu IP es: ' + miIP);
    
});

// var ip = localStorage['miIP'];
// console.log('MI IP -> ' + localStorage['miIP']);
console.log(localStorage);


//MI IP: 181.231.68.168
//API key de ipapi.com
var access_key_ipapi = 'be01136fd4764adc6ca013ae7c59882f';
// API key openweather.org
var access_key_openwe = '7dc0fd11d872c5087f99c2e5debc2413';
//API key de api.ipdata.co
// var acces_key_ipdata = 'ddab562a0a81f6589d4744f5db975f0555a394a5bf2cd896adbb58dd'

$.get('http://api.ipapi.com/check?access_key=' + access_key_ipapi, function(respuesta_ip) {

  var ip = respuesta_ip['ip'];
  // var ip = '41.203.239.255';
  console.log(respuesta_ip)
  // get the API result via jQuery.ajax
  $.ajax({
    url: 'http://api.ipapi.com/' + ip + '?access_key=' + access_key_ipapi,   
    dataType: 'jsonp',
    success: function(json) {

        var d = new Date();
        console.log('Hora Actual: '+d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
        // console.log(json);
        var pais = json['country_name']
        var ciudad = json['region_name'];
        var localidad = json['city'];
        var img_bandera = json['location']['country_flag'];
        var zip_code = json['zip'];
        var lat = json['latitude'].toFixed(1);
        console.log('Lat: ' + lat);;
        var lon = json['longitude'].toFixed(1);
        console.log('Lon: ' + lon);
        $('#localidad').text('Localidad: ' + localidad)
        $('#ciudad').text('Ciudad: ' + ciudad);
        $('#flag').attr('src', img_bandera);
        $('#cod_postal').text('Código Postal: ' +  zip_code);
        $('#pais').text(pais)

        $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + access_key_openwe, function(wResponse) {
          console.log(wResponse);
          var respuesta_openwe = wResponse;
          var temp_k = respuesta_openwe['main']['temp'];
          var temp_c = (respuesta_openwe['main']['temp'] - 273.15).toFixed(0) + '°';
          var localidad = respuesta_openwe['name'];
          var temp_max = (respuesta_openwe['main']['temp_max'] - 273.15).toFixed(0) + '°';  
          var temp_min = (respuesta_openwe['main']['temp_min'] - 273.15).toFixed(0) + '°';
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
      
          $('#latlongitud').text('Lat & Long: ' + lat + ', ' + lon);
          $('#temperatura').text('Temp°: ' + temp_c);
          $('#temp_min').text('Temp° mínima: ' + temp_min);
          $('#temp_max').text('Temp° máxima: ' + temp_max);
          // $('#clima').text('Clima: ' + clima);
          $('#cielo').text(traductor_clima[cielo]);
      
          $('#icono_clima').attr('src', 'http://openweathermap.org/img/wn/' + codigo_icono + '@2x.png');

        });
    }
  });
});


// RELOJ
function mueveReloj(){ 
  momentoActual = new Date() 
  hora = momentoActual.getHours() 
  console.log(typeof(hora))
  minuto = momentoActual.getMinutes() 
  segundo = momentoActual.getSeconds() 

  if (segundo < 10) {
    horaImprimible = "   " + hora + " :  " + minuto + " :  0" + segundo
  } else {
    horaImprimible = "   " +  hora + " :  " + minuto + " :  " + segundo
  }

  

  document.form_reloj.reloj.value = horaImprimible 

  //La función se tendrá que llamar así misma para que sea dinámica, 
  //de esta forma:

  setTimeout(mueveReloj,1000)
}

var static = require('node-static');
    
var fileServer = new static.Server('./public');
 
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);
 
                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();
}).listen(8080);