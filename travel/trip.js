document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchTrip");
    if (!searchButton) {
        console.error("Button with ID 'searchTrip' not found!");
        return;
    }

    searchButton.addEventListener("click", () => {
        const startLocation = document.getElementById("startLocation").value.trim();
        const endLocation = document.getElementById("endLocation").value.trim();

        if (!startLocation || !endLocation) {
            alert("Please enter both start and destination locations.");
            return;
        }

        getCoordinates(startLocation, (startCoords) => {
            if (!startCoords) {
                alert("Could not fetch coordinates for start location.");
                return;
            }

            getCoordinates(endLocation, (endCoords) => {
                if (!endCoords) {
                    alert("Could not fetch coordinates for destination.");
                    return;
                }

                getTripInfo(startCoords, endCoords);
            });
        });
    });
});

function getCoordinates(location, callback) {
    const apiKey = "5b3ce3597851110001cf624877ec8a1d47724c37bfd9abfd5bfc16ce";
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(location)}&size=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const coords = data.features[0].geometry.coordinates;
                console.log(`Coordinates for ${location}:`, coords);
                callback(coords);
            } else {
                console.error("No coordinates found for", location);
                callback(null);
            }
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
            callback(null);
        });
}

function getTripInfo(startCoords, endCoords) {
    const apiKey = "5b3ce3597851110001cf624877ec8a1d47724c37bfd9abfd5bfc16ce";
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoords[0]},${startCoords[1]}&end=${endCoords[0]},${endCoords[1]}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.features || data.features.length === 0) {
                console.error("No route available. Try different locations.");
                document.getElementById("tripDetails").innerHTML = "No route available. Try different locations.";
                return;
            }

            const route = data.features[0].properties.segments[0];
            const distance = (route.distance / 1000).toFixed(2); // Convert meters to km
            const duration = (route.duration / 60).toFixed(2); // Convert seconds to minutes

            document.getElementById("tripDetails").innerHTML = `
                <p><strong>Distance:</strong> ${distance} km</p>
                <p><strong>Estimated Duration:</strong> ${duration} minutes</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching trip details:", error);
            document.getElementById("tripDetails").innerHTML = "Error fetching trip details.";
        });
}
