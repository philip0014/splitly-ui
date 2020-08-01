<template>
    <v-main class="bills-container pa-4 pl-6">
        <div class="title-text">
            Bills Overview
        </div>
        <div
            v-if="myPendingBills.length != 0"
            class="bills-content mt-4">
            <div class="content-title">You owe to</div>
            <div class="cards-container pt-2 pb-4">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in myPendingBills"
                    :key="bill.id"
                    min-width="30%"
                    width="30%"
                    height="100">
                    <div class="d-flex align-center">
                        <img :src="bill.receiver.profileUrl" :alt="bill.receiver.username" width="100" height="100">
                        <div class="ml-2">
                            <div>
                                <strong>{{ bill.receiver.username }}</strong>
                            </div>
                            <small class="text--text text-date">{{ bill.createdAt }}</small>
                            <div class="text-nominal mt-1">
                                {{ bill.currency }} {{ bill.nominalNeeded - bill.nominalPaid }}
                            </div>
                            <v-btn
                                class="pa-0"
                                color="primary"
                                @click="onSubmit()"
                                text>
                                Pay Bill
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
        <div
            v-if="othersPendingBills.length != 0"
            class="bills-content mt-4">
            <div class="content-title">Who needs to pay you</div>
            <div class="cards-container pt-2 pb-4">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in othersPendingBills"
                    :key="bill.id"
                    min-width="30%"
                    width="30%"
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
            <div class="content-title">History</div>
            <div class="cards-container pt-2 pb-4">
                <v-card
                    class="mr-6 mb-6"
                    v-for="bill in historyBills"
                    :key="bill.id"
                    min-width="30%"
                    width="30%"
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
export default {
    props: ['pendingBills', 'completeBills'],
    data: () => ({
        myPendingBills: [],
        othersPendingBills: [],
        historyBills: [],
        profile: {}
    }),
    mounted: function () {
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

        console.log(this.myPendingBills)
        console.log(this.othersPendingBills)
        console.log(this.historyBills)
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
    height: 150px
    .content-title
        font-size: 20px
    .cards-container
        display: flex
        flex-wrap: wrap
        align-items: center
    img
        border-radius: 5px 0px 0px 5px

.text-date
    position: absolute
    top: 4px
    right: 8px

.text-nominal
    font-size: 18px
</style>