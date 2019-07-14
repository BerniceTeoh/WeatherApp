let lat, lon;

if('geolocation' in navigator){
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(lat, lon);
        document.getElementById('latitude').textContent = lat.toFixed(2);
        document.getElementById('longitude').textContent = lon.toFixed(2);
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);
        //console.log(position);
        });
    } else{
        console.log('geolocation not available');
    }   

const button = document.getElementById('submit');
button.addEventListener('click', async event => {
    const location = document.getElementById('location').value;
    const data = {lat, lon, location};
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', option);
    const json = await response.json();
    console.log(json);
});