<template>
    <v-main class="home-container">
        <div class="home-background"></div>
        <div class="home-content">
            <div class="nav-container">
                <SideNav v-on:menuChanged="menuChanged"/>
            </div>
            <div class="main-container">
                <Bills
                    v-if="isDataReady && activeIndex == 1"
                    :pendingBills="data.pendingBills"
                    :completeBills="data.completeBills"/>
            </div>
        </div>
    </v-main>
</template>

<script>
import SideNav from './SideNav'
import Bills from './Bills'
import { apiHelper } from '../utilities/ApiHelper'

export default {
    components: {
        SideNav,
        Bills
    },
    data: () => ({
        activeIndex: 1,
        accessToken: '',
        isDataReady: false,
        dataReadyCount: 0,
        dataNeededCount: 0,
        data: {}
    }),
    methods: {
        menuChanged: function (index) {
            this.activeIndex = index
            this.isDataReady = false
            switch (this.activeIndex) {
            case 1:
                this.onBillsOpened()
                break
            }
        },
        onBillsOpened: function () {
            this.dataReadyCount = 0
            this.dataNeededCount = 2

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            const pendingCallback = (function (response) {
                this.data.pendingBills = response
                this.dataReadyCount += 1
                if (this.dataReadyCount === this.dataNeededCount) {
                    this.isDataReady = true
                }
            }).bind(this)
            
            const completeCallback = (function (response) {
                this.data.completeBills = response
                this.dataReadyCount += 1
                if (this.dataReadyCount === this.dataNeededCount) {
                    this.isDataReady = true
                }
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            apiHelper.get('/api/bill/pending', headers, pendingCallback, fallback)
            apiHelper.get('/api/bill/complete', headers, completeCallback, fallback)
        }
    },
    created: function () {
        this.accessToken = this.$cookie.get('accessToken')
        if (this.accessToken == null) {
            this.$router.push('/sign-in')
            return
        }

        const headers = {
            'Authorization': 'Bearer ' + this.accessToken
        }

        const callback = (function (response) {
            console.log(response)
            this.menuChanged(this.activeIndex)
        }).bind(this)

        const fallback = (function (error) {
            console.log(error)
            this.$cookie.delete('accessToken')
            this.$cookie.delete('profile')
            this.$router.push('/sign-in')
        }).bind(this)

        apiHelper.get('/api/profile', headers, callback, fallback)
    },
}
</script>

<style lang="sass" scoped>
.home-container
    height: 100%
    background-image: url('../assets/auth-bg.png')
    background-repeat: no-repeat
    background-size: auto
    background-position: center
    overflow: hidden
    .home-content
        height: 100%
        display: flex
        .nav-container
            width: 35%
            max-width: 300px
        .main-container
            flex: 1

.home-background
    width: 100%
    height: 100%
    background-color: white
    opacity: 0.7
    position: fixed
</style>