var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.58, 127), // 지도의 중심좌표
    level: 9, // 지도의 확대 레벨
    mapTypeId: kakao.maps.MapTypeId.ROADMAP, // 지도종류
};
var map = new kakao.maps.Map(mapContainer, mapOption);