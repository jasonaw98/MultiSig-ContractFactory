<template>
    <div>
    <v-overlay :value="menu" color="#000" class="menu-overlay"></v-overlay>

      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
        color="#080a29"
      >
        <v-list-item>
          <v-list-item-title>
            <v-img
              src="/../src/assets/bytebank-logo.webp"
              max-width="120"
              class="my-5"
            ></v-img>
          </v-list-item-title>
          <v-btn
            icon
            @click.stop="drawer = !drawer"
            size="32"
            color="primary"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        
        <v-divider color="#757BA5"></v-divider>

        <v-list dense>
          <v-list-item link dark @click="addActiveClass('home','mobile')">
            <v-list-item-content>
              <v-list-item-title class="home" :class="currentRoute == '/home' ? 'secondary--text' : ''">Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link dark @click="addActiveClass('assets','mobile')">
            <v-list-item-content>
              <v-list-item-title class="assets" :class="currentRoute == '/assets' ? 'secondary--text' : ''">Assets</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link dark @click="addActiveClass('transaction','mobile')">
            <v-list-item-content>
              <v-list-item-title class="transaction" :class="currentRoute == '/transaction' ? 'secondary--text' : ''">Transaction</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar height="100px" elevation="none" class="header pb-0 px-sm-12">
        <v-row class="justify-center align-center">
          <v-col cols="6" md="6" class="my-0 row align-center justify-start d-none d-md-flex">
            <v-img
              src="/../src/assets/bytebank-logo.webp"
              max-width="160"
            ></v-img>
            <v-flex class="nav d-none d-md-flex ml-12">
              <div @click="addActiveClass('home')" class="px-3 home white--text" :class="currentRoute == '/home' ? 'active' : ''">Home</div>
              <div @click="addActiveClass('assets')" class="px-3 assets white--text" :class="currentRoute == '/assets' ? 'active' : ''">Assets</div>
              <div @click="addActiveClass('transaction')" class="px-3 transaction white--text" :class="currentRoute == '/transaction' ? 'active' : ''">Transaction</div>
            </v-flex>
          </v-col>
          <v-col cols="12" md="6" class="row align-center justify-end align-center my-0 d-flex">
            <div class="d-block d-md-none text-right pa-0">
              <v-btn
                color="primary"
                dark
                icon
                large
                @click.stop="drawer = !drawer"
              >
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </div>
            <v-spacer></v-spacer>
            <div>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn rounded text dark large v-bind="attrs" v-on="on" class="px-3">
                    <v-row class="ma-0 py-2 align-center">
                        <v-img src="/../src/assets/MetaMaskFox.webp" max-width="38" max-height="38" class="mr-2 d-none d-md-block"></v-img>
                        <p class="mb-0 mr-2">
                          {{ getCurrentAddress('short') }}
                        </p>
                        <v-icon small>mdi-chevron-down</v-icon>
                    </v-row>
                  </v-btn>
                </template>
                <v-card class="">
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-btn dark @click="logout()">Disconnect Wallet</v-btn>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
            <v-divider color="#fff" class="my-2" vertical></v-divider>
            <div class="pl-3 pr-3 pr-md-0">
                <v-chip class="white--text" color="primary">{{ network }}</v-chip>
            </div>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-row class="px-sm-12 mx-0 mb-6 mt-0 info-bar align-center">
        <v-col cols="12" class="row mx-0 align-center">
            <v-col cols="12" md="4" class="px-0">
                <label>Current safe address</label>
                <v-select
                    rounded
                    dense 
                    dark 
                    hide-details 
                    color="#fff" 
                    :items="safe" 
                    v-model="currSafe" 
                    append-icon="mdi-chevron-down"
                    class="safeSelect text-caption"
                    @change="changeSafe()" 
                ></v-select>
            </v-col>
            <v-col cols="2" md="3" class="usd px-0">0.00 USD</v-col>
            <v-col cols="10" md="5" class="px-0">
                <v-row class="ma-0 justify-end">
                    <v-btn fab depressed width="45" height="45" color="rgba(117, 123, 165, 0.2)" class="mx-1"><v-icon color="primary" class="">fa-solid fa-copy</v-icon></v-btn>
                    <v-btn fab depressed width="45" height="45" color="rgba(117, 123, 165, 0.2)" class="mx-1"><v-icon color="primary" class="">fa-solid fa-qrcode</v-icon></v-btn>
                    <v-btn fab depressed width="45" height="45" color="rgba(117, 123, 165, 0.2)" class="mx-1"><v-icon color="primary" class="">fa-solid fa-share-from-square</v-icon></v-btn>
                    <v-btn depressed large rounded radius="25" color="secondary" class="ml-2" @click="$router.push('/new-safe')">New Safe</v-btn>
                </v-row>
            </v-col>
        </v-col>
      </v-row>
    </div>
</template>
<script>

import contract from "../contracts/multiSigContractFactory.json";
import $ from "jquery";

//Contract Factory Address
const factoryAddress = "0x9456DFA4bD503BDD2Ba2170e40EC73D2BB5E0C62";
const abi = contract.abi;

export default {
  data: () => ({
    menu: false,
    network: "",
    currentRoute: "",
    currSafe: "",
    safe: [],
    drawer: null
  }),
  mounted() {
    this.currSafe =  localStorage.getItem('safeAddress');
    this.currentRoute = this.$router.currentRoute.path;
    this.getNetwork();
    this.checkWalletIsConnected();
    this.getSafeContract();
    // this.timer = setInterval(() => {
    //     this.checkWalletIsConnected()
    // }, 1000)
    
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getNetwork() {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          provider.getNetwork().then((network) => {
            localStorage.setItem('network', network.name);
            this.network = network.name;
          });
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
    addActiveClass(event,device = null) {
      if(device == "mobile"){
        $(".v-list-item__title.secondary--text").removeClass("secondary--text");
        $(".v-list-item__title." + event).addClass("secondary--text");
      }else {
        $(".nav .active").removeClass("active");
        $(".nav ." + event).addClass("active");
      }
      this.$router.push('/'+event);
    },
    logout() {
      localStorage.removeItem('safeAddress');
      localStorage.removeItem('currentAddress'); 
      this.$router.go();
    },
    checkWalletIsConnected() {
        ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length === 0) {
                console.log("Wallet disconnected");
                this.logout();
                this.$router.go();
            }
        });
    },
    async getSafeContract() {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(factoryAddress, abi, signer);
          this.safe = await nftContract.getOwnersContract();
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
    changeSafe() {
        localStorage['safeAddress'] = this.currSafe;
        this.$router.go();
    }
  },
};
</script>
<style lang="scss" scoped>
.safeSelect {
  width: fit-content;
}
::v-deep .safeSelect .v-input__slot {
    padding: 0 !important;
    .v-select__selection {
        width: 100%;
        &.v-select__selection--comma {
            overflow: visible;
        }
    }
    input {display: none;}
}
</style>
