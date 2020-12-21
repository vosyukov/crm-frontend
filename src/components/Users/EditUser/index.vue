<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(lg6, md8, sm12)
				v-card.elevation-1
					v-card-title.title Редактирование пользователя
					v-container(fill-height, fluid)
						v-layout(fill-height)
							v-flex(xs12)
								user-form(:parameters='itemUser',
													@submit='updateUser')
</template>

<script>
import axios from 'axios'

export default {
	name: 'EditUser',
	components: {
		UserForm: () => import('@/assets/components/forms/UserForm')
	},
	computed: {
		itemUser () {
			return this.$store.state.itemSelectedUser
		}
	},
	methods: {
		async updateUser (parameters) {
			try {
				await axios.post(`${this.$root.SERVER_HOST}/users.update`, parameters)
				this.$router.go(-1)
				this.$store.commit('showSuccessMessage', 'Пользователь успешно отредактирован')
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при редактировании пользователя')
			}
		}
	}
}
</script>
