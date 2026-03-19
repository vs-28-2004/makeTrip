document.addEventListener("DOMContentLoaded", function () {

    console.log("Geocoding script loaded");

    const form = document.querySelector("#listingForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();  // 🚨 THIS IS CRITICAL

        let country = document.getElementById("country").value;
        let location = document.getElementById("location").value;

        let query = `${location}, ${country}`;

        console.log("Running geocoding for:", query);

        try {
            let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            let data = await res.json();

            if (data.length === 0) {
                alert("Location not found");
                return;
            }

            let lat = parseFloat(data[0].lat);
            let lon = parseFloat(data[0].lon);

            console.log("Lat:", lat, "Lng:", lon);  // ✅ DEBUG

            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lon;

            form.submit();  // ✅ NOW submit after filling

        } catch (err) {
            console.log(err);
            alert("Error fetching location");
        }
    });

});
