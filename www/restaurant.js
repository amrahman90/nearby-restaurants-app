var xmlhttp;
var posLat;
var posLong;

window.onload = function()
{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = processResult;
}

function getLocation()
{
    var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(success, failure, options);   
}

function success(position)
{
    var latitude = position.coords.latitude;
    var long = position.coords.longitude;
    var googleURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/xml?key=AIzaSyCCj1I9TlM3xm_QjoAocPt_i3ycSPbmPXs&location=${latitude},${long}&rankby=distance&keyword=restaurant`;
    posLat = latitude;
    posLong = long;
    getRestaurantList(googleURL);                    
}

function getRestaurantList(URL)
{
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}

function processResult()
{
    var out="<ul data-role='listview' data-inset='true' id='restList'>"; 
    
    if(xmlhttp.readyState == 4 && xmlhttp.status==200)
    {
        var restaurantXML = $.parseXML(xmlhttp.responseText);
        var xml = $(restaurantXML);
        $(xml).find("result").each(function(){
            var name = $(this).find('name').text();
            var address = $(this).find('vicinity').text();
            var rating = $(this).find('rating').text();
            var open = $(this).find('opening_hours').find('open_now').text();
           
            //Build output string
            out += "<li data-role='list-divider'><h1>";
            out += name + "</h1></li>";
            out += "<li>" + address;
            out += "<p>Google Rating: " + rating + "</p>";
            if(open){
                out += "<p class='ul-li-aside'>Open Now!</p>";
            }
            out += "</li>";
        });
    }
    out += "</ul>";
    document.getElementById('result').innerHTML = "<h1>Restaurants Nearby</h1>";
    document.getElementById('result').innerHTML = out;
    $("#restList").listview().listview('refresh');  
}

function failure(message)
{
    alert("Error:" + message.message);
}

function clearScreen()
{
    document.getElementById('result').innerHTML = "";
}
