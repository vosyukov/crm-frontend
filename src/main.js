// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import { store } from './store'
import { SERVER_HOST } from './config'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(Vuex)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	data () {
		return {
			SERVER_HOST
		}
	},
	router,
	store,
	components: { App },
	template: '<App/>'
})

router.beforeEach((to, from, next) => {
	if (isAccessAlow(to.name)) {
		next()
	} else {
		next(from.fullPath)
		store.commit('showErorrMessage', 'Недостаточно прав')
	}
})

const isAccessAlow = path => {
	const role = store.getters.role
	const prohibitedExecutorPaths = [ 'Users', 'EditUser', 'NewUser', 'ContactFaces', 'NewContactFace', 'EditContactFace', 'NewСertificate' ]
	const prohibitedRemoteExecutorPaths = [ ...prohibitedExecutorPaths ]
	const prohibitedInstallerPaths = [ ...prohibitedExecutorPaths ]

	const isAllow = (paths, path) => {
		return paths.indexOf(path) === -1
	}

	if (role === 'admin') {
		return true
	}

	if (role === 'manager') {
		return true
	}

	if (role === 'remoteExecutor') {
		if (isAllow(prohibitedExecutorPaths, path)) {
			return true
		}
	}

	if (role === 'executor') {
		if (isAllow(prohibitedRemoteExecutorPaths, path)) {
			return true
		}
	}

	if (role === 'installer') {
		if (isAllow(prohibitedInstallerPaths, path)) {
			return true
		}
	}
	return false
}
