export type Vessel = {
  vessel_id: number;
  [" received_time_utc"]: string;
  [" latitude"]: number;
  [" longitude"]: number;
};

export type MappedVessel = {
  index: number;
  vessel_id: number;
  received_time_utc: string;
  latitude: number;
  longitude: number;
};

export function vesselDataValidator(value: MappedVessel[]) {
  const { vessel_id, latitude, longitude, received_time_utc } = value[0];

  if (value) {
    return !!(vessel_id && latitude && longitude && received_time_utc);
  }
}
