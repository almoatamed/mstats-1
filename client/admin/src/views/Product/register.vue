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
          icon="mdi-hospital"
        >
          <template #title>
            Add Product — <small class="text-body-1">Complete required fields</small>
          </template>
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <v-form>
              <v-container class="py-0">
                <v-row>
                  <!-- name -->
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
                      name="Manufacturer"
                      rules="required"
                    >
                      <v-combobox
                        v-model="manufacturer"
                        :error-messages="errors"
                        :items="manufacturer_list"
                        label="Manufacturer"
                        required
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
                      name="URL"
                      :rules="{
                        required: false,
                        regex: regex.url,
                      }"
                    >
                      <v-text-field
                        v-model="url"
                        :error-messages="errors"
                        label="URL"
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>


                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Description"
                    >
                      <v-text-field
                        v-model="description"
                        :error-messages="errors"
                        label="Description"
                        color="theme"
                      />
                    </validation-provider>
                  </v-col>


                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Product Image input"
                      rules="file:image/jpg,image/jpeg"
                    >
                      <v-file-input
                        label="Product Image input"
                        :error-messages="errors"
                        v-model="image"
                        prepend-icon="mdi-camera"
                      ></v-file-input>
                    </validation-provider>
                  </v-col>
                  <v-col 
                  cols="12"
                  ><v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-img
                        v-if="imagesrc"
                        max-height="248"
                        max-width="297"
                        :src="imagesrc"
                      ></v-img>
                      <v-spacer></v-spacer>
                    </v-row>
                  </v-container>
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
  import FormData from 'form-data'
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
    watch:{
      image(val){
        if(!val){
          this.imagesrc = null
        }
      }
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
        image:null,
        imagesrc:null,
        url: '',
        description: '',
        manufacturer_list: [],
        manufacturer: '',
      }
    },
    created(){
    const self = this


    extend('file', {
      validate: (val,types)=>{
        console.log(types)
        self.imagesrc = null
        if(!types.some(type => type == val.type)){
          return `${val.type || '{_field_}'} is not valid type`
        }
        if(val.size > (1024*1024)){
          return "{_field_} has to be smaller than 1Mb"
        }

        const reader = new FileReader()
        reader.onload= ev=>{
          self.imagesrc = ev.target.result
        }
        reader.readAsDataURL(val)
        return true
      },
      message: '{_field_} Is not valid file',
    })

    Api.post("manufacturer/fetch/names")
      .then(response => {
        console.log(response.data.result?.names)
        for (const manufacturer of response.data.result?.names || []) {this.manufacturer_list.push(manufacturer);}
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
        let data = new FormData();
        data.append('product_image_file', this.image);
        data.append('name', this.name)
        data.append('link', this.url)
        data.append('description', this.description)
        data.append('manufacturer',this.manufacturer)
        Api.post('product/register',data,{
          headers:{
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          }
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
