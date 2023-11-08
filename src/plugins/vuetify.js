// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

export default new Vuetify({
    
    theme: {
        dark: false,
        themes: {
          light: {
            primary: '#757BA5',
            secondary: '#F94A42',
            accent: '#1D2141'
          }
        }
    }
})