interface Coordinates {
  lat: number;
  lng: number;
}

export const calculateRoute = async (start: Coordinates, end: Coordinates) => {
  try {
    const response = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`
    );

    if (!response.ok) {
      throw new Error("OSRM API request failed");
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const distanceKm = route.distance / 1000; // 미터를 킬로미터로 변환
    const durationMin = route.duration / 60; // 초를 분으로 변환

    return {
      distance: distanceKm.toFixed(2) + "km",
      duration: Math.round(durationMin) + "분",
      type: "osrm_driving",
    };
  } catch (error) {
    console.error(
      "Route calculation failed, falling back to direct distance:",
      error
    );

    // 실패 시 직선 거리 계산으로 폴백
    const distance = getDistanceFromLatLonInKm(
      start.lat,
      start.lng,
      end.lat,
      end.lng
    );
    const duration = (distance / 30) * 60; // 차량 30km/h 기준

    return {
      distance: distance.toFixed(2) + "km",
      duration: Math.round(duration) + "분",
      type: "direct_distance_fallback",
    };
  }
};

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
