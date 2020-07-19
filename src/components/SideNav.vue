<template>
    <v-main class="sidenav-container">
        <div class="d-flex justify-start align-center">
            <v-img src="../assets/favicon-96x96.png"/>
            <!-- <img src="../assets/favicon-96x96.png" width="75" height="75"> -->
            <div class="logo-title font-montserrat">Splitly</div>
        </div>
        <div class="pa-4 mt-9">
            <div
                v-for="item in items"
                :key="item.id"
                class="side-nav-item"
                v-bind:class="(activeIndex === item.id) ? 'nav-item-active' : ''"
                v-on:click="openMenu(item.id)">
                <v-icon left>{{ item.icon }}</v-icon> {{ item.title }}
            </div>
            {{ fromParent }}
        </div>
    </v-main>
</template>

<script>
export default {
    props: ['fromParent'],
    data: () => ({
        activeIndex: 1,
        items: [
            {id: 1, title: 'Bills', icon: 'mdi-credit-card'},
            {id: 2, title: 'Friends', icon: 'mdi-account-multiple'},
            {id: 3, title: 'Profile', icon: 'mdi-account'},
            {id: 4, title: 'Sign Out', icon: 'mdi-logout-variant'}
        ],
    }),
    methods: {
        openMenu: function (index) {
            this.activeIndex = index
            this.$emit('menuChanged', index)
        },
    },
    mounted: (a) => {
        console.log(a, 'Mounted')
    }
}
</script>

<style lang="sass" scoped>
.sidenav-container
    height: 100%

.logo-title
    font-weight: bold
    font-size: 22px

.font-montserrat
    font-family: Montserrat

.side-nav-item
    padding: 15px 0px
    color: #a0a2ae
    opacity: 0.7
    transition: opacity 0.15s
    &:hover
        cursor: pointer
        opacity: 1

.nav-item-active
    opacity: 1
    font-weight: bold
</style>