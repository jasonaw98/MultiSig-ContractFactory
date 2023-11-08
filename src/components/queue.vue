<template>
  <div>
    <h2 class="mb-4">Transaction queue ({{ queueCount }})</h2>
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
                  <v-btn color="secondary" rounded large class="elevation-0" :disabled="item['isConfirmed']" @click="confirmTrans(parseInt(item[0]), i)">
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
    </div>
         
  </div>
</template>
<script>
import contract from '../contracts/MultiSigWallet.json';
import { ethers } from 'ethers';

//Contract Factory Address
const contractAddress = localStorage.getItem('safeAddress');
const abi = contract.abi;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
export default {
  props: {
    tokenList: {
      type: Array,
      required: true,
      default: []
    },
  },
  components: { 
  },
  data() {
    return {
      queue: [],
      queueCount: 0,
      confirmCount: 0,
      totalToConfirm: 0,
      page: 1,
      panel: null,
    };
  },
  mounted() {
    this.transactionQueue();
  },
  methods: {

    async transactionQueue(type, index = null) {
      this.panel = null;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, abi, signer);
          let totalPending = await nftContract.getPendingTransaction();
          let totalToConfirm = await nftContract.numConfirmationsRequired();
          this.totalToConfirm = parseInt(totalToConfirm);
          let oldQueueCount = this.queueCount;
          let oldConfirmCount = this.confirmCount;
          this.queueCount = totalPending.length;

          if(type == "transfer") {
            if(oldQueueCount == this.queueCount) {
              this.transactionQueue("transfer");

              console.log('transfer');
            }
          }

          let skip = (this.page-1)*5;
          let queue = await nftContract.getOffsetPendingTransaction(skip,5);
          const result = await Promise.all(queue.map(async (obj, index) => {
            let isConfirmed = await this.isConfirmed(parseInt(obj[0]));
            return { ...obj, isConfirmed: isConfirmed };
          }));
          this.queue = result;
          if(type == "confirmed") {
            this.confirmCount = parseInt(this.queue[index][4]);
            console.log(this.confirmCount,'this.confirmCount');
            console.log(oldConfirmCount,'oldConfirmCount');
   
            if(oldConfirmCount == this.confirmCount) {
              this.transactionQueue("confirmed",index);
              console.log('asdadadadawdad231231');
            }
          }
          return Promise.resolve();
        } else {
          console.log("Ethereum object does not exist");
          return Promise.reject("Ethereum object does not exist"); 
        }
      } catch (err) {
        console.log(err);
        return Promise.reject(err); 
      }
    },
    async confirmTrans(id, index) {
      console.log(id,'id');
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, abi, signer);
          let tx = await nftContract.confirmTransaction(id);
          const confirmCount = parseInt(this.queue[index][4]);
          if(tx) {
            if(this.totalToConfirm - confirmCount === 1) {
              await this.transactionQueue("transfer");

                console.log('transfer');
            }else {
              await this.transactionQueue("confirmed", index);
            }
            this.$emit('showSnackbar', {text:"Transaction confirmed", color:"success"})
          }
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
        this.$emit('showSnackbar', {text: "Fail to confirm", color:"error"})
      }
    },
    async isConfirmed(id) {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(contractAddress, abi, signer);
          let isConfirmed = await nftContract.isConfirmed(id,localStorage.getItem("currentAddress"));
          
          return isConfirmed;
        } else {
          console.log("Ethereum object does not exist");
          return false;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    getTokenLabel(token) {
      const tokenObj = this.tokenList.find(obj => obj.token === token);
      return tokenObj ? tokenObj.label : null;
    }
  }

};
</script>
<style lang="scss" scoped>
::v-deep .v-expansion-panel:not(:first-child):after {
  content: none !important;
}
</style>
