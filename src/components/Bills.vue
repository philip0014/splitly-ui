<template>
    <v-main class="bills-container pa-4 pl-6">
        <div class="title-text">
            Bills Overview
        </div>
        <div
            v-if="myPendingBills.length != 0"
            class="bills-content mt-4">
            <div class="content-title">You owe to</div>
            <hr>
            <div class="cards-container">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in myPendingBills"
                    :key="bill.id"
                    width="300"
                    height="100">
                    <div class="d-flex align-center">
                        <img :src="bill.receiver.profileUrl" :alt="bill.receiver.username" width="100" height="100">
                        <div class="bill-card-content ml-2 mr-2">
                            <div>
                                <strong>{{ bill.receiver.username }}</strong>
                            </div>
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div class="text-nominal mt-1">
                                {{ bill.currency }} {{ bill.nominalNeeded - bill.nominalPaid }}
                            </div>
                            <v-dialog
                                @click:outside="onPayClose()"
                                v-model="payBillDialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row no-gutters>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            class="pa-0"
                                            color="primary"
                                            text
                                            v-bind="attrs"
                                            v-on="on">
                                            Pay Bill
                                        </v-btn>
                                    </v-row>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Pay to {{ bill.receiver.username }}</span>
                                    </v-card-title>
                                    <v-row no-gutters class="mt-4 pl-4 pr-4 pay-dialog">
                                        <v-col cols="12">
                                            <div class="pl-2 pr-2">
                                                <v-text-field
                                                    v-model="payValue"
                                                    :hint="bill.currency + ' ' + bill.nominalNeeded.toString()"
                                                    :rules="payValueRules"
                                                    persistent-hint
                                                    label="Amount of money you are going to pay">
                                                </v-text-field>
                                            </div>
                                            <v-slider
                                                class="mt-4"
                                                v-model="payValue"
                                                track-color="primary lighten-2"
                                                track-fill-color="primary"
                                                :max="bill.nominalNeeded">
                                            </v-slider>
                                        </v-col>
                                    </v-row>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            :loading="isLoading"
                                            :disabled="isLoading"
                                            color="primary darken-1"
                                            text
                                            @click="onPaySubmit(bill)">
                                            Pay
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
        <div
            v-if="othersPendingBills.length != 0"
            class="bills-content mt-4">
            <div class="content-title">Who needs to pay you</div>
            <hr>
            <div class="cards-container">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in othersPendingBills"
                    :key="bill.id"
                    width="300"
                    height="100">
                    <div class="d-flex align-center">
                        <img :src="bill.giver.profileUrl" :alt="bill.giver.username" width="100" height="100">
                        <div class="ml-2">
                            <div>
                                <strong>{{ bill.giver.username }}</strong>
                            </div>
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div class="text-nominal mt-1">
                                {{ bill.currency }} {{ bill.nominalNeeded - bill.nominalPaid }}
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
        <div
            v-if="historyBills.length != 0"
            class="bills-content mt-4">
            <div class="content-title">Completed</div>
            <hr>
            <div class="cards-container">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in historyBills"
                    :key="bill.id"
                    width="300"
                    height="100">
                    <div
                        v-if="bill.giver.id == profile.id"
                        class="d-flex align-center">
                        <img :src="bill.receiver.profileUrl" :alt="bill.receiver.username" width="100" height="100">
                        <div class="ml-2">
                            You paid <strong>{{ bill.receiver.username }}</strong>
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div class="text-nominal mt-1 error--text">
                                {{ bill.currency }} {{ bill.nominalNeeded }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="d-flex align-center">
                        <img :src="bill.giver.profileUrl" :alt="bill.giver.username" width="100" height="100">
                        <div class="ml-2">
                            <strong>{{ bill.giver.username }}</strong> paid you
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div class="text-nominal mt-1 primary--text">
                                {{ bill.currency }} {{ bill.nominalNeeded }}
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-main>
</template>

<script>
import { apiHelper } from '../utilities/ApiHelper'

export default {
    props: ['pendingBills', 'completeBills'],
    data: () => ({
        accessToken: '',
        isLoading: false,
        payBillDialog: false,
        payValue: 0,
        payValueRules: [
            value => {
                return (Number(value) !== 0) || 'Required'
            },
        ],
        myPendingBills: [],
        othersPendingBills: [],
        historyBills: [],
        profile: {}
    }),
    methods: {
        onPayClose: function () {
            this.payBillDialog = false
            this.payValue = 0
        },
        onPaySubmit: function (bill) {
            this.isLoading = true

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            const callback = (function (response) {
                console.log(response)
                this.payBillDialog = false
                this.payValue = 0
                this.isLoading = false
                this.$emit('dataChanged')
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
                this.payBillDialog = false
                this.payValue = 0
                this.isLoading = false
            }).bind(this)

            const data = {
                nominalPaid: this.payValue
            }

            apiHelper.put('/api/bill/pay/' + bill.id, headers, data, callback, fallback)
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = JSON.parse(this.$cookie.get('profile'))

        let dateFormatter = new Intl.DateTimeFormat('en-us', {
            month: 'short',
            day: '2-digit'
        });

        this.pendingBills.forEach(bill => {
            let date = new Date(bill.createdAt)
            bill.createdAt = dateFormatter.format(date)

            if (bill.giver.id == this.profile.id) {
                this.myPendingBills.push(bill)
            } else {
                this.othersPendingBills.push(bill)
            }
        });
        this.completeBills.forEach(bill => {
            let date = new Date(bill.createdAt)
            bill.createdAt = dateFormatter.format(date)
            this.historyBills.push(bill)
        });
    }
}
</script>

<style lang="sass" scoped>
.bills-container
    height: 100%
    overflow-y: auto

.title-text
    font-size: 40px

.bills-content
    .content-title
        font-size: 18px
    .cards-container
        display: flex
        flex-wrap: wrap
        align-items: center
        .bill-card-content
            flex: 1
    img
        border-radius: 5px 0px 0px 5px

.text-date
    position: absolute
    top: 4px
    right: 8px

.text-nominal
    font-size: 18px

.pay-dialog
    overflow: hidden
</style>