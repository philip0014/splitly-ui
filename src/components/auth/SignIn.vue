<template>
    <v-main class="auth-container">
        <div class="auth-content">
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
                    <div class="right-content">
                        <h2 class="title-text text-center">Sign In to Splitly</h2>
                        <div class="mt-12">
                            <div>
                                <v-text-field
                                    v-model="email"
                                    label="Email"
                                    :error-messages="emailErrors"
                                    @input="$v.email.$touch()"
                                    @blur="$v.email.$touch()"
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
                                    :error-messages="passwordErrors"
                                    @input="$v.password.$touch()"
                                    @blur="$v.password.$touch()"
                                    solo
                                    @click:append="isPasswordShown = !isPasswordShown"
                                    prepend-inner-icon="mdi-lock-outline">
                                </v-text-field>
                            </div>
                            <div v-if="isErrorShown" class="text-center error--text">
                                <small>{{ errorMessage }}</small>
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
                            <div class="mt-8">
                                <small>Don't have an account yet? <router-link to="/register">Register here</router-link></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </v-main>
</template>

<script>
import GoogleLogin from 'vue-google-login'
import { apiHelper } from '../../utilities/ApiHelper'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
    components: {
        GoogleLogin
    },
    data: () => ({
        email: '',
        password: '',
        isPasswordShown: false,
        isErrorShown: false,
        errorMessage: '',
        googleParams: {
            client_id: 'GOOGLE_CLIENT_ID'
        }
    }),
    validations: {
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(6)
        }
    },
    computed: {
        emailErrors () {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('Email is required')
            !this.$v.email.email && errors.push('Email is not valid')
            return errors
        },
        passwordErrors () {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.required && errors.push('Password is required')
            !this.$v.password.minLength && errors.push('Password must be at least 6 characters')
            return errors
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = this.$cookie.get('profile')
        if (this.accessToken != null && this.profile != null) {
            this.$router.push('/')
        }
    },
    methods: {
        callback: function (response) {
            this.$cookie.set('accessToken', response.accessToken, 1)
            this.$cookie.set('profile', JSON.stringify(response.user), 1)
            this.$router.push('/')
        },
        fallback: function (error) {
            this.isErrorShown = true
            this.errorMessage = error
        },
        onSuccess: function (response) {
            const headers = {
                'Content-Type': 'application/json'
            }

            const data = {
                userIdToken: response.wc.id_token
            }
            apiHelper.post('/api/auth/google', headers, JSON.stringify(data), this.callback, this.fallback)
        },
        onFailure: function (error) {
            console.log(error)
        },
        onSubmit: function () {
            this.$v.$touch()
            if (this.$v.$invalid) return

            const headers = {
                'Content-Type': 'application/json'
            }
            
            const data = {
                email: this.email,
                password: this.password
            }
            apiHelper.post('/api/auth/signIn', headers, JSON.stringify(data), this.callback, this.fallback)
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
    background-image: url('../../assets/auth-bg.png')
    background-repeat: no-repeat
    background-size: auto
    background-position: center

.auth-content
    width: 70%
    max-width: 900px
    height: 600px
    margin: auto
    border-radius: 10px
    box-shadow: 0px 0px 10px #a0a2ae

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
        background-color: #ffffff
        border-radius: 0px 10px 10px 0px

        .right-content
            width: 100%
            padding: 0 80px

            .title-text
                color: #24a19c
                font-weight: bold
            
            button:focus
                outline: 0

            a:hover
                text-decoration: none
                font-weight: bold
                

.logo-title
    font-size: 18px

.font-montserrat
    font-family: Montserrat
</style>