<template>
  <v-container
    id="login-view"
    class="fill-height"
    tag="section"
  >
    <v-row justify="center">
      <v-col cols="12">
        <v-slide-y-transition appear>
          <material-card
            light
            max-width="550"
            rounded
            class="mx-auto"
            color="theme"
            full-header
          >
            <template #heading>
              <div class="text-center pa-5">
                <div class="text-h4 font-weight-bold white--text">
                  <v-icon
                    :left="$vuetify.breakpoint.mdAndUp"
                    size="30"
                  >
                    mdi-fingerprint
                  </v-icon>
                  Login
                </div>
              </div>
            </template>

            <v-card-text class="text-center">
              <div class="text-center font-weight-light mb-6">
                Please enter your credientials to login...
              </div>

              <v-text-field
                v-model="user.username"
                color="theme"
                placeholder="Username..."
                prepend-icon="mdi-account-outline"
              />

              <v-text-field
                v-model="user.password"
                class="mb-8"
                color="theme"
                placeholder="Password..."
                prepend-icon="mdi-lock-outline"
                type="password"
              />

              <v-btn
                color="theme"
                rounded
                :disabled="loading"
                :loading="loading"
                text
                large
                @click="login"
              >
                Login
              </v-btn>
            </v-card-text>
          </material-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

  /* eslint-disable */
  import { sync } from 'vuex-pathify'
  export default {
    name: 'LoginView',

    data: () => ({
      loading:false,
      user:{
        password:'', 
        username:'', 
      },
      socials: [
        {
          href: '#',
          icon: 'mdi-facebook',
        },
        {
          href: '#',
          icon: 'mdi-twitter',
        },
        {
          href: '#',
          icon: 'mdi-github', 
        },
      ],
    }), 

    created(){
      console.log('hi from login')
      this.loading_cover = true
      this.$store.dispatch('user/verify', null, {root:true}).then((res)=>{
        this.loading_cover = false 
        if(this.$route.query['redirect']){
            this.$router.push(this.$route.query.redirect).then(()=>{}).catch(err=>{console.log(err)})
        }else{
            this.$router.push('/dashboard').then(()=>{}).catch(err=>{console.log(err)})
        }
      }).catch((err)=>{
        this.loading_cover = false
      })
    },
    computed: {
      ...sync('user', {loading_cover: 'visualization@loading_cover',},),
    },
    methods: {
      login(){
          this.loading = true
          var self = this
          this.$store.dispatch('user/login',this.user,{root:true}).then((res)=>{
              self.loading = false
              if(this.$route.query['redirect']){
                  this.$router.push(this.$route.query.redirect).then(()=>{}).catch(err=>{console.log(err)})
              }else{
                  this.$router.push('/dashboard').then(()=>{}).catch(err=>{console.log(err)})
              }
          }).catch((err)=>{
              self.loading = false
              console.log('love',err.message)
              let notification = {
                msg: err.response?.data?.error?.msg || "Error, please try again later",
                color: "error"
              }
              self.$store.dispatch('user/notify',notification)
          })
      }
    }
  }
</script>
