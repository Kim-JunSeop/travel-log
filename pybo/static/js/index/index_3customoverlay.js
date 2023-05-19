async function createCustomOverlay(markerData, isMarker2) {

    var imageSrc0;
    let htmlcontent;

    if (isMarker2==true) {
        imageSrc0 = `/static/image/marker2_images/${markerData.img_name}`;
    } else {
        imageSrc0 = `/static/image/${markerData.id}/${markerData.img_name}`;
    }

    const isValidPath = await is_directory(imageSrc0);
    if (!isValidPath) {
        imageSrc0 = "/static/image/main_01.jpg";
    }

    if (isMarker2==false){
        htmlcontent = `
        <div class="custom-overlay">
            <div class="info-window">
                <div class="image-container">
                    <button class="slide-button left">&lt;</button>
                    <img src="${imageSrc0}" class="active" /> 
                    <button class="slide-button right">&gt;</button>
                </div>
                <p>${markerData.subject}</p>
                <p><a href="http://127.0.0.1:5000/question/detail/${markerData.id}">바로가기</a></p>
                <button class="infoClose" onclick="closeOverlay()">X</button>
            </div>
        </div>
    `;
    } else {
        htmlcontent = `
        <div class="custom-overlay">
            <div class="info-window">
                <div class="image-container">
                    <button class="slide-button left">&lt;</button>
                    <img src="${imageSrc0}" class="active" /> 
                    <button class="slide-button right">&gt;</button>
                </div>
                <p>${markerData.subject}</p>
                <p><button id="detailButton">자세히보기</button></p>
                <button class="infoClose" onclick="closeOverlay()">X</button>
            </div>
        </div>
    `;
    }

    const [latitude, longitude] = markerData.local.split(',').map(Number);
    let positionWhenOverlay = new kakao.maps.LatLng(latitude, longitude);

    const customOverlay = new kakao.maps.CustomOverlay({
        content: htmlcontent,
        map: null,
        position: positionWhenOverlay,
        xAnchor: 0.5,
        yAnchor: 1.5,
        zIndex: 10
    });
    
    const leftButton = customOverlay.a.querySelector('.left');
    const rightButton = customOverlay.a.querySelector('.right');
    const images = customOverlay.a.querySelectorAll('img');
    let activeImageIndex = 0;

    leftButton.addEventListener('click', () => {
        images[activeImageIndex].style.left = '100%';
        activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
        images[activeImageIndex].style.left = '0';
    });

    rightButton.addEventListener('click', () => {
        images[activeImageIndex].style.left = '-100%';
        activeImageIndex = (activeImageIndex + 1) % images.length;
        images[activeImageIndex].style.left = '0';
    });

    return customOverlay;
}