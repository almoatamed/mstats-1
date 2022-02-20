// Vuetify Documentation https://vuetifyjs.com

import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import ripple from 'vuetify/lib/directives/ripple'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify, { directives: { ripple } })

const theme = {
  primary: '#E91E63',
  royal: '#064c86',
  secondary: '#9C27b0',
  accent: '#e91e63',
  info: '#00CAE3',
  success: '#4CAF50',
  warning: '#FB8C00',
  error: '#FF5252',
  theme: '#064C86',
  greyl1: colors.grey.lighten1,
  greyl2: colors.grey.lighten2,
  greyl3: colors.grey.lighten3,
  greyl4: colors.grey.lighten4,
  grey: colors.grey.base,
  greyd1: colors.grey.darken1,
  greyd2: colors.grey.darken2,
  greyd3: colors.grey.darken3,
  greyd4: colors.grey.darken4,
}

export default new Vuetify({
  breakpoint: { mobileBreakpoint: 960 },
  icons: {
    values: { expand: 'mdi-menu-down' },
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})
