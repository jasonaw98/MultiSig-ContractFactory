<template>
  <div>
    <v-row class="align-center ma-0 px-sm-12 mt-3">
      <!-- <v-col cols="6" class="">
        <v-btn large color="secondary" class="rounded-xl px-12">Token</v-btn>
      </v-col>
      <v-col cols="6" class="d-flex align-center justify-end">
        <v-checkbox 
          class="white--text mt-0 pt-0 mr-3"
          label="Hide Token"
          dark
          color="success"
          v-model="showToken"
          hide-details
        ></v-checkbox>
        <v-select
          :items="currencyItem"
          v-model="currency"
          solo
          hide-details
          background-color="primary"
          rounded
          flat
          class="select-drop"
        ></v-select>
      </v-col> -->
      <!-- <v-col cols="12" v-if="showToken">
        <v-row class="align-center dark-bg boder-radius-24 px-3 mx-0">
          <v-col cols="6">0 tokens selected</v-col>
          <v-col cols="6" class="text-right">
            <v-btn dark depressed rounded color="rgba(117, 123, 165, 0.2)" class="">Deselect All</v-btn>
            <v-btn dark depressed rounded color="secondary" class="ml-3">Save</v-btn>
          </v-col>
        </v-row>
      </v-col> -->
      <v-col cols="12" class="my-5">
        <v-row class="align-center dark-bg boder-radius-24 px-5 py-5 mx-0">
          <v-col cols="12" class="pa-0">
            <v-row class="align-center ma-0 primary--text text-subtitle-1">
              <v-col cols="6" class="py-0 ">Asset</v-col>
              <v-col cols="3" class="py-0">Balance</v-col>
              <v-col cols="3" class="py-0">Value</v-col>
            </v-row>
            <v-row class="align-center dark-bg boder-radius-24 px-3 my-3 mx-0 white--text" v-for="(item,index) in assets" :key="index">
              <v-col cols="6">{{item.name}}</v-col>
              <v-col cols="3">{{item.balance}} {{item.shortform}}</v-col>
              <v-col cols="3">0.00 USD</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import contract from '../contracts/MultiSigWallet.json';
import { ethers } from 'ethers';

//Contract Factory Address
const contractAddress = localStorage.getItem('safeAddress');
const abi = contract.abi;

export default {
  components: { 
        
  },
  data() {
    return {
      welcomeDialog: false,
      network: localStorage.getItem('network'),
      showToken: true,
      currencyItem: ['USD','MYR','SGD'],
      currency: "USD",
      assets: []
    };
  },
  mounted() {
    this.welcomeDialog = this.$route.query.showWelcomeModal;
    this.viewEthers();
  },
  methods: {
    logout() {
      localStorage.removeItem('safeAddress');
      localStorage.removeItem('currentAddress');
    },
    getContractContent() {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, abi, signer);
        
          let safe = nftContract.getContractContent();
       

          console.log("Retrieving Contract: ", nftTxn);
          console.log("Retrieving safe address: ", safe);

        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async viewEthers() {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, abi, signer);
        
          let balance = await nftContract.getContractBalance();

          const balanceInEth = ethers.utils.formatEther(balance);

          const arr = {name:'Ethereum', balance: balanceInEth, shortform: 'ETH'};

          this.assets.push(arr);
          console.log(this.assets,'this.assets');
          console.log(`Balance: ${balanceInEth} ETH`);
          console.log(`Balance: ${balance} ETH`);

        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
</script>
<style lang="scss" scoped></style>
