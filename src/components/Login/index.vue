<template lang="pug">
	v-container(fluid, align-center, justify-center, fill-height)
		v-layout(align-center, justify-center)
			v-flex(lg4, md7, sm9, xs12)
				v-card.elevation-1
					v-card-title.title Вход
					v-container(fill-height, fluid)
						v-layout(fill-height)
							v-flex(xs12)
								v-form(ref='form', v-model='valid')
									v-text-field(v-model='phone',
															type='tel',
															:rules='phoneRules',
															label='Контактный телефон',
															validate-on-blur,
															:error='isError',
															:mask="'# (###) ###-##-##'",
															@change='deleteErrorMessage',
															required)
									v-text-field(v-model='password',
															:append-icon="iconEye ? 'visibility' : 'visibility_off'",
															:append-icon-cb='() => (iconEye = !iconEye)',
															:type="iconEye ? 'password' : 'text'",
															:rules="[v => !!v || 'Введите пароль']",
															name='input-10-1',
															label='Пароль',
															:error='isError',
															@change='deleteErrorMessage',
															required)
									v-alert(:value="true", type="error", v-if='isError') Неправильный номер телефона или пароль
									v-layout
										v-spacer
										v-btn(:disabled='!valid',
													color='teal lighten-2',
													type='submit',
													@click.prevent="login(phone, password)",
													@keyup.enter.prevent="login(phone, password)") Войти
</template>

<script>
import axios from 'axios'
const jwtDecode = require('jwt-decode')

export default {
	name: 'Login',
	data () {
		return {
			phone: null,
			password: null,
			valid: false,
			checkbox: false,
			iconEye: true,
			isError: false,
			phoneRules: [
				v => !!v || 'Введите номер',
				v => v.length === 11 || 'Введите номер полностью'
			]
		}
	},
	methods: {
		async getJWT (phone, password) {
			try {
				const res = await axios.post(`${this.$root.SERVER_HOST}/users.login`, {phone, password})
				const jwt = res.data.jwt
				return jwt
			} catch (err) {
				this.$store.commit('setError', err)
				return null
			}
		},
		saveJWT (jwt) {
			localStorage.setItem('JWT', jwt)
		},
		decoderJWT (jwt) {
			return jwtDecode(jwt)
		},
		setAutorizationHeader (jwt) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
		},
		async login (phone, password) {
			const JWT = await this.getJWT(phone, password)
			if (JWT) {
				this.saveJWT(JWT)
				this.setAutorizationHeader(JWT)
				this.$store.commit('setUser', this.decoderJWT(JWT))
				this.$store.commit('setIsLogin', true)
				this.$router.push({ name: 'Certificates' })
			} else {
				this.isError = true
				this.isError = true
				this.$store.commit('showErorrMessage', 'Не удалось авторизоваться')
			}
		},
		deleteErrorMessage () {
			if (this.isError) {
				this.isError = false
			}
		}
	}
}
</script>
