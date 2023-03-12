<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, PropType } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MappedVessel } from "@/types/vessel-data";

mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_GL_TOKEN as string;

export default defineComponent({
  name: "VesselMap",
  props: {
    vessels: {
      type: Object as PropType<MappedVessel[]>,
      required: true,
    },
  },
  setup(props) {
    const vessels = toRefs(props).vessels;

    // Create data structure required to render the vessels
    // Using symbols with icons instead of markers to optimize performance
    const vesselData: Record<
      number | string,
      {
        data: {
          type: "Feature";
          geometry: { type: "Point"; coordinates: number[] };
          properties: Record<string, string>;
        }[];
      }
    > = {};

    vessels.value.forEach((vessel) => {
      if (!vesselData[vessel.vessel_id]?.data) {
        vesselData[vessel.vessel_id] = { data: [] };
      }

      vesselData[vessel.vessel_id].data?.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [vessel.longitude, vessel.latitude],
        },
        properties: {},
      });
    });

    onMounted(() => {
      // Initialize the map with settings
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11?optimize=true",
        center: [15, 20],
        zoom: 2,
        minZoom: 2,
      });

      map.on("load", () => {
        // Traverse vessel array and draw all vessels
        Object.keys(vesselData).forEach((vesselId) => {
          map.loadImage(
            require(`../assets/vessels/${vesselId}.png`),
            (error, image) => {
              if (error) {
                throw error;
              }

              if (image) {
                map.addImage(`image-${vesselId}`, image);
              }

              map.addSource(`source-${vesselId}`, {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: vesselData[vesselId].data,
                },
              });

              map.addLayer({
                id: `layer-${vesselId}`,
                type: "symbol",
                source: `source-${vesselId}`,
                layout: {
                  "icon-image": `image-${vesselId}`,
                },
              });
            }
          );
        });
      });
    });
  },
});
</script>

<style scoped>
#map {
  bottom: 0;
  height: 60%;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
