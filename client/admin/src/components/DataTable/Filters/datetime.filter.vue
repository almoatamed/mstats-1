<template>
  <!-- eslint-disable -->
  <v-card flat>
    <v-card-text class="pa-8">

      <v-row>
        <h2>
          Filter By Date and Time
        </h2>
        <p>
          to filter by date and time you can pick a start date and time, which
          will fetch the results starting from this point. or you can pick an
          end date and time which will fetch results till this point. or you can
          set the two values and the filter will try to fitch the results beween
          the two point of time.
        </p>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-container>
            <v-row>
              Start Date And Time
            </v-row>
            <v-row>
              <div>
                <v-icon color="royal" class="mr-1">
                  mdi-calendar-clock
                </v-icon>
              </div>
              <div>
                <datetime
                  persistant
                  :style="
                    `background-color:${
                        $vuetify.theme.dark? $vuetify.theme.themes.light.greyl1:$vuetify.theme.themes.light.greyl3
                      };border: 1px solid ${$vuetify.theme.themes.light.royal};border-left: 5px solid ${$vuetify.theme.themes.light.royal}`
                  "
                  type="datetime"
                  v-model="values.start"
                ></datetime>
              </div>
              <div>
                <v-btn icon text x-small @click="values.start = ''">
                  <v-icon size="20" color="error" class="mr-1">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" md="6">
          <v-container>
            <v-row>
              End Date And Time
            </v-row>
            <v-row>
              <div>
                <v-icon color="royal" class="mr-1">
                  mdi-calendar-clock
                </v-icon>
              </div>
              <div>
                <datetime
                  persistant
                  :style="
                    `background-color:${
                        $vuetify.theme.dark? $vuetify.theme.themes.light.greyl1:$vuetify.theme.themes.light.greyl3
                      };border: 1px solid ${$vuetify.theme.themes.light.royal};border-left: 5px solid ${$vuetify.theme.themes.light.royal}`
                  "
                  type="datetime"
                  v-model="values.end"
                ></datetime>
              </div>
              <div>
                <v-btn icon text x-small @click="values.end = ''">
                  <v-icon size="20" color="error" class="mr-1">
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable */
import { Datetime } from 'vue-datetime';
export default {
    name:"DateTimeFilter",
    components: {
        datetime: Datetime
    },
    props:{
        values:{
            default:{}
        }
    },
};
</script>

<style></style>
