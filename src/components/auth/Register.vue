<template>
    <v-main class="auth-container">
        <div class="auth-content">
            <div class="d-flex signin-container font-montserrat">
                <div class="left-container d-flex align-center">
                    <div class="left-content">
                        <h2 class="title-text text-center">Register to Splitly</h2>
                        <div class="mt-12">
                            <div>
                                <v-text-field
                                    v-model="username"
                                    label="Username"
                                    :error-messages="usernameErrors"
                                    @input="$v.username.$touch()"
                                    @blur="$v.username.$touch()"
                                    solo
                                    prepend-inner-icon="mdi-account-circle-outline">
                                </v-text-field>
                            </div>
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
                                    Register
                                </v-btn>
                            </div>
                            <div class="mt-8">
                                <small>Already have an account? <router-link to="/sign-in">Sign in here</router-link></small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-container d-flex align-center">
                    <div class="right-content px-4 text-center">
                        <h2>Hello Friend</h2>
                        <div class="mt-8">
                            To starts your journey with us, please enter your personal details
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </v-main>
</template>

<script>
import { apiHelper } from '../../utilities/ApiHelper'
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
    props: [],
    data: () => ({
        username: '',
        email: '',
        password: '',
        isPasswordShown: false,
        isErrorShown: false,
        errorMessage: '',
    }),
    validations: {
        username: {
            required,
            minLength: minLength(6)
        },
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
        usernameErrors () {
            const errors = []
            if (!this.$v.username.$dirty) return errors
            !this.$v.username.required && errors.push('Username is required')
            !this.$v.username.minLength && errors.push('Username must be at least 6 characters')
            return errors
        },
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
        onSubmit: function () {
            this.$v.$touch()
            if (this.$v.$invalid) return

            const headers = {
                'Content-Type': 'application/json'
            }

            const data = {
                username: this.username,
                email: this.email,
                password: this.password
            }
            apiHelper.post('/api/auth/register', headers, JSON.stringify(data), this.callback, this.fallback)
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
        width: 65%
        height: 100%
        background-color: #ffffff
        border-radius: 10px 0px 0px 10px

        .left-content
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
    
    .right-container
        background-image: linear-gradient(to bottom left, #24a19c, #6ebfb5)
        width: 35%
        height: 100%
        border-radius: 0px 10px 10px 0px
        color: #ffffff

        .right-content
            width: 100%       

.logo-title
    font-size: 18px

.font-montserrat
    font-family: Montserrat
</style>