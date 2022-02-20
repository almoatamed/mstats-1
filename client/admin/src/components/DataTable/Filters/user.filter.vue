<template>
  <!-- eslint-disable -->
  <v-card scrollable flat>
    <v-card-text class="px-8">
      <v-row>
        <h2>
          User Filter
        </h2>
        <p>
          Filter results by the user craeted/performed the modification. select
          the user from the sleect menu. to clear the filter press the red cross
          sign nex to the filter.
        </p>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            label="Search User"
            prepend-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center"  v-if="values.names">
        <p class="text-center">
          {{values.names.join(' | ')}}
        </p>
      </v-row>
      <v-row justify="center">
        <v-btn icon text small @click="clear(values.names)">
          <v-icon color="error" class="mr-1">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-list
            outlined
            subheader
            one-line
            
            :style="
              `height:${$vuetify.breakpoint.height *
                0.8 *
                0.4}px;overflow:auto;`
            "
          >
            <v-list-item-group
              color="royal"
              multiple
            >
              <v-list-item v-for="(name, index) in filtered_items" :key="index">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="isActive(name)" @click="additem(active, name)"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content @click="additem(active, name)">
                    <v-list-item-title>{{ name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable */
import { Datetime } from "vue-datetime";
import Api from "@/api/api/index";
export default {
  name: "UserFilter",
  data: () => ({
    items: [],
    search: ""
  }),
  watch: {
  },
  components: {
    datetime: Datetime
  },
  props: {
    values: {
      default: {names:[]}
    }
  },
  computed: {
    filtered_items() {
      if (!this.items) {
        return [];
      }
      return this.items.filter(el => {
        return !!el.match(`${this.search}`);
      });
    }
  },
  created() {
    Api.post("/user/fetch/user_names", {})
      .then(res => {
        this.items = res.data.result.names;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods:{
    additem(active, name){
      console.log(name)
      if(!this.isActive(name)){
        this.$set(this.values.names,this.values.names.length, name)
      }else if( this.isActive(name)){
        this.values.names.splice(this.values.names.indexOf(name),1)
      }
      console.log(this.values.names)
    },
    clear(arr){
      arr.splice(0)     
    },
    isActive(name){
      if(!this.values.names){
        this.$set(this.values,'names', [])
      }
      return this.values.names?.indexOf(name)!=-1
    }
  }
};
</script>

<style></style>
