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
        >mdi-fingerprint</v-icon>
                  Login
                </div>
              </div>
            </template>

            <v-card-text class="text-center">
              <div class="text-center font-weight-light mb-6">
                Please enter your credientials to login...
              </div>

              <v-text-field
                color="theme"
                placeholder="Username..."
                prepend-icon="mdi-account-outline"
              />

              <v-text-field
                class="mb-8"
                color="theme"
                placeholder="Password..."
                prepend-icon="mdi-lock-outline"
                type="password"
              />

              <v-btn
                color="theme"
                rounded
                text
                large
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
  export default {
    name: 'LoginView',

    data: () => ({
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
  }
</script>
