<template>
    <v-main class="auth-container">
        <div class="auth-content">
            <SignIn v-on:signedIn="signIn" v-if="state === 1"/>
            <Register v-on:registered="signIn" v-if="state === 2"/>
        </div>
    </v-main>
</template>

<script>
import SignIn from './SignIn';
import Register from './Register';

export default {
    components: {
        SignIn,
        Register,
    },
    data: () => ({
        state: 1
    }),
    methods: {
        signIn: function (accessToken, profile) {
            this.$emit('signedIn', accessToken, profile)
        }
    }
}
</script>

<style lang="sass" scoped>
.auth-container
    height: 100%
    display: flex
    align-items: center
    justify-content: center

.auth-content
    width: 70%
    max-width: 900px
    height: 600px
    margin: auto
    border-radius: 10px
    box-shadow: 0px 0px 10px #a0a2ae
</style>