<template>
    <v-main class="bills-container pa-4 pl-6">
        <div class="title-text">
            Bills Overview
        </div>
        <v-dialog
            @click:outside="onCreateClose()"
            v-model="createBillDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
                <div class="mt-2">
                    <v-btn
                        color="primary"
                        v-bind="attrs"
                        v-on="on">
                        Create Bill
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-row no-gutters class="pa-6">
                    <v-col cols="12">
                        <div class="create-bill-title">
                            Insert bill details
                        </div>
                        <v-row no-gutters class="d-flex justify-space-between align-center mt-4">
                            <v-col cols="3">
                                <v-select
                                    :items="currencyCodes"
                                    v-model="billCurrency"
                                    dense
                                    outlined>
                                </v-select>
                            </v-col>
                            <v-col cols="9">
                                <v-text-field
                                    v-model="billDescription"
                                    label="Bill description"
                                    :rules="billDescriptionRules"
                                    outlined
                                    dense
                                    prepend-inner-icon="mdi-credit-card">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <div class="create-bill-title">
                            Choose who you want to split this bill with
                        </div>
                        <div class="search-container mt-4">
                            <v-text-field
                                v-model="userSearchKeyword"
                                label="Enter username or email"
                                outlined
                                dense
                                prepend-inner-icon="mdi-magnify"
                                @keyup="onSearchKeywordTyped()">
                            </v-text-field>
                            <div class="search-result mt-n4 pt-2 pl-2 pr-2">
                                <div
                                    v-for="user in userSearchResult"
                                    :key="user.id">
                                    <v-checkbox height="0" v-model="userSelected" :value="user">
                                        <template v-slot:label>
                                            <v-avatar class="mt-1" size="32">
                                                <img :src="user.profileUrl" :alt="user.username">
                                            </v-avatar>
                                            <div class="mt-2 ml-4">
                                                {{ user.username }}
                                            </div>
                                        </template>
                                    </v-checkbox> 
                                </div>
                            </div>
                        </div>
                        <div v-if="userSelected.length !== 0" class="create-bill-title mt-6">
                            Enter amount of money for each participant
                        </div>
                        <div v-if="userSelected.length !== 0" class="select-container mt-4 pt-2 pl-2 pr-2">
                            <div
                                v-for="user in userSelected"
                                :key="user.id"
                                class="d-flex justify-space-between align-center mb-2">
                                <div class="d-flex align-center">
                                    <v-avatar size="32">
                                        <img :src="user.profileUrl" :alt="user.username">
                                    </v-avatar>
                                    <div class="ml-4">
                                        {{ user.username }}
                                    </div>
                                </div>
                                <div>
                                    <v-text-field
                                        :prefix="billCurrency"
                                        v-model="userBillAmount[user.id]"
                                        placeholder="10000"
                                        hide-details
                                        outlined
                                        dense>
                                    </v-text-field>
                                </div>
                            </div>
                        </div>
                        <div v-if="userSelected.length !== 0" class="mt-4">
                            <v-row no-gutters>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="primary"
                                    @click="onCreateSubmit()">
                                    Create Bill
                                </v-btn>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
        <div
            v-if="myPendingBills.length != 0"
            class="bills-content mt-6">
            <div class="content-title">You owe to</div>
            <hr>
            <div class="cards-container">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in myPendingBills"
                    :key="bill.id"
                    width="300"
                    height="100">
                    <div class="d-flex">
                        <img :src="bill.receiver.profileUrl" :alt="bill.receiver.username" width="100" height="100">
                        <div class="bill-card-content pl-2 pr-2 pt-1 pb-1">
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div>
                                <strong>{{ bill.receiver.username }}</strong>
                            </div>
                            <div class="text-description mt-n2">
                                {{ bill.description }}
                            </div>
                            <div class="text-nominal mt-2">
                                {{ bill.currency }} {{ bill.nominalNeeded - bill.nominalPaid }}
                            </div>
                            <v-dialog
                                @click:outside="onPayClose()"
                                v-model="payBillDialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <a
                                        class="pay-bill-btn pa-0"
                                        v-bind="attrs"
                                        v-on="on">
                                        Pay Bill
                                    </a>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Pay to {{ bill.receiver.username }}</span>
                                    </v-card-title>
                                    <v-row no-gutters class="mt-4 pl-4 pr-4 pay-dialog">
                                        <v-col cols="12">
                                            <div class="mt-2 pl-2 pr-2">
                                                <v-text-field
                                                    v-model="payValue"
                                                    :hint="'You need to pay ' + bill.currency + ' ' + (bill.nominalNeeded - bill.nominalPaid).toString()"
                                                    :rules="payValueRules"
                                                    persistent-hint
                                                    outlined
                                                    dense
                                                    label="Amount of money you are going to pay">
                                                </v-text-field>
                                            </div>
                                            <v-slider
                                                class="mt-4"
                                                v-model="payValue"
                                                track-color="primary lighten-2"
                                                track-fill-color="primary"
                                                :max="bill.nominalNeeded - bill.nominalPaid">
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
                    <div class="d-flex">
                        <img :src="bill.giver.profileUrl" :alt="bill.giver.username" width="100" height="100">
                        <div class="bill-card-content pl-2 pr-2 pt-1 pb-1">
                            <div>
                                <strong>{{ bill.giver.username }}</strong>
                            </div>
                            <div class="text-description mt-n2">
                                {{ bill.description }}
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
                        class="d-flex">
                        <img :src="bill.receiver.profileUrl" :alt="bill.receiver.username" width="100" height="100">
                        <div class="bill-card-content pl-2 pr-2 pt-1 pb-1">
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div>
                                You paid <strong>{{ bill.receiver.username }}</strong>
                            </div>
                            <div class="text-description mt-n2">
                                {{ bill.description }}
                            </div>
                            <div class="text-nominal mt-1 error--text">
                                {{ bill.currency }} {{ bill.nominalNeeded }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="d-flex">
                        <img :src="bill.giver.profileUrl" :alt="bill.giver.username" width="100" height="100">
                        <div class="bill-card-content pl-2 pr-2 pt-1 pb-1">
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div>
                                <strong>{{ bill.giver.username }}</strong> paid you
                            </div>
                            <div class="text-description mt-n2">
                                {{ bill.description }}
                            </div>
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
        createBillDialog: false,
        currencyCodes: [],
        billCurrency: 'IDR',
        billDescription: '',
        billDescriptionRules: [
            value => !!value || 'Required',
        ],
        userSearchKeyword: '',
        userSearchResult: [],
        userSelected: [],
        userBillAmount: {},
        payBillDialog: false,
        payValue: 0,
        payValueRules: [
            value => (Number(value) !== 0) || 'Required',
        ],
        myPendingBills: [],
        othersPendingBills: [],
        historyBills: [],
        profile: {}
    }),
    methods: {
        onCreateClose: function () {
            this.createBillDialog = false
            this.billCurrency = 'IDR'
            this.billDescription = ''
            this.userSearchKeyword = ''
            this.userSearchResult = []
            this.userSelected = []
            this.userBillCurrency = {}
            this.userBillAmount = {}
        },
        onSearchKeywordTyped: function () {
            if (!this.userSearchKeyword) {
                this.userSearchResult = []
                return
            }

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            const callback = (function (response) {
                this.userSearchResult = response
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            apiHelper.get('/api/search/users?keyword=' + this.userSearchKeyword, headers, callback, fallback)
        },
        onCreateSubmit: function () {
            this.isLoading = true

            const billParticipants = []
            this.userSelected.forEach(user => {
                billParticipants.push({
                    userId: user.id,
                    nominal: this.userBillAmount[user.id]
                })
            })

            const data = {
                description: this.billDescription,
                currencyCode: this.billCurrency,
                participants: billParticipants
            }

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            }

            const callback = (function (response) {
                console.log(response)
                this.onCreateClose()
                this.$emit('dataChanged')
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
                this.onCreateClose()
            }).bind(this)

            apiHelper.post('/api/bill/create', headers, JSON.stringify(data), callback, fallback)
        },
        onPayClose: function () {
            this.payBillDialog = false
            this.payValue = 0
        },
        onPaySubmit: function (bill) {
            this.isLoading = true

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
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

            apiHelper.put('/api/bill/pay/' + bill.id, headers, JSON.stringify(data), callback, fallback)
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = JSON.parse(this.$cookie.get('profile'))
        this.currencyCodes = require('currency-codes').codes()

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

button:focus
    outline: 0

.title-text
    font-size: 40px

.create-bill-title
    font-size: 18px

.search-result
    border: 1px solid #a0a2ae
    border-radius: 4px
    height: 200px
    overflow-y: auto

.select-container
    border: 1px solid #a0a2ae
    border-radius: 4px
    height: 200px
    overflow-y: auto

.bills-content
    .content-title
        font-size: 18px
    .cards-container
        display: flex
        flex-wrap: wrap
        align-items: center
        .bill-card-content
            flex: 1
            display: flex
            flex-direction: column
            justify-content: space-between
            a:hover
                text-decoration: none
                color: #24a19c

    img
        border-radius: 5px 0px 0px 5px

.text-date
    position: absolute
    top: 4px
    right: 8px

.text-description
    font-size: 14px

.pay-bill-btn
    position: absolute
    bottom: 4px
    right: 8px

.text-nominal
    font-size: 18px

.pay-dialog
    overflow: hidden
</style>