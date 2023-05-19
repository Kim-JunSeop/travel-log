const modalFormTemplate = `
    <div id="myModal2" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="modifyForm">
                        <input type="hidden" id="markerID2" value="">
                        <input type="hidden" id="userID2" value="">
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" class="form-control" id="title2" value="" readonly>

                        </div>
                        <div class="form-group">
                            <label for="content">Content</label>
                            <textarea class="form-control" id="content2" rows="10" style="width: 100%; height: 200px;" readonly></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image">Image</label>
                            <img id="image2" src="" alt="Uploaded image" style="width: 300px; height: auto;">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="modifyButton">Modify</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
`;




async function displayMarkers() {
    if (!isLoggedIn) {
        return;
    }
    const markers = await fetchMarkers();
    const friendList = await fetchFriends();
    const addedMarkers = await fetchMarkers2(); //marker 2
    friends = friendList.map(friend => friend.user_id);
    const friendsMarkers = markers.filter(marker => friends.includes(marker.user_id));
    myIDval = await fetchMyID();

    await Promise.all(
        markers.map(async (marker) => {
            const localArray = marker.local.split(',');
            const position = new kakao.maps.LatLng(localArray[0], localArray[1]);

            var imageSrc1 = `/static/image/${marker.id}/${marker.img_name}`;
            if (!(await is_directory(imageSrc1))) {
                imageSrc1 = '/static/image/main_01.jpg';
            }
            var imageSize = new kakao.maps.Size(64, 69);
            var imageOption = { offset: new kakao.maps.Point(27, 69) };
            var markerImage = new kakao.maps.MarkerImage(
                imageSrc1,
                imageSize,
                imageOption
            );

            const newMarker = new kakao.maps.Marker({
                map: map,
                position: position,
                image: markerImage,
            });

            const customOverlay = await createCustomOverlay(marker, false);

            kakao.maps.event.addListener(newMarker, 'click', function () {
                customOverlay.setMap(map);
            });

            const closeButton = customOverlay.a.querySelector('.infoClose');
            closeButton.addEventListener('click', () => {
                customOverlay.setMap(null);
            });

            allMarkers.push({
                userId: marker.user_id,
                marker: newMarker,
                overlay: customOverlay,
            });
        })
    );
    await Promise.all(
        addedMarkers.map(async (marker2) => {
            const localArray = marker2.local.split(',');
            const position2 = new kakao.maps.LatLng(localArray[0], localArray[1]);

            var imageSrc2 = `/static/image/marker2_images/${marker2.img_name}`;
            if (!(await is_directory(imageSrc2))) {
                imageSrc2 = '/static/image/main_01.jpg';
            }
            var imageSize2 = new kakao.maps.Size(64, 69);
            var imageOption2 = { offset: new kakao.maps.Point(27, 69) };
            var markerImage2 = new kakao.maps.MarkerImage(
                imageSrc2,
                imageSize2,
                imageOption2
            );

            const newMarker2 = new kakao.maps.Marker({
                map: map,
                position: position2,
                image: markerImage2,
            });

            const customOverlay = await createCustomOverlay(marker2, true);

            kakao.maps.event.addListener(newMarker2, 'click', function () {
                customOverlay.setMap(map);
            });

            const closeButton = customOverlay.a.querySelector('.infoClose');
            closeButton.addEventListener('click', () => {
                customOverlay.setMap(null);
            });

            const detailButton = customOverlay.a.querySelector('#detailButton');
            if (detailButton) {
                detailButton.addEventListener('click', function() {
                    const modalContent = document.querySelector('.secondmodal');
                    modalContent.innerHTML = modalFormTemplate;

                    // Wait until the modal form is in the document
                    setTimeout(function() {
                        const markerID2 = document.querySelector('#markerID2');
                        const userID2 = document.querySelector('#userID2');
                        const titleInput2 = document.querySelector('#title2');
                        const contentInput2 = document.querySelector('#content2');
                        const imageInput2 = document.querySelector('#image2');

                        markerID2.value = marker2.id;
                        userID2.value = marker2.user_id;
                        titleInput2.value = marker2.subject;
                        contentInput2.value = marker2.content;
                        imageInput2.src = `/static/image/marker2_images/${marker2.img_name}`;
                        $('#myModal2').modal('show');
                    }, 0);
                    
                    document.getElementById('modifyButton').addEventListener('click', function() {
                        document.getElementById('title2').removeAttribute('readonly');
                        document.getElementById('content2').removeAttribute('readonly');
                    
                        const imageForm = document.createElement('input');
                        imageForm.setAttribute('type', 'file');
                        imageForm.setAttribute('id', 'imageForm');
                    
                        const imageContainer = document.getElementById('image2').parentElement;
                        imageContainer.appendChild(imageForm);
                    });
                });
            }


            allMarkers.push({
                userId: marker2.user_id,
                marker: newMarker2,
                overlay: customOverlay,
            });
        })
    );

    updateMarkerVisibility();
}

function updateMarkerVisibility() {
    const selectedFilter = document.querySelector('input[name="markerFilter"]:checked').value;
    allMarkers.forEach(markerObj => {
        const isMyMarker = markerObj.userId === myIDval;
        const isFriendsMarker = friends.includes(markerObj.userId);
        const isNotMyMarker = !isMyMarker && !isFriendsMarker;

        let showMarker = false;

        if (isLoggedIn) {
            showMarker = (selectedFilter === 'myMarkers' && isMyMarker) ||
                (selectedFilter === 'friendsMarkers' && isFriendsMarker) ||
                (selectedFilter === 'allMarkers');
        } else {
            showMarker = (selectedFilter === 'allMarkers');
        }

        if (showMarker) {
            markerObj.marker.setMap(map);
        } else {
            markerObj.marker.setMap(null);
            markerObj.overlay.setMap(null);
        }
    });

    allMarkers2.forEach(markerObj => {
        const isMyMarker = markerObj.userId2 === myIDval;

        let showMarker = false;

        if (isLoggedIn) {
            showMarker = (selectedFilter === 'myMarkers' && isMyMarker);
        }

        if (showMarker) {
            markerObj.marker2.setMap(map);
        } else {
            markerObj.marker2.setMap(null);
            markerObj.overlay2.setMap(null);
        }
    });
}

