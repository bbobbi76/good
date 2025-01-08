const googleApiKey = 'AIzaSyBCl5hiZdLHpmqVLcDA89gn8ne7vL9leGI';  // 구글 API 키
const weatherApiKey = 'ox9D6PJ%2FuszBpnTkdmySdn8Rsfw%2FyPo2sKWIFqSKpbFJxB3kMK%2By2tfBk1K%2BoPT12XBnmlelwWNmvLfdNcQLbw%3D%3D';  // 기상청 API 키

// 도시명을 통해 위도, 경도 가져오기
function getCoordinates(city) {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleApiKey}`;
    return fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const location = data.results[0].geometry.location;
                return { lat: location.lat, lng: location.lng };
            } else {
                throw new Error('도시를 찾을 수 없습니다.');
            }
        });
}

// 기상청 API로 날씨 데이터 가져오기
function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('도시명을 입력하세요.');
        return;
    }

    getCoordinates(city).then(coords => {
        const lat = coords.lat;
        const lng = coords.lng;

        const apiUrl = `http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList?serviceKey=${weatherApiKey}&pageNo=1&numOfRows=10&dataType=JSON&dataCd=ASOS&dateCd=DAY&startDt=20250101&endDt=20250102&stnIds=108`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const items = data.response.body.items.item;
                if (items && items.length > 0) {
                    const weatherData = items[0];
                    document.getElementById('location').innerText = `위치: ${city}`;
                    // 데이터를 제대로 받았는지 확인하고 출력
                    const temperature = weatherData.maxTa ? `최고 기온: ${weatherData.maxTa}°C` : '기온 정보 없음';
                    const humidity = weatherData.avgRhm ? `평균 습도: ${weatherData.avgRhm}%` : '습도 정보 없음';
                    const description = weatherData.iscs ? `일기 현상: ${weatherData.iscs}` : '일기 현상 정보 없음';

                    document.getElementById('temperature').innerText = temperature;
                    document.getElementById('humidity').innerText = humidity;
                    document.getElementById('description').innerText = description;
                } else {
                    alert('날씨 정보를 가져올 수 없습니다.');
                }
            })
            .catch(error => {
                console.error('기상청 API 오류:', error);
                alert('날씨 정보를 가져오는 데 오류가 발생했습니다.');
            });
    }).catch(error => {
        alert(error.message);
    });
}
