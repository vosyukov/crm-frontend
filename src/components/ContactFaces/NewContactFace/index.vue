<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(lg6 md8 sm12)
				v-card.elevation-1
					v-card-title.title Новое контактное лицо
					v-container(fill-height, fluid)
						v-layout(fill-height)
							v-flex(xs12)
								contact-face-form(:parameters='parameters',
																	@submit='addContactFace')
</template>

<script>
import axios from 'axios'

export default {
	name: 'NewContactFace',
	components: {
		ContactFaceForm: () => import('@/assets/components/forms/ContactFaceForm')
	},
	data () {
		return {
			parameters: {
				fullName: '',
				position: '',
				phone: '',
				email: ''
			}
		}
	},
	methods: {
		async addContactFace (parameters) {
			try {
				await axios.post(`${this.$root.SERVER_HOST}/clients.add`, parameters)
				this.$router.go(-1)
				this.$store.commit('showSuccessMessage', 'Контактное лицо успешно добавлено')
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при добавлении контактного лица')
			}
		}
	}
}
</script>
