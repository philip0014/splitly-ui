<template>
    <div class="d-flex signin-container font-montserrat">
        <div class="left-container d-flex align-center">
            <div class="left-content px-4 text-center">
                <h2>Welcome Back</h2>
                <div class="mt-8">
                    To keep connected, please login with your personal info
                </div>
            </div>
        </div>
        <div class="right-container d-flex align-center">
            <div class="right-content text-center">
                <h2 class="title-text">Sign In to Splitly</h2>
                <div class="mt-12 text-left">
                    <div>
                        <v-text-field
                            v-model="email"
                            label="Email"
                            :rules="emailRules"
                            solo
                            prepend-inner-icon="mdi-email-outline">
                        </v-text-field>
                    </div>
                    <div>
                        <v-text-field
                            v-model="password"
                            label="Password"
                            :append-icon="isPasswordShown ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="isPasswordShown ? 'text' : 'password'"
                            :rules="passwordRules"
                            solo
                            @click:append="isPasswordShown = !isPasswordShown"
                            prepend-inner-icon="mdi-lock-outline">
                        </v-text-field>
                    </div>
                    <div class="mt-2">
                        <v-btn
                            color="primary"
                            width="100%"
                            @click="onSubmit()">
                            Sign In
                        </v-btn>
                    </div>
                    <div class="mt-4 text-center">
                        <small>or sign in with another method</small>
                    </div>
                    <div class="mt-4 text-center">
                        <GoogleLogin class="v-btn v-btn--contained theme--dark v-size--default google-red"
                            :params="googleParams"
                            :onSuccess="onSuccess"
                            :onFailure="onFailure">
                            <v-icon color="#ffffff" left>mdi-google</v-icon> Google
                        </GoogleLogin>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GoogleLogin from 'vue-google-login'
import { apiHelper } from '../../utilities/ApiHelper'

export default {
    components: {
        GoogleLogin
    },
    props: [],
    data: () => ({
        email: '',
        password: '',
        isPasswordShown: false,
        emailRules: [
            value => !!value || 'Required.',
        ],
        passwordRules: [
            value => !!value || 'Required.',
            value => (value && value.length >= 8) || 'Min 8 characters',
        ],
        googleParams: {
            client_id: '755421501309-erl8sa383vvvl0o17ds33veen6lkpd64.apps.googleusercontent.com'
        }
    }),
    methods: {
        onSuccess: function (response) {
            const data = {
                userIdToken: response.wc.id_token
            }
            
            const callback = (function (response) {
                this.$emit('signedIn', response.accessToken, response.user)
            }).bind(this);

            const fallback = function (error) {
                console.log(error);
            }
            apiHelper.fetchApi('POST', '/api/auth/google', data, callback, fallback);
        },
        onFailure: function (error) {
            console.log(error)
        },
        onSubmit: function () {
            console.log(this.email, this.password)
        }
    }
}
</script>

<style lang="sass" scoped>
.signin-container
    height: 100%

    .left-container
        background-image: linear-gradient(to bottom right, #24a19c, #6ebfb5)
        width: 35%
        height: 100%
        border-radius: 10px 0px 0px 10px
        color: #ffffff

        .left-content
            width: 100%
    
    .right-container
        width: 65%
        height: 100%

        .right-content
            width: 100%
            padding: 0 80px

            .title-text
                color: #24a19c
                font-weight: bold
            
            button:focus
                outline: 0
                

.logo-title
    font-size: 18px

.font-montserrat
    font-family: Montserrat
</style>