<template>
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
          icon="mdi-hospital"
        >
          <template #title>
            Add Pharmacy — <small class="text-body-1">Complete required fields</small>
          </template>
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <v-form>
              <v-container class="py-0">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Name"
                      rules="required"
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

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Hospitals"
                    >
                      <v-combobox
                        v-model="hospitals"
                        :error-messages="errors"
                        :items="hospital_list"
                        label="Hospital"
                        multiple
                        chips
                        clearable
                      />
                    </validation-provider>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Phone Number"
                      :rules="{
                        required: false,
                        regex: regex.phoneNumber,
                      }"
                    >
                      <v-text-field
                        v-model="phoneNumber"
                        :error-messages="errors"
                        label="Phone Number"
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

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
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Address"
                    >
                      <v-text-field
                        v-model="address"
                        :error-messages="errors"
                        label="Address"
                        color="theme"
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
        hospital_list: [],
        hospitals: [],
      }
    },
    created(){
    const self = this
    Api.post("hospital/fetch/names")
      .then(response => {
        console.log(response.data.result?.names)
        for (const hospital of response.data.result?.names || []) {this.hospital_list.push(hospital);}
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
        Api.post('pharmacy/register',{
          name: this.name,
          address: this.address,
          phone: this.phoneNumber,
          email: this.emailAddress,
          hospitals:this.hospitals
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
