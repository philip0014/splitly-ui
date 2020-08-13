<template>
    <v-main class="friends-container pa-4 pl-6">
        <v-dialog
            @click:outside="onSearchClose()"
            v-model="searchFriendDialog" max-width="400px">
            <template v-slot:activator="{ on, attrs }">
                <div
                    v-if="friends.totalSize === 0 && friendRequests.length === 0"
                    class="empty-friend-container d-flex justify-center align-center">
                    <img src="../assets/empty-friend.png" alt="">
                    <div class="mt-4 text--text">
                        <h4>OOPS THERE IS NO ONE HERE</h4>
                    </div>
                    <v-btn
                        class="mt-4"
                        color="primary"
                        v-bind="attrs"
                        v-on="on">
                        Find new friend
                    </v-btn>
                </div>
                <div
                    v-else
                    class="d-flex align-center justify-space-between">
                    <div class="title-text">
                        Friends Overview
                    </div>
                    <v-btn
                        color="primary"
                        v-bind="attrs"
                        v-on="on">
                        Find Friend
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-row no-gutters class="pa-6">
                    <v-col cols="12">
                        <div class="search-friend-title">
                            Find your friends
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
                                    class="result-item d-flex justify-space-between"
                                    v-for="user in userSearchResult"
                                    :key="user.id">
                                    <div class="mt-1 mb-1 d-flex">
                                        <v-avatar class="mt-1" size="32">
                                            <img :src="user.profileUrl" :alt="user.username">
                                        </v-avatar>
                                        <div class="mt-2 ml-4">
                                            {{ user.username }}
                                        </div>
                                    </div>
                                    <v-icon
                                        v-if="user.isAdded === false"
                                        class="add-user"
                                        @click="addUser(user)"
                                        left>mdi-account-plus</v-icon>
                                    <v-icon
                                        v-else
                                        class="add-user primary--text"
                                        left>mdi-account-check</v-icon>
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
import { apiHelper } from '../utilities/ApiHelper'

export default {
    props: ['friends', 'friendRequests'],
    data: () => ({
        accessToken: '',
        profile: {},
        searchFriendDialog: false,
        friendRequestMapping: {},
        userSearchKeyword: '',
        userSearchResult: []
    }),
    methods: {
        onSearchClose: function () {
            this.searchFriendDialog = false
            this.userSearchKeyword = ''
            this.userSearchResult = []
        },
        onSearchKeywordTyped: function () {
            if (!this.userSearchKeyword) {
                this.userSearchResult = []
                return
            }

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            this.userSearchResult = []
            const callback = (function (response) {
                for (let i = 0; i < response.length ; i++) {
                    if (this.friendRequestMapping[response[i].id] === undefined) {
                        let currUser = response[i]
                        currUser.isAdded = false
                        this.userSearchResult.push(currUser)
                    }
                }
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            apiHelper.get('/api/search/new-friends?keyword=' + this.userSearchKeyword, headers, callback, fallback)
        },
        addUser: function (user) {
            const headers = {
                'Authorization': 'Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            }

            const callback = (function (response) {
                console.log(response)
                this.friendRequestMapping[user.id] = user
                for (let i = 0; i < this.userSearchResult.length ; i++) {
                    if (this.userSearchResult[i].id === user.id) {
                        this.userSearchResult[i].isAdded = true
                    }
                }
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            const data = {
                id: user.id
            }

            apiHelper.post('/api/friend/request', headers, JSON.stringify(data), callback, fallback)
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = JSON.parse(this.$cookie.get('profile'))

        for (let i = 0; i < this.friendRequests.length ; i++) {
            if (this.friendRequests[i].from.id === this.profile.id) {
                this.friendRequestMapping[this.friendRequests[i].to.id] = this.friendRequests[i].to
            } else {
                this.friendRequestMapping[this.friendRequests[i].from.id] = this.friendRequests[i].from
            }
        }

        console.log(this.friends)
        console.log(this.friendRequests)
        console.log(this.friendRequestMapping)
    }
}
</script>

<style lang="sass" scoped>
.friends-container
    height: 100%

.empty-friend-container
    height: 100%
    flex-direction: column

button:focus
    outline: 0

.title-text
    font-size: 40px

.search-friend-title
    font-size: 18px

.search-result
    border: 1px solid #a0a2ae
    border-radius: 4px
    height: 200px
    overflow-y: auto
    .result-item
        .add-user
            color: #999999
            cursor: pointer
            transition: color 0.15s
            &:hover
                color: #24a19c
    img
        object-fit: cover
</style>