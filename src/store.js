import Vue from 'vue'
import Vuex from 'vuex'
import LE from '../static/le.min.js'

LE.init('fa4a8ca6-d6f9-4c5f-911c-25b63648fef5')

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		isLogin: localStorage.getItem('JWT'),
		snackbar: {
			isActive: false,
			color: '',
			text: ''
		},
		user: {},
		itemSelectedUser: {},
		itemSelectedContactFace: {},
		itemSelectedCertificate: {},
		isLoading: false
	},
	getters: {
		role (state) {
			return state.user.role
		},
		userName (state) {
			return state.user.fullName
		},
		files (state) {
			return state.itemSelectedCertificate.attachedFiles
		},
		filesCertificate (state) {
			return state.itemSelectedCertificate.attachedCert
		},
		isLoading (state) {
			return state.isLoading
		}
	},
	mutations: {
		showErorrMessage (state, text) {
			state.snackbar.isActive = true
			state.snackbar.color = 'red darken-1'
			state.snackbar.text = text
		},
		showSuccessMessage (state, text) {
			state.snackbar.isActive = true
			state.snackbar.color = 'green darken-1'
			state.snackbar.text = text
		},
		setError (err) {
			LE.error(err)
			console.log(err)
		},
		setItemSelectedUser (state, item) {
			state.itemSelectedUser = item
		},
		setItemSelectedContactFace (state, item) {
			state.itemSelectedContactFace = item
		},
		setItemSelectedCertificate (state, item) {
			state.itemSelectedCertificate = item
		},
		setIsLogin (state, value) {
			state.isLogin = value
		},
		setUser (state, value) {
			state.user = value
		},
		setFileCertificate (state, files) {
			for (let i = 0; i < files.length; i++) {
				state.itemSelectedCertificate.attachedCert.push(files[i])
			}
		},
		setFilePaths (state, files) {
			state.itemSelectedCertificate.filePaths = []
			for (const iterator of files) {
				state.itemSelectedCertificate.filePaths.push(iterator.webkitRelativePath)
			}
		},
		deleteFileCertificate (state, index) {
			state.itemSelectedCertificate.attachedCert.splice(index, 1)
		},
		setLoading (state, value) {
			state.isLoading = value
		}
	},
	srtict: process.env.NODE_ENV !== 'production'
})
