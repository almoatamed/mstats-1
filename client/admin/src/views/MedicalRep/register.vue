<template>
  <!-- eslint-disable -->
  <v-container
    id="user-profile-view"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <material-card
          color="primary"
          icon="mdi-sale"
        >
          <template #title>
            Add Medical Rep — <small class="text-body-1">Complete required fields</small>
          </template>
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <v-form>
              <v-container class="py-0">
                <v-row>

                  <!--Name  -->
                  <v-col
                    cols="12"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Name"
                      :rules="{
                        required: true,
                        regex: regex.name
                      }"
                    >
                      <v-text-field
                        v-model="name"
                        :error-messages="errors"
                        label="Name"
                        required
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

                  <!-- phone -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Phone Number"
                      :rules="{
                        required: false,
                        digits: 10,
                        regex: regex.phoneNumber,
                      }"
                    >
                      <v-text-field
                        v-model="phoneNumber"
                        :counter="10"
                        :error-messages="errors"
                        label="Phone Number"
                        required
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

                  <!-- email -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Email Address"
                      :rules="{
                        required: false,
                        regex: regex.email,
                      }"
                    >
                      <v-text-field
                        v-model="emailAddress"
                        :error-messages="errors"
                        label="Email Address"
                        required
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

                  <!-- Address -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Address"
                    >
                      <v-text-field
                        v-model="address"
                        :error-messages="errors"
                        label="AddressAddress"
                        required
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

                  <!-- manufacturers -->
                  <v-col cols="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Manufacturers"
                      rules="required"
                    >
                      <v-combobox
                        v-model="manufacturers"
                        :error-messages="errors"
                        :items="manufacturers_list"
                        label="Manufacturers"
                        multiple
                        chips
                        clearable
                      />
                    </validation-provider>
                  </v-col>

                  <v-col
                    cols="12"
                    class="text-right"
                  >
                    <v-btn
                      color="primary"
                      min-width="150"
                      :loading="loading"
                      :disabled="invalid || loading"
                      @click="submit"
                    >
                      Submit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  /* eslint-disable */
  import { required, digits, regex } from 'vee-validate/dist/rules'
  import {
    extend,
    ValidationObserver,
    ValidationProvider,
    setInteractionMode,
  } from 'vee-validate'
  import Api from "../../api/api/index"

  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} is not correct',
  })

  export default {
    name: 'PharmacyRegistrationView',

    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data () {
      return {
        regex: {
          url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
          phoneNumber: /^((\+|00)\s?\d{1,3}\s?)?(\(?\d{2,3}\)?)(\-|\s)?(\d{3}(\-|\s)?\d{4})$/,
          name: /^(?:[a-zA-Z]{3,20})(?:\s{1,2}[a-zA-Z]{1,20}){1,3}$/,
          email: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
        },
        loading: false,
        name: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        manufacturers: [],
        manufacturers_list: [],
      }
    },
    created(){
    const self = this
    Api.post("manufacturer/fetch/names")
      .then(response => {
        console.log(response.data.result?.names)
        for (const product of response.data.result?.names || []) {this.manufacturers_list.push(product);}
      })
      .catch(err => {
        console.log(err)
        let notification = {
          msg:
            err.response?.data?.error?.msg || "Error, please try again later",
          color: "error"
        };
        self.$store.dispatch("user/notify", notification);
      });
    },
    methods:{
      submit() {
        var self = this;
        Api.post('medrep/register',{
          name: this.name,
          address: this.address,
          phone: this.phoneNumber,
          email: this.emailAddress,
          manufacturers:this.manufacturers
        }).then(res=>{
          let notification = {
            msg:
              "Pharmacy created",
            color: "success"
          };
          self.$store.dispatch("user/notify", notification);
        }).catch(err=>{
          let notification = {
            msg:
              err.response?.data?.error?.msg || "Error, please try again later",
            color: "error"
          };
          self.$store.dispatch("user/notify", notification);
        })
      }
    }
  }
</script>