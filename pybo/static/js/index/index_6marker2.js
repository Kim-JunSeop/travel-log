function addMarker(position) {
    var marker2 = new kakao.maps.Marker({
        position: position
    });
    marker2.setMap(map);
    kakao.maps.event.addListener(marker2, 'click', function() {
        $('#myModal').modal('show');
    });

    $('#markerForm').on('submit', function(e) {
        e.preventDefault();

        var title = $('#title').val();
        var content = $('#content').val();
        var image = $('#image')[0].files[0];

        var formData = new FormData(this);
        formData.append('user_id', myIDval); // Replace with actual user_id value
        formData.append('latitude', marker2.getPosition().getLat());
        formData.append('longitude', marker2.getPosition().getLng());
        formData.append('title', title);
        formData.append('content', content);
        formData.append('img_name', image); // If you're not uploading a file, remove this line

        $.ajax({
            url: '/route/add_marker',  // Replace with server's URL
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                console.log('서버로 전송완료')
            }
        });
        $('#myModal').modal('hide');

        kakao.maps.event.addListener(marker2, 'rightclick', function() {
            marker2.setMap(null);
        });
    });
}
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    addMarker(mouseEvent.latLng);
});