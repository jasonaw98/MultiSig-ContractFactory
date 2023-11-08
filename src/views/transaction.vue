<template>
  <div>
    <v-row class="align-center ma-0 px-sm-12 mt-3">
      <v-col cols="6" class="">
        <v-tabs v-model="tab">
          <v-tab class="white--text">Queue</v-tab>
          <v-tab class="white--text">History</v-tab>
          <v-tab class="white--text">Contract</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="6" class="d-flex align-center justify-end">
        
      </v-col>
      <v-col cols="12" class="my-5">
        <v-row class="align-center dark-bg boder-radius-24 pa-5 mx-0">
          <v-col cols="12" class="pa-0">
            <v-tabs-items v-model="tab" class="transparent-bg">
              <v-tab-item>
                <p class="mb-2">Queue</p>
                <p class="text-center white--text" v-if="queue.length == 0">No data available</p>
                <div v-else>
                  <v-expansion-panels v-model="queuePanel" dark class="boder-radius-24">
                      <v-expansion-panel class="transparent-bg boder-radius-24 mb-3" v-for="(item,i) in queue" :key="i">
                        <v-expansion-panel-header class="dark-bg boder-radius-24">
                          <v-row class="align-center mx-0">
                            
                            <v-col cols="6" md="9" class="px-0">
                              <label>Trasnfer to:</label>
                              <div class="mt-1 d-none d-md-block">{{ item[1] }}</div>
                              <div class="mt-1 d-block d-md-none">{{ shortenAddress(item[1],"short") }}</div>
                            </v-col>
                            <v-col cols="6" md="3" class="text-right">
                              <div class="wallet-text">{{ convertTimestamp(item[6]) }}</div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row class="ma-0 py-5 justify-space-between align-center">
                            <div class="">
                              <label>Amount:</label> <span class="ml-1">{{ (item[2] / 1e18).toFixed(2) }}</span>
                            </div>
                            <div>
                              <label>Token:</label> <span class="ml-1">{{ getTokenLabel(item[5]) }}</span>
                            </div>
                            <div class="">
                              <v-chip color="warning" class="elevation-0">Pending</v-chip>
                            </div>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                  </v-expansion-panels>
  
                  <v-pagination
                    v-model="queuePage"
                    :length="Math.ceil(queueCount/5)"
                    @next="transactionQueue()"
                    @previous="transactionQueue()"
                    @input="transactionQueue()"
                    total-visible="5"
                    circle
                  ></v-pagination>
                </div>
              </v-tab-item>

              <v-tab-item>
                <p class="mb-2">History</p>
                <p class="text-center white--text" v-if="history.length == 0">No data available</p>
                <div v-else>
                  <v-expansion-panels v-model="historyPanel" dark class="boder-radius-24 justify-start">
                    <v-expansion-panel class="transparent-bg boder-radius-24 mb-3" v-for="(item,i) in history" :key="i">
                      <v-expansion-panel-header class="dark-bg boder-radius-24">
                        <v-row class="align-center mx-0">
                          
                          <v-col cols="6" md="9" class="px-0">
                            <label>Trasnfer to:</label>
                            <div class="mt-1 d-none d-md-block">{{ item[1] }}</div>
                            <div class="mt-1 d-block d-md-none">{{ shortenAddress(item[1],"short") }}</div>
                          </v-col>
                          <v-col cols="6" md="3" class="text-right">
                            <div class="wallet-text">{{ convertTimestamp(item[6]) }}</div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row class="ma-0 py-5 justify-space-between align-center">
                          <div class="">
                            <label>Amount:</label> <span class="ml-1">{{ (item[2] / 1e18).toFixed(2) }}</span>
                          </div>
                          <div>
                            <label>Token:</label> <span class="ml-1">{{ getTokenLabel(item[5]) }}</span>
                          </div>
                          <div class="">
                            <v-chip color="success" class="elevation-0">Success</v-chip>
                          </div>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
  
                  <v-pagination
                    v-model="historyPage"
                    :length="Math.ceil(historyCount/5)"
                    @next="transactionHistory()"
                    @previous="transactionHistory()"
                    @input="transactionHistory()"
                    total-visible="5"
                    circle
                  ></v-pagination>
                </div>
              </v-tab-item>

              <v-tab-item>
                <p class="mb-2">Contract</p>
                <v-expansion-panels dark class="boder-radius-24 justify-start">
                  <v-expansion-panel class="transparent-bg boder-radius-24 mb-3">
                    <v-expansion-panel-header class="dark-bg boder-radius-24">
                      <v-row class="align-center">
                        
                        <v-col cols="12" md="3" class="d-flex align-center">
                          <v-chip color="success" class="elevation-0">Success</v-chip>
                          <span class="ml-3">Safe created</span>
                        </v-col>
                        <v-col cols="6" md="6">
                          Safe created by {{shortenAddress(safe.created_by,'short')}}
                        </v-col>
                        <v-col cols="6" md="3" class="text-right pr-6">
                          {{ safe.dateString }}
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row class="ma-0 py-5 overflow-x-auto">
                        <label>Owners:</label>
                        <v-col cols="12" class="pa-0 mt-2" v-for="(owners,i) in safe.owners" :key="i">
                          <div class="wallet-text">{{ owners }}</div>
                        </v-col>
                      </v-row>
                      <v-row class="ma-0 dark-bg boder-radius-24 mx-n6 px-6 py-3">
                        <v-col cols="12" class="pa-0 d-flex align-center justify-end">
                          <label class="primary--text font-weight-bold text-subtitle-1">Total Owners:</label>
                          <div class="ml-3 font-weight-bold text-subtitle-1">{{safe.total_owner}}</div>
                          <label class="primary--text font-weight-bold text-subtitle-1 ml-6">Threshold:</label>
                          <div class="ml-3 font-weight-bold text-subtitle-1">{{safe.threshold}}</div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import contractFactory from "../contracts/multiSigContractFactory.json";
import contractWallet from '../contracts/MultiSigWallet.json';

const factoryAddress = "0x9456DFA4bD503BDD2Ba2170e40EC73D2BB5E0C62";
const contractAddress = localStorage.getItem('safeAddress');
const fac_abi = contractFactory.abi;
const wal_abi = contractWallet.abi;
export default {
  components: { 
  },
  data() {
    return {
      tab: 0,
      safe: {
        created_by: "",
        dateString: "",
        owners: [],
        total_owner: 0,
        threshold: 0
      },
      queue: [],
      history: [],
      queueCount: 0,
      historyCount: 0,
      queuePage: 1,
      queuePanel: null,
      historyPage: 1,
      historyPanel: null,
      tokenList: [
        {label:"Ethereum",token: "0x0000000000000000000000000000000000000000"}
      ],
    };
  },
  mounted() {
    this.getContractContent();
    this.transactionQueue();
    this.transactionHistory();
  },
  methods: {
    async getContractContent() {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(factoryAddress, fac_abi, signer);
        
          let contract = await nftContract.getContractContents(localStorage['safeAddress']);
          console.log(contract,'contract');
          const date = new Date(contract[1] * 1000); 
          this.safe.dateString = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});
          this.safe.created_by = contract[0];
          this.safe.owners = contract[2];
          this.safe.total_owner = contract[2].length;
          this.safe.threshold = parseInt(contract[3]);
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async transactionQueue() {
      this.queuePanel = null;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, wal_abi, signer);
          let totalPending = await nftContract.getPendingTransaction();
          this.queueCount = totalPending.length;
          console.log(this.queueCount,'this.queueCount');

          let skip = (this.queuePage-1)*5;
          this.queue = await nftContract.getOffsetPendingTransaction(skip,5);

          console.log(this.queue,'this.queue');
          return Promise.resolve(); // return a resolved promise when the method finishes
        } else {
          console.log("Ethereum object does not exist");
          return Promise.reject("Ethereum object does not exist"); // return a rejected promise if ethereum object does not exist
        }
      } catch (err) {
        console.log(err);
        return Promise.reject(err); // return a rejected promise if an error occurs
      }
    },
    async transactionHistory() {
      this.historyPanel = null;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, wal_abi, signer);
          let totalPending = await nftContract.getSuccessfulTransaction();
          this.historyCount = totalPending.length;
          let skip = (this.historyPage-1)*5;
          this.history = await nftContract.getOffsetSuccessfulTransaction(skip,5);

          console.log(this.historyCount,'this.historyCount');
          return Promise.resolve(); // return a resolved promise when the method finishes
        } else {
          console.log("Ethereum object does not exist");
          return Promise.reject("Ethereum object does not exist"); // return a rejected promise if ethereum object does not exist
        }
      } catch (err) {
        console.log(err);
        return Promise.reject(err); // return a rejected promise if an error occurs
      }
    },
    getTokenLabel(token) {
      const tokenObj = this.tokenList.find(obj => obj.token === token);
      return tokenObj ? tokenObj.label : null;
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel:not(:first-child):after {
  content: none !important;
}
</style>
