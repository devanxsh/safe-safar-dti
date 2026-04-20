import { useState, useEffect, useCallback, useMemo } from "react";

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationOptions {
  /** Watch for continuous position updates. Default: false */
  watch?: boolean;
  /** High accuracy mode. Default: true */
  enableHighAccuracy?: boolean;
  /** Timeout in ms. Default: 10000 */
  timeout?: number;
  /** Max cache age in ms. Default: 30000 */
  maximumAge?: number;
  /** Fallback coordinates when geolocation is unavailable */
  fallback?: { lat: number; lng: number };
}

/** Delhi coordinates used as fallback */
const DELHI_CENTER = { lat: 28.6139, lng: 77.209 };

export function useGeolocation({
  watch = false,
  enableHighAccuracy = true,
  timeout = 10_000,
  maximumAge = 30_000,
  fallback = DELHI_CENTER,
}: UseGeolocationOptions = {}): GeolocationState & { refetch: () => void } {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  const positionOptions: PositionOptions = useMemo(
    () => ({ enableHighAccuracy, timeout, maximumAge }),
    [enableHighAccuracy, timeout, maximumAge]
  );

  const onSuccess = useCallback((pos: GeolocationPosition) => {
    setState({
      location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      error: null,
      loading: false,
    });
  }, []);

  const onError = useCallback(
    (err: GeolocationPositionError) => {
      console.warn("[useGeolocation] Error:", err.message);
      setState({ location: fallback, error: err.message, loading: false });
    },
    [fallback]
  );

  const fetchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: fallback, error: "Geolocation not supported", loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    navigator.geolocation.getCurrentPosition(onSuccess, onError, positionOptions);
  }, [onSuccess, onError, fallback, positionOptions]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: fallback, error: "Geolocation not supported", loading: false });
      return;
    }

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, positionOptions);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, positionOptions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  return { ...state, refetch: fetchPosition };
}
