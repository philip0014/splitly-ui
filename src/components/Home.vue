<template>
    <v-main>
        <v-row no-gutters class="pa-2">
            <v-col md="2">
            </v-col>
            <VLine/>
        </v-row>
    </v-main>
</template>

<script>
import VLine from './VLine'
import { apiHelper } from '../utilities/ApiHelper'

export default {
    components: {
        VLine
    },
    data: () => ({
        activeIndex: 1,
        accessToken: '',
        profile: {}
    }),
    methods: {
        menuChanged: function (index) {
            this.activeIndex = index
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = this.$cookie.get('profile')
        if (this.accessToken == null || this.profile == null) {
            this.$router.push('/sign-in')
            return
        }

        const headers = {
            'Authorization': 'Bearer ' + this.accessToken
        }

        const callback = (function (response) {
            console.log(response)
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