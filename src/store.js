import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); 

export default new Vuex.Store({
    state: {
        currentAddress: ""
    },

    getters: {

    },

    mutations: {
        set_curr_account( state , currentAddress) {
            console.log(currentAddress,'currentAddress');
            state.currentAddress = currentAddress;
        }
    },

    actions: {
        setCurrentAccount({ commit }, currentAddress) {
            commit('set_curr_account', currentAddress);
        }
    }
})