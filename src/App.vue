<template>
  <div id="container">
    <VesselMap v-if="vessels" :vessels="vessels" />
    <VesselTable
      v-if="vessels"
      :vessels="vessels"
      :deletePosition="deletePosition"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from "vue";
import VesselMap from "@/components/VesselMap.vue";
import VesselTable from "@/components/VesselTable.vue";
import { MappedVessel, Vessel } from "@/types/vessel-data";
import { asyncCsv2Json } from "@/utils/parser";

const csvVesselDataUrl = process.env.VUE_APP_CSV_VESSEL_DATA_URL as string;

export default defineComponent({
  name: "App",
  components: {
    VesselMap,
    VesselTable,
  },
  setup() {
    const state = reactive<{ vessels: MappedVessel[] | null }>({
      vessels: null,
    });

    const mapVessels = (vessels: Vessel[]) => {
      // CSV file bug adds quotes to some of the keys
      // We map that to the correct key names
      // and also filter out any null results
      const mappedVessels = vessels
        .filter((vessel) => vessel.vessel_id)
        .map((vessel, index) => {
          return {
            index: index,
            vessel_id: vessel.vessel_id,
            longitude: vessel[" longitude"],
            latitude: vessel[" latitude"],
            received_time_utc: vessel[" received_time_utc"],
          };
        });

      return mappedVessels;
    };

    asyncCsv2Json(csvVesselDataUrl).then(
      (response) => (state.vessels = mapVessels(response))
    );

    const deletePosition = (item: MappedVessel) => {
      // TODO: Delete row OR trigger modal to confirm deletion
      console.log("item", item);
    };

    return {
      ...toRefs(state),
      deletePosition,
    };
  },
});
</script>

<style>
body {
  background-color: #2d3a4f;
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#container {
  display: flex;
  flex-direction: column;
}
</style>
