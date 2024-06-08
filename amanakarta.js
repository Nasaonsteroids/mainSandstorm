document.addEventListener('DOMContentLoaded', function () {
    // Skapa en Leaflet-karta och centrerad vy vid [21.505, -0.09]
    const mymap = L.map('map').setView([21.505, -0.09], 4);

    // Lägg till en OpenStreetMap-tillfället på kartan
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(mymap);

    // Skapa en grupp för markörkluster och lägg till den på kartan
    const markers = L.markerClusterGroup().addTo(mymap);
    let lastClickedMarker;

    // Array för lagring av koordinater och variabel för vägvisning
    const latlngs = [];
    let route;

    // Lägg till en klicklyssnare på kartan för att placera markörer
    mymap.on('click', function (e) {
        const { lat, lng } = e.latlng;

        // Avbryt om inte i läge för att placera markörer
        if (!isMarkerPlacementMode) {
            return;
        }

        // Lägg till en markör på den klickade platsen
        addMarker(lat, lng, 'Marker', false);
    });

    // Funktion för att lägga till en markör på given plats
    function addMarker(lat, lng, label, isSearch) {
        // Skapa en markör med möjlighet att dra och släppa
        const marker = L.marker([lat, lng], { draggable: true });
        marker.bindPopup(label);
        markers.addLayer(marker);
        latlngs.push([lat, lng]);

        // Uppdatera vägvisningen när markören dras
        marker.on('drag', function (event) {
            latlngs[latlngs.length - 1] = event.target.getLatLng();
            if (route) {
                mymap.removeLayer(route);
            }
            route = L.polyline(latlngs, { color: 'blue' }).addTo(mymap);
        });

        // Beräkna avståndet och visa popup om det inte är sökläge
        if (!isSearch && latlngs.length > 1) {
            if (route) {
                mymap.removeLayer(route);
            }
            route = L.polyline(latlngs, { color: 'blue' }).addTo(mymap);

            const distance = marker.getLatLng().distanceTo(lastClickedMarker.getLatLng());

            let distanceString;
            if (distance > 10000) {
                // Konvertera avstånd till kilometer om det är över 10 000 meter
                const distanceInKilometers = distance / 1000;
                distanceString = `Avstånd till senaste markör: ${distanceInKilometers.toFixed(2)} kilometer`;
            } else {
                distanceString = `Avstånd till senaste markör: ${distance.toFixed(2)} meter`;
            }

            marker.bindPopup(distanceString).openPopup();
        }

        // Anpassa kartvyn efter markörerna
        const bounds = L.latLngBounds(latlngs);
        mymap.fitBounds(bounds);

        lastClickedMarker = marker;
    }

    // Funktion för att utföra geokodning av en adress
    function geocodeAddress(address, callback) {
        const apiKey = '2bdb58f4fa004c08ba80af04fed97e3f';
        const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

        // Hämta geokodningsdata från OpenCage API
        fetch(geocodingUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Geokodningsförfrågan misslyckades med status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry;
                    // Callback med koordinaterna
                    callback(lat, lng);
                } else {
                    console.error('Geokodning misslyckades. Inga resultat hittades.');
                }
            })
            .catch(error => {
                console.error('Fel under geokodning:', error);
            });
    }

    // Funktion för att hämta användarens plats via geolokalisering
    function getUserLocation() {
        // Kontrollera om geolokalisering stöds
        if ('geolocation' in navigator) {
            // Alternativ för geolokalisering
            const geolocationOptions = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            // Hämta användarens aktuella position
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const { latitude, longitude } = position.coords;
                    const label = "Min plats";
                    addMarker(latitude, longitude, label);
                },
                function (error) {
                    console.error('Fel vid hämtning av geolokalisering:', error.message);

                    // Be användaren ange plats manuellt om geolokalisering misslyckas
                    const manualLocation = prompt('Geolokalisering misslyckades. Ange din plats manuellt:');
                    if (manualLocation) {
                        geocodeAddress(manualLocation, function (lat, lng) {
                            addMarker(lat, lng, 'Manuell plats', false);
                        });
                    }
                },
                geolocationOptions
            );
        } else {
            // Hantera fall där geolokalisering inte stöds av webbläsaren
            console.error('Geolokalisering stöds inte av denna webbläsare.');

            // Be användaren ange plats manuellt om geolokalisering inte stöds
            const manualLocation = prompt('Geolokalisering stöds inte. Ange din plats manuellt:');
            if (manualLocation) {
                geocodeAddress(manualLocation, function (lat, lng) {
                    addMarker(lat, lng, 'Manuell plats', false);
                });
            }
        }
    }

    // Anropa funktionen för att hämta användarens plats
    getUserLocation();

    // Lägg till klicklyssnare på sökknappen för att centrera kartan på angiven adress
    document.getElementById('searchBtn').addEventListener('click', function () {
        const searchAddress = document.getElementById('searchInput').value;

        geocodeAddress(searchAddress, (lat, lng) => {
            mymap.setView([lat, lng], mymap.getZoom());
        });
    });

    // Lägg till klicklyssnare på knappen för att lägga till markör baserat på angiven adress och etikett
    document.getElementById('addMarkerBtn').addEventListener('click', function () {
        const addressInput = document.getElementById('addressInput');
        const labelInput = document.getElementById('labelInput');

        if (addressInput && labelInput) {
            const address = addressInput.value;
            const label = labelInput.value;

            // Geokoda adressen och lägg till markören
            geocodeAddress(address, (lat, lng) => {
                addMarker(lat, lng, label, false);
            });
        }
    });

    // Variabel för att hålla reda på om vi är i läge för att placera markörer
    let isMarkerPlacementMode = false;

    // Lägg till klicklyssnare på knappen för att växla mellan läge för placering och beräkning av avstånd
    document.getElementById('toggleModeBtn').addEventListener('click', function () {
        toggleMode();
    });

    // Funktion för att byta mellan läge för placering och beräkning av avstånd
    function toggleMode() {
        isMarkerPlacementMode = !isMarkerPlacementMode;

        // Uppdatera gränssnittet och kartan beroende på läget
        if (isMarkerPlacementMode) {
            mymap.getContainer().style.cursor = 'pointer';
            infoPopup.setContent('Klicka på kartan för att placera markörer.');
            mymap.dragging.enable();
        } else {
            mymap.getContainer().style.cursor = '';
            infoPopup.setContent('Klicka på kartan för att beräkna avstånd.');
            mymap.dragging.disable();
        }
    }

    // Skapa en knapp för att växla läge och lägg till den på kartan
    const toggleButton = L.control({ position: 'topright' });

    toggleButton.onAdd = function (map) {
        const button = L.DomUtil.create('button', 'leaflet-control-layers leaflet-control-layers-base');
        button.innerHTML = 'Växla läge';
        button.onclick = function (e) {
            e.stopPropagation();
            toggleSelectionMode();
        };
        return button;
    };

    toggleButton.addTo(mymap);

    // Skapa en popup för information och lägg till den på kartan
    const infoPopup = L.popup({ closeButton: false, autoClose: false, closeOnClick: false })
        .setLatLng([0, 0])
        .setContent('')
        .addTo(mymap);

    // Lägg till klicklyssnare på kartan för att visa information om klickad plats
    mymap.on('click', function (e) {
        const { lat, lng } = e.latlng;

        // Utför omvänd geokodning för att få landet och visa information
        reverseGeocode(lat, lng, function (country) {
            if (country) {
                fetchCountryInfo(country, function (info) {
                    if (info) {
                        infoPopup.setLatLng(e.latlng).openOn(mymap);
                        infoPopup.setContent(`<b>${country}</b><br>${info}`);
                    }
                });
            }
        });
    });

    // Funktion för att utföra omvänd geokodning och hämta landet
    function reverseGeocode(lat, lng, callback) {
        const apiKey = '2bdb58f4fa004c08ba80af04fed97e3f';
        const reverseGeocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

        // Hämta omvänd geokodningsdata från OpenCage API
        fetch(reverseGeocodingUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Omvänd geokodningsförfrågan misslyckades med status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const country = data.results[0].components.country;
                    // Callback med landet
                    callback(country);
                } else {
                    callback(null);
                }
            })
            .catch(error => {
                console.error('Fel under omvänd geokodning:', error);
                callback(null);
            });
    }

    // Funktion för att hämta information om ett land från Wikipedia
    function fetchCountryInfo(country, callback) {
        const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&titles=${encodeURIComponent(country)}&callback=handleWikipediaResponse`;

        // Callback-funktion för att hantera Wikipedia API-svar
        window.handleWikipediaResponse = function (data) {
            console.log('Wikipedia API Response:', data);

            // Hämta sidinformation från API-svaret
            const page = data.query?.pages ? Object.values(data.query.pages)[0] : null;

            // Om det finns information, skicka tillbaka en del av den
            if (page && page.extract) {
                let info = page.extract.substring(0, 1000);
                callback(info);
            } else {
                console.warn('Varning: Ingen information hittades för landet på Wikipedia.');
                callback('Information ej tillgänglig.');
            }
        };

        // Skapa och lägg till ett skripte för att hämta Wikipedia-data
        const script = document.createElement('script');
        script.src = wikipediaApiUrl;
        document.head.appendChild(script);
    }
});
