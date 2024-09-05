const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        console.log("Position:", latitude, longitude); // Log position
        socket.emit("send-location", {latitude, longitude});
    },(error)=>{
        console.error("Geolocation error:", error); // Log errors
        alert('Error fetching location: ' + error.message); // Display error to user
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    });
} else {
    alert("Geolocation is not supported by this browser.");
}

const map = L.map('map').setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "Real-Time Tracking App"
}).addTo(map)

const marker = {};

socket.on("receive-location",(data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude,longitude]);
    }
    else{
        marker[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect", (id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})