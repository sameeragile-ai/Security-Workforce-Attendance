/**
 * Geolocation & Geofencing Utilities for Wardiya Security Operations
 */

// Earth radius in meters
const EARTH_RADIUS_METERS = 6371000;

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

/**
 * Calculates great-circle distance between two coordinates in meters using Haversine formula
 */
export function calculateDistanceMeters(
  point1: GeoCoordinate,
  point2: GeoCoordinate
): number {
  const lat1Rad = (point1.lat * Math.PI) / 180;
  const lat2Rad = (point2.lat * Math.PI) / 180;
  const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Checks if a coordinate is within a site's geofence radius
 */
export function isInsideGeofence(
  currentPos: GeoCoordinate,
  siteCenter: GeoCoordinate,
  radiusMeters: number
): { isInside: boolean; distanceMeters: number } {
  const distance = calculateDistanceMeters(currentPos, siteCenter);
  return {
    isInside: distance <= radiusMeters,
    distanceMeters: distance,
  };
}

/**
 * Formats distance for display
 */
export function formatDistance(distanceMeters: number, isArabic = false): string {
  if (distanceMeters < 1000) {
    return isArabic ? `${distanceMeters} م` : `${distanceMeters} m`;
  }
  const km = (distanceMeters / 1000).toFixed(1);
  return isArabic ? `${km} كم` : `${km} km`;
}

/**
 * Formats GPS coordinates to tactical format: 30°04'12.4"N 31°20'55.1"E
 */
export function formatTacticalCoordinates(lat: number, lng: number): string {
  const formatDMS = (degVal: number, positiveDirection: string, negativeDirection: string) => {
    const direction = degVal >= 0 ? positiveDirection : negativeDirection;
    const absDeg = Math.abs(degVal);
    const degrees = Math.floor(absDeg);
    const minutesNotTruncated = (absDeg - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return `${formatDMS(lat, 'N', 'S')} ${formatDMS(lng, 'E', 'W')}`;
}
