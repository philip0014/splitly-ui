<template>
    <v-main class="profile-container">
        <div class="profile-header d-flex justify-center">
            <div class="text-center">
                <div class="profile-username">{{ profile.username }}</div>
                <div class="profile-email">{{ profile.email }}</div>
            </div>
            <div class="shade-container"></div>
            <div class="avatar-container">
                <v-avatar size="160">
                    <img :src="profile.profileUrl" :alt="profile.username">
                </v-avatar>
            </div>
        </div>
        <div class="profile-detail">
            <v-text-field
                v-model="username"
                label="Username"
                :error-messages="usernameErrors"
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
                dense
                outlined>
            </v-text-field>
            <div class="mt-4">
                <v-text-field
                    v-model="password"
                    label="New Password"
                    placeholder="Your new password here"
                    type="password"
                    :error-messages="passwordErrors"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    dense
                    outlined>
                </v-text-field>
                <v-text-field
                    v-model="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                    :error-messages="confirmPasswordErrors"
                    @input="$v.confirmPassword.$touch()"
                    @blur="$v.confirmPassword.$touch()"
                    dense
                    outlined>
                </v-text-field>
            </div>
            <div class="mt-4">
                <v-file-input
                    v-model="imageFile"
                    label="Profile Image"
                    placeholder="Choose your profile image"
                    prepend-icon="mdi-camera"
                    dense
                    outlined>
                </v-file-input>
            </div>
            <div class="mt-4">
                <v-row no-gutters>
                    <v-btn
                        width="100%"
                        color="primary"
                        @click="onUpdateProfile()">
                        Update Profile
                    </v-btn>
                </v-row>
            </div>
        </div>
    </v-main>
</template>

<script>
import { apiHelper } from '../utilities/ApiHelper'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
    data: () => ({
        accessToken: '',
        username: '',
        password: '',
        confirmPassword: '',
        imageFile: null,
        profile: {}
    }),
    validations: {
        username: {
            required,
            minLength: minLength(6)
        },
        password: {
            minLength: minLength(6)
        },
        confirmPassword: {
            sameAs: sameAs('password')
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
        passwordErrors () {
            const errors = []
            if (!this.$v.password.$dirty) return errors
            !this.$v.password.minLength && errors.push('Password must be at least 6 characters')
            return errors
        },
        confirmPasswordErrors () {
            const errors = []
            if (!this.$v.confirmPassword.$dirty) return errors
            !this.$v.confirmPassword.sameAs && errors.push('Confirm password does not match')
            return errors
        }
    },
    methods: {
        onUpdateProfile: function () {
            this.$v.$touch()
            if (this.$v.$invalid) return

            const headers = {
                'Authorization': 'Bearer ' + this.accessToken
            }

            const callback = (function (response) {
                this.profile = response
                this.username = this.profile.username
                this.$cookie.set('profile', JSON.stringify(response), 1)
            }).bind(this)

            const fallback = (function (error) {
                console.log(error)
            }).bind(this)

            var data = new FormData()
            data.append("username", this.username)
            if (this.imageFile !== null && this.imageFile !== undefined) {
                data.append("image", this.imageFile)
            }
            data.append("password", this.password)
            data.append("confirmPassword", this.confirmPassword)

            apiHelper.put('/api/profile', headers, data, callback, fallback)
        }
    },
    mounted: function () {
        this.accessToken = this.$cookie.get('accessToken')
        this.profile = JSON.parse(this.$cookie.get('profile'))

        this.username = this.profile.username
    }
}
</script>

<style lang="sass" scoped>
.profile-container
    height: 100%
    .profile-header
        padding-top: 50px
        padding-bottom: 110px
        background-image: url('../assets/profile-bg.png')
        background-repeat: no-repeat
        background-size: auto
        background-position: center
        position: relative
        .profile-username
            font-size: 34px
        .profile-email
            opacity: 0.8
        .shade-container
            position: absolute
            width: 100%
            height: 80px
            bottom: 0
            background-image: linear-gradient(to bottom, rgba(0,0,0,0), #fafafa)
        .avatar-container
            position: absolute
            bottom: -80px
            img
                object-fit: cover
    .profile-detail
        width: 550px
        margin: 0 auto
        margin-top: 120px
        button:focus
            outline: 0
</style>