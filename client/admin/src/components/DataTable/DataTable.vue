<template>
  <!--eslint-disable  -->

  <!-- Main Card -->
  <div class="">
    <material-card color="rgb(6,76,134)" full-header>
      <template #heading>
        <v-container class="white--text pa-4">
          <v-row>
            <v-col cols="12" md="3">
              <v-container>
                <v-row>
                  <v-col cols="12" class="text-h4 font-weight-light  ma-0 pa-0">
                    {{ title }}
                  </v-col>
                  <v-col cols="12" class="text-caption  ma-0 pa-0">
                    {{ subtitle }}
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col cols="12" md="9">
              <v-container>
                <v-row>
                  <v-text-field
                    v-if="!no_search"
                    v-model="header.form.search"
                    @input="do_search($event)"
                    label="Search"
                    prepend-icon="mdi-magnify"
                  ></v-text-field>
                  <table-filter
                    :filter_icon="filter_icon"
                    v-if="!no_filter"
                    @apply="apply_filter($event)"
                    :filters="filters"
                  />
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-card-text>
        <v-data-table
          :headers="full_table_header"
          :items="table.data"
          :options.sync="table.options"
          :loading="table.loading"
          :server-items-length="table.pagination.total_count"
          class="elevation-1"
        >
          <template v-if="table_actions.actions" v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              v-for="(action, index) in table_actions.actions"
              :key="index"
              @click="$emit(action.event, {item,refresh:getDataFromApi})"
            >
              {{ action.icon }}
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </material-card>
  </div>
</template>
<script>
/* eslint-disable */
import Api from "@/api/api/index";

export default {
  name: "FilteredDataTable",
  methods: {
    do_search(val) {
      this.header.form.search = val;
      this.options.page = 1;
      this.getDataFromApi();
    },
    apply_filter(event) {
      event.dialog.show = false;
      this.header.form.filters_values = event.filters;
      this.options.page = 1;
      this.getDataFromApi();
    },
    getDataFromApi() {
      const self = this;
      this.table.loading = true;
      const body = {
        filters: self.header.form.filters_values || {},
        deleted: self.deleted,
        search: self.header.form.search || "",
        order_by: self.options.sortBy?.length > 0 ? self.options.sortBy : "",
        headers: self.headers.map(el => el.value),
        page: self.options.page,
        n_per_page: self.options.itemsPerPage,
        asc:
          self.options.sortDesc?.length == 0 ? false : !self.options.sortDesc?.[0]
      };
      Api.post(self.api_url, body).then(data => {
        const result = data.data.result;
        this.table.data = result.result.map(el => {
          el.updated_at = el.updated_at?.replace("T", " ").slice(0, -5);
          return el;
        });
        this.table.pagination.total_count = result.total_number;
        this.table.loading = false;
      });
    }
  },
  computed: {
    options() {
      return this.table.options;
    },
    full_table_header() {
      let full_headers = [
        {
          text: "No.",
          align: "start",
          sortable: false,
          value: "nn"
        },
        ...this.headers
      ];
      console.log(full_headers)
      if (this.table_actions?.actions?.length > 0) {
        full_headers.push({
          text: this.table_actions?.name || "Actions",
          value: "actions"
        });
      }
      console.log(full_headers)
      
      return full_headers;
    }
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    }
  },
  data: () => ({
    header: {
      form: {
        search: "",
        filters_values: {}
      }
    },
    table: {
      loading: true,
      options: {},
      data: [],
      pagination: {
        total_count: null
      }
    }
  }),
  props: {
    table_actions: {
      type: Object,
      default: () => ({})
      // example:{
      //   name:'Table Actions',
      //   actions:[
      //     {
      //       event:'an-action-event',
      //       icon: 'mdi-heart',
      //     },
      //   ]
      // }
    },
    deleted: {
      type: Number,
      default: 0
    },
    headers: {
      type: Array
      // example:[
      //   {name:'Username', value:'user_name'},
      //   {name:'Name', value:'name'},
      // ]
    },
    api_url: {
      type: String
      // example: '/user/fetch'
    },
    title: {
      type: String,
      default: "Table"
    },
    subtitle: {
      type: String,
      default: "A Data Table"
    },
    no_search: {
      type: Boolean,
      default: false
    },
    no_filter: {
      type: Boolean,
      default: false
    },
    filters: {
      default: () => ({
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
      })
    },
    filter_icon: {
      type: String,
      default: "mdi-filter-variant"
    }
  }
};

// headers: [
//   {
//     text: "No.",
//     align: "start",
//     sortable: false,
//     value: "nn"
//   },
//   { text: "Name", value: "name" },
//   { text: "Username", value: "user_name" },
//   { text: "Email", value: "email" },
//   { text: "Phone Number", value: "phone_number" },
//   { text: "Address", value: "address" },
//   { text: "Last Modified", value: "updated_at" }
// ],
</script>

<style></style>
