import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
// import ethers from '@/plugins/ethers'
import store from './store'
import App from './App.vue'
import router from './router'
import { ethers } from "ethers";
import Web3 from 'web3';
import axios from 'axios';

import './assets/main.scss'

Vue.use(ethers);
Vue.use(axios);

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access
    console.error('User denied account access');
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  window.web3 = new Web3(web3.currentProvider);
}
// Non-dapp browsers...
else {
  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}


Vue.mixin({
  methods: {
      shortenAddress(currentAddress, type = 'short') {
          if (currentAddress && type == 'short') {
            const leftChars = currentAddress.slice(0, 5);
            const rightChars = currentAddress.slice(-5);
            return `${leftChars}......${rightChars}`;
          } else if (currentAddress && type == 'medium') {
            const leftChars = currentAddress.slice(0, 10);
            const rightChars = currentAddress.slice(-10);
            return `${leftChars}......${rightChars}`;
          } else {
            return currentAddress;
          }
      },
      getCurrentAddress(type = 'short') {
          const currentAddress = localStorage.getItem("currentAddress");
          if (currentAddress && type == 'short') {
            const leftChars = currentAddress.slice(0, 5);
            const rightChars = currentAddress.slice(-5);
            return `${leftChars}......${rightChars}`;
          } else if (currentAddress && type == 'medium') {
            const leftChars = currentAddress.slice(0, 15);
            const rightChars = currentAddress.slice(-5);
            return `${leftChars}......${rightChars}`;
          } else {
            return currentAddress;
          }
      },
      getSafeAddress(type = 'short') {
          const currentAddress = localStorage.getItem("safeAddress");
          if (currentAddress && type == 'short') {
            const leftChars = currentAddress.slice(0, 5);
            const rightChars = currentAddress.slice(-5);
            return `${leftChars}......${rightChars}`;
          } else if (currentAddress && type == 'medium') {
            const leftChars = currentAddress.slice(0, 15);
            const rightChars = currentAddress.slice(-5);
            return `${leftChars}......${rightChars}`;
          } else {
            return currentAddress;
          }
      },
      convertTimestamp(time) {
        const date = new Date(time * 1000); 
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});
      }
  },
})

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App)
}).$mount('#app')
