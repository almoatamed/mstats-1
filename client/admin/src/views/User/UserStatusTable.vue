<template>
  <!-- eslint-disable -->
  <filtered-data-table
    :deleted="0"
    :search_fields="search_fields"
    :table_actions="table_actions"
    :headers="headers"
    api_url="/sheet/fetch"
    title="Sheets"
    subtitle="Sheets Details Table"
    :no_search="false"
    :no_filter="false"
    :filters="filters"
    filter_icon="mdi-filter-variant"

    @log="log($event)"
  />
</template>

<script>
/* eslint-disable */
export default {
  data: () => ({
    headers: [
      { text: "ID", value: "sheet_id" },
      { text: "Doctor Name", value: "doctor_name" },
      { text: "Prescription Name", value: "prescription_name" },
      { text: "Status", value: "status" },
      { text: "Printed", value: "printed" },
      { text: "Pharmacy Name", value: "pharmacy_name" },
      { text: "Last Modified", value: "updated_at" }
    ],
    filters: {
      datetime: {
        component: {
          tab: {
            title: "Date And Time",
            icon: "mdi-calendar-clock"
          },
          name: "date-time-filter"
        },
        values: {}
      },
      user: {
        component: {
          tab: {
            title: "By User",
            icon: "mdi-account"
          },
          name: "user-filter"
        },
        values: {}
      }
    },
    table_actions: {
      name: "Table Actions",
      actions: [
        {
          event: "log",
          icon: "mdi-heart"
        },
        {
          event: "log",
          icon: "mdi-heart"
        },
        {
          event: "log",
          icon: "mdi-heart"
        }
      ]
    },
    search_fields:[
      'doctor_name', 'prescription_name', 'status', 'printed'
    ]
  }),
  methods:{
    log(event){
      console.log(event.item) // event.item is the object containing the row data
      event.refresh() // refresh is the method used to refresh the table if needed
    }
  }
};
</script>

<style></style>
