<template>
  <div>
    <v-row class="align-top ma-0 px-sm-12 mt-3">
      <v-col cols="12" md="6" class="">
          <v-card color="rgba(117, 123, 165, 0.2)" class="rounded-xl" >
            <v-card-text class="white--text  pa-5 pa-md-8">
              <v-form
                ref="transferForm"
                lazy-validation
              >
                <h2 class="mb-4">Transfer Token</h2>
                <label>From Safe address:</label>
                <div class="wallet-text">{{ getSafeAddress('long') }}</div>
                <v-row class="mt-6 mb-0">
                  <v-col cols="12" class="py-0">
                    <v-text-field v-model="transfer.to" :rules="addressRules" required outlined label="To address" color="primary" rounded light></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-select
                      :items="tokenList"
                      item-text="label"
                      item-value="token"
                      v-model="transfer.token"
                      append-icon="mdi-chevron-down"
                      :rules="[v => !!v || 'Token is required']"
                      required
                      label="Token"
                      color="primary"
                      outlined
                      rounded
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field v-model.number="transfer.amount" type="number" :rules="[v => !!v || 'Amount is required']" required hide-spin-buttons outlined label="Amount" color="primary" rounded light></v-text-field>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-btn rounded depressed block height="56" color="secondary" @click="trasnfer()" :loading="trasnferBtnLoading">Transfer</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
      </v-col>
      <v-col cols="12" md="6" class="">
        <v-card color="rgba(117, 123, 165, 0.2)" class="rounded-xl" height="100%">
          <v-card-text class="white--text pa-5 pa-md-8">
            <Queue ref="queue" :tokenList="tokenList" @showSnackbar="showSnackbar"></Queue>
            <!-- <h2 class="mb-4">Transaction queue ({{ queueCount }})</h2>
            <div class="text-center primary--text pa-12" v-if="queueCount == []">
              No data available
            </div>
            <div v-else>
              <v-expansion-panels v-model="panel" dark class="boder-radius-24">
                  <v-expansion-panel class="transparent-bg boder-radius-24 mb-3" v-for="(item,i) in queue" :key="i">
                    <v-expansion-panel-header class="dark-bg boder-radius-24">
                      <v-row class="align-center">
                        
                        <v-col cols="12" md="6" class="">
                          <label>Trasnfer to: <div class="mt-1">{{ shortenAddress(item[1],"medium") }}</div></label>
                        </v-col>
                        <v-col cols="6" md="3" class="">
                          <div class="wallet-text">{{ convertTimestamp(item[6]) }}</div>
                        </v-col>
                        <v-col cols="6" md="3" class="text-right pr-6">
                          <v-chip color="warning" class="elevation-0">Pending</v-chip> 
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row class="ma-0 py-5 justify-space-between align-center">
                        <div class="">
                          <label>Amount:</label> <span class="ml-1">{{ (item[2] / 1000000000000000000).toFixed(2) }}</span>
                        </div>
                        <div>
                          <label>Token:</label> <span class="ml-1">{{ getTokenLabel(item[5]) }}</span>
                        </div>
                        <div class="">
                          Confirmation: {{ parseInt(item["4"]) }}/{{ totalToConfirm }}
                        </div>
                      </v-row>
                      <v-row class="ma-0 dark-bg boder-radius-24 mx-n6 px-6 py-3">
                        <v-col cols="12" class="pa-0 d-flex align-center justify-end">
                          <v-btn color="secondary" rounded large class="elevation-0" :disabled="item['isConfirmed']" @click="confirmTrans(parseInt(item[0]))">
                            <span v-if="item['isConfirmed']">Confirmed</span>
                            <span v-else>Confirm</span>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
              </v-expansion-panels>
  
              <v-pagination
                v-model="page"
                :length="Math.ceil(queueCount/5)"
                @next="transactionQueue()"
                @previous="transactionQueue()"
                @input="transactionQueue()"
                total-visible="5"
                circle
              ></v-pagination>
            </div> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="welcomeDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5">
          Welcome!
        </v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="welcomeDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Queue from '../components/queue.vue';
import contract from '../contracts/MultiSigWallet.json';
import { ethers } from 'ethers';

//Contract Factory Address
const contractAddress = localStorage.getItem('safeAddress');
const abi = contract.abi;

export default {
  components: { 
    Queue
  },
  data() {
    return {
      welcomeDialog: false,
      network: localStorage.getItem('network'),
      tokenList: [
        {label:"Ethereum",token: "0x0000000000000000000000000000000000000000"}
      ],
      transfer: {to:"",token:null,amount:null},
      addressRules: [
        (v) => !!v || "Wallet address is required",
        (v) =>
          v.length >= 10 || "Wallet address must be more than 10 characters",
      ],
      trasnferBtnLoading: false,
      snackbar: true,
      queueCount: 0,
      totalToConfirm: 0,
      page: 1,
      panel: null,
    };
  },
  mounted() {
    this.welcomeDialog = this.$route.query.showWelcomeModal;
  },
  methods: {
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
          console.log(`Balance: ${balanceInEth} ETH`);

        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },

    async trasnfer() {
      const valid = this.$refs.transferForm.validate();
      if (valid) {
        this.trasnferBtnLoading = true;
        try {
          const { ethereum } = window;

          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(contractAddress, abi, signer);
            const amount = ethers.utils.parseEther(String(this.transfer.amount));
            let tx = await nftContract.submitTransaction(this.transfer.to, amount, this.transfer.token);
            
            await this.$refs.queue.transactionQueue("transfer");
            this.trasnferBtnLoading = false;
            this.$emit('showSnackbar', {text:"Successful Transferred", color:"success"})
          } else {
            console.log("Ethereum object does not exist");
            this.trasnferBtnLoading = false;
          }
        } catch (err) {
          console.log(err);
          this.$emit('showSnackbar', {text: "Fail to transfer", color:"error"})
          this.trasnferBtnLoading = false;
        }
      }
    },

    getTokenLabel(token) {
      const tokenObj = this.tokenList.find(obj => obj.token === token);
      return tokenObj ? tokenObj.label : null;
    },
    showSnackbar(data) {
      this.$emit('showSnackbar', {text:data.text, color:data.color})
    }
  }

};
</script>
<style lang="scss" scoped>
::v-deep .v-expansion-panel:not(:first-child):after {
  content: none !important;
}
</style>
