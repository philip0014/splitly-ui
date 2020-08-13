<template>
    <v-main class="bills-container pa-4 pl-6">
        <v-dialog
            @click:outside="onCreateClose()"
            v-model="createBillDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
                <div
                    v-if="myPendingBills.length === 0 && othersPendingBills.length === 0 && historyBills.length === 0"
                    class="empty-bill-container d-flex justify-center align-center">
                    <img src="../assets/empty-bill.png" alt="">
                    <div class="mt-4 text--text">
                        <h4>OOPS BILL NOT FOUND</h4>
                    </div>
                    <v-btn
                        class="mt-4"
                        color="primary"
                        v-bind="attrs"
                        v-on="on">
                        Create new bill
                    </v-btn>
                </div>
                <div
                    v-else
                    class="d-flex align-center justify-space-between">
                    <div class="title-text">
                        Bills Overview
                    </div>
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
                                    :error-messages="billDescriptionErrors"
                                    @input="$v.billDescription.$touch()"
                                    @blur="$v.billDescription.$touch()"
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
                            <div class="search-result mt-n4 pl-2 pr-2">
                                <div
                                    class="result-item"
                                    v-for="user in userSearchResult"
                                    :key="user.id"
                                    @click="addSelectedUser(user)">
                                    <div class="mt-1 mb-1 d-flex">
                                        <v-avatar class="mt-1" size="32">
                                            <img :src="user.profileUrl" :alt="user.username">
                                        </v-avatar>
                                        <div class="mt-2 ml-4">
                                            {{ user.username }}
                                        </div>
                                    </div>
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
                                    <v-icon
                                        class="deselect-user"
                                        @click="deselectUser(user)"
                                        left>mdi-close</v-icon>
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
                                {{ bill.currency }} {{ Number(bill.nominalNeeded - bill.nominalPaid).toFixed(2) }}
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
                                                    :hint="'You need to pay ' + bill.currency + ' ' + Number(bill.nominalNeeded - bill.nominalPaid).toFixed(2)"
                                                    :error-messages="payValueErrors"
                                                    @input="$v.payValue.$touch()"
                                                    @blur="$v.payValue.$touch()"
                                                    persistent-hint
                                                    outlined
                                                    dense
                                                    label="Amount of money you are going to pay">
                                                </v-text-field>
                                            </div>
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
                                        <v-btn
                                            :loading="isLoading"
                                            :disabled="isLoading"
                                            color="primary darken-1"
                                            text
                                            @click="onSettleUpSubmit(bill)">
                                            Settle Up
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
                                {{ bill.currency }} {{ Number(bill.nominalNeeded - bill.nominalPaid).toFixed(2) }}
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
                                {{ bill.currency }} {{ Number(bill.nominalNeeded).toFixed(2) }}
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
import { required, minLength, decimal } from 'vuelidate/lib/validators'

export default {
    props: ['pendingBills', 'completeBills'],
    data: () => ({
        accessToken: '',
        isLoading: false,
        createBillDialog: false,
        currencyCodes: [],
        billCurrency: 'IDR',
        billDescription: '',
        userSearchKeyword: '',
        userSearchResult: [],
        userSelected: [],
        userBillAmount: {},
        payBillDialog: false,
        payValue: 0,
        myPendingBills: [],
        othersPendingBills: [],
        historyBills: [],
        profile: {}
    }),
    validations: {
        billDescription: {
            required,
            minLength: minLength(6)
        },
        payValue: {
            required,
            decimal,
            minValue: (value) => Number(value) > 0
        }
    },
    computed: {
        billDescriptionErrors () {
            const errors = []
            if (!this.$v.billDescription.$dirty) return errors
            !this.$v.billDescription.required && errors.push('Description is required')
            !this.$v.billDescription.minLength && errors.push('Description must be at least 6 characters')
            return errors
        },
        payValueErrors () {
            const errors = []
            if (!this.$v.payValue.$dirty) return errors
            !this.$v.payValue.required && errors.push('Amount is required')
            !this.$v.payValue.decimal && errors.push('Amount must be numeric')
            !this.$v.payValue.minValue && errors.push('Amount is required')
            return errors
        }
    },
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
        addSelectedUser: function (newUser) {
            let isNewUser = true
            for (let i = 0; i < this.userSelected.length ; i++) {
                let selectedUser = this.userSelected[i]
                if (selectedUser.id === newUser.id) {
                    isNewUser = false
                    break
                }
            }

            if (isNewUser) {
                this.userSelected.push(newUser)
            }
        },
        deselectUser: function (user) {
            for (let i = 0; i < this.userSelected.length ; i++) {
                let selectedUser = this.userSelected[i]
                if (selectedUser.id === user.id) {
                    this.userSelected.splice(i, 1);
                    break
                }
            }
        },
        onCreateSubmit: function () {
            this.$v.$touch()
            if (this.$v.billDescription.$invalid) return

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
            this.$v.$touch()
            if (this.$v.payValue.$invalid) return

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

            this.payValue = Number(this.payValue)
            if (this.payValue > (bill.nominalNeeded - bill.nominalPaid)) {
                this.payValue = (bill.nominalNeeded - bill.nominalPaid)
            }
            
            const data = {
                nominalPaid: this.payValue
            }

            apiHelper.put('/api/bill/pay/' + bill.id, headers, JSON.stringify(data), callback, fallback)
        },
        onSettleUpSubmit: function (bill) {
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

            apiHelper.put('/api/bill/settleUp/' + bill.id, headers, null, callback, fallback)
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

.empty-bill-container
    height: 100%
    flex-direction: column

.bills-header
    position: fixed
    width: 100%

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
    .result-item
        cursor: pointer
        transition: color 0.15s
        &:hover
            color: #24a19c
    img
        object-fit: cover

.select-container
    border: 1px solid #a0a2ae
    border-radius: 4px
    height: 200px
    overflow-y: auto
    .deselect-user
        color: #999999
        cursor: pointer
        transition: color 0.15s
        &:hover
            color: #ff5f40
    img
        object-fit: cover

.bills-content
    .content-title
        font-size: 18px
    .cards-container
        display: flex
        flex-wrap: wrap
        align-items: center
        img
            object-fit: cover
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