<template>
    <v-main class="home-container">
        <div class="home-content">
            <div class="nav-container">
                <SideNav v-on:menuChanged="menuChanged"/>
            </div>
            <div class="main-container">
                <Bills
                    v-if="isDataReady && activeIndex == 1"
                    :pendingBills="data.pendingBills"
                    :completeBills="data.completeBills"
                    v-on:dataChanged="onDataChanged"/>
                <Friend
                    v-if="isDataReady && activeIndex == 2"
                    :friends="data.friends"
                    :friendRequests="data.friendRequests"
                    v-on:dataChanged="onDataChanged"/>
                <Profile
                    v-if="isDataReady && activeIndex == 3"
                    v-on:dataChanged="onDataChanged"/>
            </div>
        </div>
    </v-main>
</template>

<script>
import SideNav from './SideNav'
import Bills from './Bills'
import Friend from './Friend'
import Profile from './Profile'
import { apiHelper } from '../utilities/ApiHelper'

export default {
    components: {
        SideNav,
        Bills,
        Friend,
        Profile
    },
    data: () => ({
        nameToIndexMap: {
            Home: 1,
            Friends: 2,
            Profile: 3
        },
        activeIndex: 0,
        accessToken: '',
        isDataReady: true,
        dataReadyCount: 0,
        dataNeededCount: 0,
        data: {}
    }),
    methods: {
        setCurrentIndex: function () {
            this.activeIndex = this.nameToIndexMap[this.$route.name]
        },
        menuChanged: function () {
            this.setCurrentIndex()
            switch (this.activeIndex) {
            case 1:
                this.isDataReady = false
                this.onBillsOpened()
                break
            case 2:
                this.isDataReady = false
                this.onFriendsOpened()
                break
            }
        },
        onDataChanged: function () {
            this.menuChanged(this.activeIndex)
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
        },
        onFriendsOpened: function () {
            this.dataReadyCount = 0
            this.dataNeededCount = 2

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            const friendsCallback = (function (response) {
                this.data.friends = response
                this.dataReadyCount += 1
                if (this.dataReadyCount === this.dataNeededCount) {
                    this.isDataReady = true
                }
            }).bind(this)
            
            const friendRequestsCallback = (function (response) {
                this.data.friendRequests = response
                this.dataReadyCount += 1
                if (this.dataReadyCount === this.dataNeededCount) {
                    this.isDataReady = true
                }
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            apiHelper.get('/api/friend', headers, friendsCallback, fallback)
            apiHelper.get('/api/friend/request', headers, friendRequestsCallback, fallback)
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
            this.setCurrentIndex()
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
    overflow: hidden
    .home-content
        height: 100%
        .nav-container
            position: fixed
            height: 100%
            width: 300px
            z-index: 1
        .main-container
            margin-left: 300px
            height: 100%
</style>