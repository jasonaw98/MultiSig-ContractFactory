<template>
  <div class="landing-page-bg d-flex align-items-center h-100vh">
    <v-row class="ma-0 px-3 px-md-16 justify-center align-center wrapper">
      <v-col cols="12" xl="9" class="row pa-0 justify-center align-center">
        <v-flex class="text-left px-5">
          <v-img
            src="/../src/assets/bytebank-logo.webp"
            width="220"
            class="mb-5"
          ></v-img>
          <h1 class="mb-4 welcome-text">Welcome to ByteBank Safe</h1>
          <label
            >Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor.</label
          >
        </v-flex>
        <v-flex class="px-5">
          <v-stepper
            width="auto"
            class="landing-card mx-auto my-6 pa-0"
            v-model="e6"
            vertical
          >
            <v-stepper-step :complete="e6 > 1" step="1">
              Connect to your wallet
            </v-stepper-step>
            <v-stepper-content step="1">
              <div>
                <v-btn
                  class="connect-wallet-btn"
                  @click="connectWalletButton()"
                >
                  <v-row class="ma-0 py-2 align-center">
                    <v-flex class="pl-1">
                      <v-avatar class="avatar" v-if="!createSafe">
                        <v-icon size="large" color="">fas fa-user</v-icon>
                      </v-avatar>
                      <v-img v-else src="/../src/assets/MetaMaskFox.webp" max-width="38" max-height="38" class="ml-auto"></v-img>
                    </v-flex>
                    <v-flex class="text-start pl-2 pr-7">
                      <p class="mb-0">
                        {{ createSafe ? truncatedAccount() : "Connect Wallet" }}
                      </p>
                    </v-flex>
                  </v-row>
                </v-btn>
                <div class="d-block mt-5" v-if="safe.length > 0">
                  <v-divider dark></v-divider>
                  <label class="white--text my-3 d-block"
                    >Choose safe contract</label
                  >
                  <div class="choose-safe-contract">
                    <v-chip
                      v-for="(item, index) in safe"
                      :key="index"
                      class="d-block dark-bg white--text mb-3 button safe-chip"
                      @click="selectSafe(item)"
                    >{{ item }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-stepper-content>

            <v-stepper-step :complete="e6 > 2" step="2">
              Create your safe now!
            </v-stepper-step>

            <v-stepper-content step="2" class="pb-6 mb-0">
              <div class="">
                <v-btn
                  class="create-safe-btn"
                  :disabled="!createSafe"
                  @click="$router.push('/create-safe')"
                >
                  <v-row class="ma-0 py-2 align-center justify-center">
                    <v-icon size="small" color="">fas fa-plus</v-icon>
                    <p class="mb-0 pl-1">Create New Safe</p>
                  </v-row>
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper>
        </v-flex>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import contract from "../contracts/multiSigContractFactory.json";
import { ethers } from "ethers";

//Contract Factory Address
const factoryAddress = "0x9456DFA4bD503BDD2Ba2170e40EC73D2BB5E0C62";
const abi = contract.abi;

export default {
  data() {
    return {
      createSafe: false,
      e6: 1,
      currentAddress: null,
      safe: [],
    };
  },
  mounted() {
  },
  methods: {
    async checkWalletIsConnected() {
      this.validateMetamask();
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        this.validateWalletConnection(accounts);
        this.getSafeContract();
      } catch (err) {
        console.log(err);
      }
    },
    async connectWalletButton() {
      this.validateMetamask();
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        this.validateWalletConnection(accounts);
        this.getSafeContract();
      } catch (err) {
        console.log(err);
      }
    },
    truncatedAccount() {
      if (this.currentAddress && this.currentAddress.length > 20) {
        const leftChars = this.currentAddress.slice(0, 5);
        const rightChars = this.currentAddress.slice(-5);
        return `${leftChars}.....${rightChars}`;
      } else {
        return this.currentAddress;
      }
    },
    validateMetamask() {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure Metamask is installed");
        return;
      } else {
        console.log("Metamask installed!");
      }
    },
    validateWalletConnection(accounts) {
      if (accounts.length !== 0) {
        this.currentAddress = accounts[0];
        console.log("Found an authorized account: ", this.currentAddress);
        // this.$store.dispatch("setCurrentAccount", this.currentAddress);
        localStorage.setItem("currentAddress", this.currentAddress);
        this.createSafe = true;
      } else {
        console.log("No authorized account found");
      }
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
    selectSafe(address) {
      localStorage.setItem('safeAddress', address);
      this.$router.go();
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .safe-chip {
    width: fit-content !important;
    height: fit-content !important;
    white-space: normal !important;

    .v-chip__content {
        word-break: break-all !important;
        width: auto !important;
        padding: 5px;
    }
}
</style>
