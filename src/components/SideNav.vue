<template>
    <v-main class="sidenav-container pt-6 pl-6 pr-6 pb-4">
        <div class="d-flex justify-start align-center">
            <!-- <v-img src="../assets/favicon-96x96.png" width="75" height="75" position="center"/> -->
            <img src="../assets/favicon-96x96.png" width="50" height="50">
            <div class="logo-title font-montserrat ml-4">Splitly</div>
        </div>
        <div class="mt-10">
            <div
                v-for="item in items"
                :key="item.id"
                class="side-nav-item"
                v-bind:class="(activeIndex === item.id) ? 'nav-item-active' : ''"
                v-on:click="openMenu(item.id)">
                <v-icon
                    left
                    v-bind:class="(activeIndex === item.id) ? 'secondary--text' : ''">
                        {{ item.icon }}
                </v-icon> {{ item.title }}
            </div>
        </div>
        <div class="footer text-center">
            <small>Copyright &copy; {{ new Date().getFullYear() }} Splitly by Philip A</small>
        </div>
    </v-main>
</template>

<script>
export default {
    data: () => ({
        nameToIndexMap: {
            Home: 1,
            Friends: 2,
            Profile: 3
        },
        activeIndex: 0,
        items: [
            {id: 1, title: 'Bills', icon: 'mdi-credit-card'},
            {id: 2, title: 'Friends', icon: 'mdi-account-multiple'},
            {id: 3, title: 'Profile', icon: 'mdi-account'},
            {id: 4, title: 'Sign Out', icon: 'mdi-logout'}
        ],
    }),
    methods: {
        openMenu: function (index) {
            this.activeIndex = index
            switch (this.activeIndex) {
                case 1:
                    this.$router.push('/')
                    break
                case 2:
                    this.$router.push('/friends')
                    break
                case 3:
                    this.$router.push('/profile')
                    break
                case 4:
                    this.signOut()
                    return
            }
            this.$emit('menuChanged')
        },
        signOut: function () {
            this.$cookie.delete('accessToken')
            this.$cookie.delete('profile')
            this.$router.push('/sign-in')
        }
    },
    mounted: function () {
        this.activeIndex = this.nameToIndexMap[this.$route.name]
    }
}
</script>

<style lang="sass" scoped>
.sidenav-container
    height: 100%
    box-shadow: 0px 0px 10px #a0a2ae
    background-color: #ffffff

.logo-title
    font-size: 22px
    font-weight: bold

.font-montserrat
    font-family: Montserrat

.side-nav-item
    padding: 18px 0px
    opacity: 0.7
    transition: opacity 0.15s
    &:hover
        cursor: pointer
        opacity: 1

.nav-item-active
    opacity: 1
    font-weight: 500

.footer
    position: absolute
    width: 100%
    bottom: -4px
</style>