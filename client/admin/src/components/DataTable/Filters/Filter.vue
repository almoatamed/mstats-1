<template>
  <!-- eslint-disable -->
  <div class="">
    <v-dialog
      v-model="dialog.show"
      max-width="50%"
      :fullscreen="$vuetify.breakpoint.mobile"
    >
      <!-- activator  -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab color="royal" dark elevation="3" v-on="on" v-bind="attrs">
          <v-icon>{{filter_icon}}</v-icon>
        </v-btn>
      </template>

      <!-- Tabs -->
      <v-card
        :style="`height: ${Math.floor($vuetify.breakpoint.height * 0.8)}px;`"
      >
        <v-card-text class="pa-0">
          <v-tabs
            color="royal"
            :vertical="$vuetify.breakpoint.mdAndUp"
            show-arrows
            icons-and-text
          >
            <template class="" v-for="(filter, index) in filters">
              <v-tab :key="index">
                <v-icon class="ma-1">
                  {{ filter.component.tab.icon }}
                </v-icon>
                {{ filter.component.tab.title }}
              </v-tab>
              <v-tab-item :key="index">
                <component
                  v-bind:is="filter.component.name"
                  :values="filter.values"
                ></component>
              </v-tab-item>
            </template>
          </v-tabs>
        </v-card-text>
        <v-card-actions class="px-4 footer">
          <v-spacer></v-spacer>
          <v-btn @click="dialog.show = false" text color="royal"
            >Cancel</v-btn
          >
          <v-btn @click="$emit('apply', { filters, dialog })" text color="royal"
            >Apply</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "TableFilter",
  data: () => ({
    dialog: {
      show: false
    }
  }),
  props: {
    filter_icon: {
      type:String,
      default: 'mdi-filter-variant'
    },
    filters: {
      default: {
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
        userfilter: {
          component: {
            tab: {
              title: "By User",
              icon: "mdi-account"
            },
            name: "user-filter"
          },
          values: {}
        }
      }
    }
  }
};
</script>

<style>
.footer {
  width: 100%;
  /* background:red; */
  bottom: 0px;
  position: absolute;
}
</style>
