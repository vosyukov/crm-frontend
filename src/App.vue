<template lang='pug'>
	#app
		v-app#inspire
			v-navigation-drawer(fixed, clipped, app, v-if='isLogin', width='220', v-model='drawer')
				v-list(dense)
					template(v-for='item in items')
						v-layout(v-if='item.heading', :key='item.heading', row, align-center)
							v-flex(xs6)
								v-subheader(v-if='item.heading') {{ item.heading }}
						v-list-tile(v-else, :key='item.text', :disabled='isDisabled(item.canRead)', @click='$router.push({name: item.link})')
							v-list-tile-action
								v-icon(:color='item.color') {{ item.icon }}
							v-list-tile-content
								v-list-tile-title {{ item.text }}
			v-toolbar(v-if='isLogin', color='blue darken-3', dense, fixed, clipped-left, app, dark)
				v-toolbar-title.ml-0.pl-3(style='width: 300px')
					v-toolbar-side-icon(@click.stop='drawer = !drawer')
					span ЗИС-CRM
				v-spacer
				span.subheading {{ userName }}
				v-btn(icon, @click='logout')
					v-icon(medium) exit_to_app
			v-content
				transition(name='fade-transition', mode='out-in')
					router-view
		snackbar
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
const jwtDecode = require('jwt-decode')

export default {
	name: 'App',
	components: {
		Snackbar: () => import('@/assets/components/Snackbar')
	},
	data () {
		return {
			drawer: null,
			items: [
				{ icon: 'chrome_reader_mode', text: 'Сертификаты', color: 'blue darken-3', link: 'Certificates', canRead: ['admin', 'manager', 'remoteExecutor', 'executor', 'installer'] },
				{ icon: 'contacts', text: 'Контактные лица', color: 'deep-purple darken-3', link: 'ContactFaces', canRead: ['admin', 'manager'] },
				{ icon: 'people', text: 'Пользователи', color: 'teal darken-3', link: 'Users', canRead: ['admin', 'manager'] },
				{ icon: 'group_add', text: 'Группы установки', color: 'teal darken-3', link: 'InstallGroup', canRead: ['admin', 'manager'] }
			]
		}
	},
	computed: {
		...mapGetters(['role', 'userName']),
		isLogin () {
			return this.$store.state.isLogin
		}
	},
	methods: {
		logout () {
			this.$store.commit('setIsLogin', false)
			this.deleteJWT()
			this.$router.push({ name: 'Login' })
		},
		isDisabled (array) {
			if (array.indexOf(this.role) === -1) {
				return true
			} else {
				return false
			}
		},
		deleteJWT () {
			localStorage.removeItem('JWT')
		},
		decoderJWT (jwt) {
			return jwtDecode(jwt)
		},
		setAutorizationHeader (jwt) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
		}
	},
	created () {
		const jwt = localStorage.getItem('JWT')
		if (jwt) {
			this.$store.commit('setUser', this.decoderJWT(jwt))
			this.setAutorizationHeader(jwt)
		} else {
			this.$router.push({ name: 'Login' })
		}
	}
}
</script>

<style lang='scss'>
$material-icons-font-path: '~material-icons/iconfont/';
@import '~material-icons/iconfont/material-icons.scss';
@import './assets/fonts/stylesheet.scss';
</style>
