<template>
  <v-stepper v-model="step" class="card-radius">
    <v-stepper-items>
      <v-stepper-content step="1" class="pa-0">
        <v-card class="py-5 py-md-8 elevation-0" color="transparent">
          <v-form class="" ref="form" lazy-validation>
            <div class="px-5 px-md-8">
              <div class="white--text mb-5">
                <h3>Owner wallets</h3>
                <label>Set the owner wallets of your Safe.</label>
              </div>
              <v-row class="my-0" v-for="(data, i) in owner" :key="i">
                <v-col class="py-0">
                  <label class="primary--text ml-5"
                    >Owner {{ i + 1 }} address or ENS *</label
                  >
                  <v-text-field
                    solo
                    rounded
                    class="field-bg my-2"
                    v-model="data.address"
                    :rules="addressRules"
                    required
                    :disabled="i == 0 && !editOwner"
                  ></v-text-field>
                </v-col>
                <v-col cols="2" class="align-self-center pl-0">
                  <v-btn
                    icon
                    rounded
                    color="error"
                    v-if="i == 0"
                    @click.stop="editOwner = true"
                  >
                    <v-icon small class="">fas fa-pen</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    rounded
                    color="error"
                    v-if="i > 0"
                    @click="removeOwner(i)"
                  >
                    <v-icon small class="">fas fa-trash-can</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="my-0">
                <v-col class="py-0">
                  <v-btn
                    text
                    rounded
                    large
                    color="secondary"
                    class="font-weight-bold"
                    @click="owner.push({ address: '' })"
                  >
                    <v-icon x-small class="mr-1">fas fa-plus</v-icon> Add new
                    owner
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <v-divider color="#2F3354" class="my-5"></v-divider>
            <div class="px-5 px-md-8 white--text">
              <div class="mb-5">
                <h3>Threshold</h3>
                <label>Any transaction requires the confirmation of:</label>
              </div>
              <div class="">
                <v-row class="ma-0">
                  <v-col cols="3" md="1" class="pa-0 d-flex">
                    <v-select
                      :items="getThreshold()"
                      solo
                      rounded
                      class="field-bg white--text threshold-dropdown"
                      v-model="threshold"
                    ></v-select>
                  </v-col>
                  <v-col class="align-self-center d-flex"
                    >out of {{ owner.length }} owner(s).</v-col
                  >
                </v-row>
              </div>
            </div>
            <v-divider color="#2F3354" class="my-5"></v-divider>
            <div class="d-flex px-5 px-md-8 justify-space-between">
              <v-btn
                color="primary"
                @click="$router.go(-1)"
                large
                outlined
                rounded
              >
                Back
              </v-btn>
              <v-btn
                color="secondary"
                large
                rounded
                @click="formNext()"
                :disabled="owner.length < 2"
              >
                Next
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2" class="pa-0">
        <v-card class="py-5 py-md-8 elevation-0" color="transparent">
          <v-form class="">
            <div class="px-5 px-md-8 white--text">
              <div class="mb-5">
                <h3>Review</h3>
                <label
                  >You're about to create a new Safe and will have to confirm
                  the transaction with your connected wallet.</label
                >
              </div>
              <v-row class="">
                <v-col cols="12" md="2" class="pb-0">Owners</v-col>
                <v-col cols="12" md="10">
                  <v-row class="my-0" v-for="(data, i) in owner" :key="i">
                    <v-col cols="12" class="pt-0">
                      <label class="">Owner {{ i + 1 }}</label>
                      <p class="mb-0">{{ data.address }}</p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="2" class="pb-0">Threshold</v-col>
                <v-col cols="12" md="10">
                  {{ threshold }} out of {{ owner.length }} owner(s).
                </v-col>
              </v-row>
            </div>
            <v-divider color="#2F3354" class="my-5"></v-divider>
            <div class="d-flex justify-space-between px-5 px-md-8">
              <v-btn color="primary" @click="step--" large outlined rounded>
                Back
              </v-btn>

              <v-btn
                @click.prevent="createContract"
                color="secondary"
                large
                rounded
              >
                Next
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3" class="pa-0">
        <v-card class="py-5 py-md-8 elevation-0" color="transparent">
          <v-form class="">
            <div class="px-md-8 white--text">
              <div
                v-if="waiting && !failed"
                class="waiting text-center white--text"
              >
                <div class="orbit-spinner mx-auto">
                  <div class="orbit"></div>
                  <div class="orbit"></div>
                  <div class="orbit"></div>
                </div>
                <h3>Waiting for transaction confirmation</h3>
                <v-row class="mx-0 my-3 justify-center">
                  <v-col cols="col-12 col-md-8" class="py-0 text-center">
                    <label class="">Please do not leave this page.</label>
                  </v-col>
                </v-row>
              </div>
              <div
                v-else-if="!waiting && !failed"
                class="done text-center white--text"
              >
                <div class="success-wrapper">
                  <svg
                    class="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      class="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      class="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
                <h3>Your Safe was successfully created!</h3>
                <v-row class="mx-0 my-3 justify-center">
                  <v-col cols="col-12 col-md-8" class="pt-0 text-center">
                    <label class="">Your Safe address:</label>
                    <p class="mb-0">{{ safeAddress }}</p>
                  </v-col>
                </v-row>
              </div>
              <div v-if="failed" class="fail text-center white--text">
                <div class="fail-wrapper">
                  <svg
                    class="crossmark addClass"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      class="crossmark__circle addClass"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      class="cross__path cross__path--right addClass"
                      fill="none"
                      d="M16,16 l20,20"
                    />
                    <path
                      class="cross__path cross__path--left addClass"
                      fill="none"
                      d="M16,36 l20,-20"
                    />
                  </svg>
                </div>
                <h3>Your Safe was unsuccessfully created!</h3>
                <v-row class="mx-0 my-3 justify-center">
                  <v-col cols="col-12 col-md-8" class="py-0 text-center">
                    <label class="">Please try again.</label>
                  </v-col>
                </v-row>
              </div>
            </div>
            <div class="">
              <v-divider color="#2F3354" class="my-5"></v-divider>
              <div class="d-flex justify-center px-5 px-md-8 mx-3">
                <v-btn
                  color="secondary"
                  large
                  rounded
                  :disabled="waiting"
                  v-if="!failed"
                  @click="
                    goToHome()
                  "
                >
                  Start using Safe
                </v-btn>
                <v-btn
                  color="secondary"
                  large
                  rounded
                  v-else
                  @click="$router.go()"
                >
                  Back
                </v-btn>
              </div>
            </div>
          </v-form>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
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
      step: 1,
      owner: [
        {
          address: localStorage.getItem("currentAddress"),
        },
      ],
      threshold: 1,
      addressRules: [
        (v) => !!v || "Wallet address is required",
        (v) =>
          v.length >= 10 || "Wallet address must be more than 10 characters",
      ],
      waiting: true,
      editOwner: false,
      failed: false,
      cardLoading: false,
      safeAddress: "",
    };
  },
  methods: {
    removeOwner(i) {
      this.owner.splice(i, 1);
    },
    getThreshold() {
      const item = Array.from({ length: this.owner.length }, (_, i) => i + 1);
      return item;
    },
    formNext() {
      var valid = this.$refs.form.validate();
      if (valid) {
        this.step++;
      }
    },
    async createContract() {
      this.step++;
      this.cardLoading = true;

      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const nftContract = new ethers.Contract(factoryAddress, abi, signer);
          const c = this.owner.map((owner) => owner.address);

          const amount = ethers.utils.parseEther("0.01"); // 1 ETH


          let nftTxn = await nftContract.createContract(c, this.threshold, {
            value: amount,
          });
          await nftTxn.wait();
          let safe = await nftContract.getOwnersContract();
          this.safeAddress = safe[safe.length - 1];
          localStorage.setItem("safeAddress", this.safeAddress);
          this.cardLoading = false;
          this.waiting = false;

          //   console.log("Retrieving Contract: ", nftTxn);
          //   console.log("Retrieving safe address: ", safe);
        } else {
          console.log("Ethereum object does not exist");
        }
      } catch (err) {
        console.log(err);
        this.failed = true;
      }
    },
    goToHome() {
      this.$router.go();
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .v-text-field__details {
    min-height: 0px !important;
  }
  .v-messages {
    min-height: 0px !important;
  }

  .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 0px !important;
  }
}
.theme--light.v-stepper {
  background: rgba(117, 123, 165, 0.2);
}
</style>
