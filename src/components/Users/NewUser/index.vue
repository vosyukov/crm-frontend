<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(lg6 md8 sm12)
				v-card.elevation-1
					v-card-title.title Добавление нового пользователя
					v-container(fill-height, fluid)
						v-layout(fill-height)
							v-flex(xs12)
								user-form(:parameters='parameters',
													@submit='addUser')
</template>

<script>
import axios from 'axios'

export default {
	name: 'NewUser',
	components: {
		UserForm: () => import('@/assets/components/forms/UserForm')
	},
	data () {
		return {
			parameters: {
				fullName: '',
				role: '',
				phone: '',
				password: ''
			}
		}
	},
	methods: {
		async addUser (parameters) {
			try {
				await axios.post(`${this.$root.SERVER_HOST}/users.add`, parameters)
				this.$router.go(-1)
				this.$store.commit('showSuccessMessage', 'Пользователь успешно добавлен')
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при добавлении пользователя')
			}
		}
	}
}
</script>
