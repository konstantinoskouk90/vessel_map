<template>
  <div id="vessel-trip-table">
    <div id="search-input-container">
      <input
        id="search-input"
        type="text"
        v-model="searchValue"
        placeholder="Search by Vessel ID or Received Time"
      />
    </div>
    <EasyDataTable
      :headers="headers"
      :items="items"
      :rows-per-page="10"
      :search-field="searchField"
      :search-value="searchValue"
      theme-color="#1d90ff"
      table-class-name="customize-table"
    >
      <template #item-operation="item">
        <div id="operation-wrapper">
          <img
            alt="Delete"
            title="Delete"
            src="../assets/table/delete.png"
            class="operation-icon"
            @click="deleteItem(item)"
          />
          <img
            alt="Edit"
            title="Edit"
            src="../assets/table/edit.png"
            class="operation-icon"
          />
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, PropType } from "vue";
import type { Header } from "vue3-easy-data-table";
import { format } from "date-fns";
import { MappedVessel } from "@/types/vessel-data";

export default defineComponent({
  name: "VesselTable",
  props: {
    vessels: {
      type: Object as PropType<MappedVessel[]>,
      required: true,
    },
    deletePosition: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const vessels = toRefs(props).vessels;
    const deletePosition = toRefs(props).deletePosition;

    const searchField = ["vesselId", "receivedTimeUtc"];
    const searchValue = ref("");

    function generateColumns(data: MappedVessel[]) {
      return data.map((vessel, index) => {
        return {
          index,
          vesselId: vessel.vessel_id,
          latitude: vessel.latitude,
          longitude: vessel.longitude,
          receivedTimeUtc: format(
            new Date(vessel.received_time_utc),
            "yyyy-MM-dd HH:mm:SS"
          ),
        };
      });
    }

    const headers: Header[] = [
      { text: "Vessel ID", value: "vesselId", sortable: true },
      { text: "Latitude", value: "latitude" },
      { text: "Longitude", value: "longitude" },
      { text: "Received Time (UTC)", value: "receivedTimeUtc", sortable: true },
      { text: "Operation", value: "operation" },
    ];

    return {
      headers,
      items: generateColumns(vessels.value),
      searchField,
      searchValue,
      deleteItem: deletePosition.value,
    };
  },
});
</script>

<style scoped>
#vessel-trip-table {
  bottom: 0;
  height: 40%;
  position: absolute;
  width: 100%;
}

#search-input-container {
  background-color: #2d3a4f;
  display: flex;
  padding: 12px;
}

#search-input {
  background-color: #1b1212;
  border: 1px solid #c1cad4;
  border-radius: 2px;
  color: #c1cad4;
  height: 30px;
  padding-left: 8px;
  width: 260px;
}

#operation-wrapper {
  display: flex;
  column-gap: 12px;
}

#operation-wrapper img {
  cursor: pointer;
}

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 30px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 30px;
  --easy-table-body-row-font-size: 13px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 40px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #2d3a4f;
}
</style>
