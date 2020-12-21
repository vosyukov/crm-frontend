<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(lg6, md8, sm12)
				v-card.elevation-1
					v-card-title.title Редактирование контактного лица
					v-container(fill-height, fluid)
						v-layout(fill-height)
							v-flex(xs12)
								contact-face-form(:parameters='itemContactFace',
																	@submit='updateContactFace')
</template>

<script>
import axios from 'axios'

export default {
	name: 'EditContactFace',
	components: {
		ContactFaceForm: () => import('@/assets/components/forms/ContactFaceForm')
	},
	computed: {
		itemContactFace () {
			return this.$store.state.itemSelectedContactFace
		}
	},
	methods: {
		async updateContactFace (parameters) {
			try {
				await axios.post(`${this.$root.SERVER_HOST}/clients.update`, parameters)
				this.$router.go(-1)
				this.$store.commit('showSuccessMessage', 'Контактное лицо успешно отредактировано')
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при редактировании контактного лица')
			}
		}
	}
}
</script>
