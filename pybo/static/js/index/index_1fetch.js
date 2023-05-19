async function fetchMarkers() {
    const response = await fetch('/route/get_markers');
    const markers = await response.json();
    return markers;
}

async function fetchFriends() {
    const response2 = await fetch('/route/get_friends');
    const friendsList = await response2.json();
    return friendsList;
}

async function fetchMarkers2() {
    const response = await fetch('/route/get_markers2');
    const addedMarkers = await response.json();
    return addedMarkers;
}

async function fetchMyID() {
    const response = await fetch('/route/get_my_id');
    const myID = await response.json();
    return myID;
}

async function is_directory(path) {
    try {
        const response = await fetch(path, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

let allMarkers = []; // 전체 마커를 저장할 배열
let allMarkers2 = [];
let friends = []; // 팔로우한 친구 목록을 저장할 배열
let myIDval;