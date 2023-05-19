document.querySelectorAll('input[name="markerFilter"]').forEach(filterInput => {
    filterInput.addEventListener('change', updateMarkerVisibility);
});

displayMarkers();

function closeOverlay(){
    customOverlay.setMap(null);
}