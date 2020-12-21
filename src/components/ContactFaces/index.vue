<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(xs12)
				v-card.elevation-1
					v-card-title.title Контактные лица
						v-layout(row, wrap, justify-space-between, align-center)
							v-flex(lg4, md5, sm12)
								v-btn(small, color='teal', dark, @click='$router.push({name: "NewContactFace"})') Добавить
									v-icon(dark) add
							v-flex(lg4, md5, sm12)
								v-text-field(v-model='search', append-icon='search', label='Поиск...')
					v-data-table(:headers='headers',
											:items='contactFaces',
											:loading='isLoading',
											:search='search',
											no-results-text='Ничего не найдено',
											no-data-text='Нет данных',
											disable-initial-sort,
											hide-actions)
						v-progress-linear(slot='progress', color='blue darken-3', indeterminate)
						template(slot='items', slot-scope='props')
							td {{ props.item.fullName }}
							td.text-xs-center {{ props.item.post }}
							td.text-xs-center {{ props.item.email }}
							td.text-xs-center {{ props.item.phone }}
							td.justify-center.layout.px-0
								v-btn.mx-0(icon, @click='editContactFace(props.item)', :disabled='isDisabled')
									v-icon(color='teal') edit
								v-btn.mx-0(icon, @click='showModal(props.item)', :disabled='isDisabled')
									v-icon(color='pink') delete
						template(slot='no-data')
							.headline.text-xs-center.pa-2(v-if='!contactFaces.length') Нет добавленных контактных лиц
							v-alert(:value='true', v-if='isError', color='error', icon='warning') Похоже проихошла ошибка, обновите страницу :(
			delete-modal(:dialog='dialog',
									:item='itemForModal',
									@notDeleted='dialog = false',
									@delete='deleteContactFace')
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
	name: 'ContactFaces',
	components: {
		DeleteModal: () => import('@/assets/components/DeleteModal')
	},
	data () {
		return {
			search: '',
			dialog: false,
			isLoading: false,
			isError: false,
			itemForModal: {},
			headers: [
				{ text: 'ФИО', align: 'left', value: 'fullName' },
				{ text: 'Должность', value: 'post', align: 'center' },
				{ text: 'Email', sortable: false, value: 'email', align: 'center' },
				{ text: 'Телефон', sortable: false, value: 'phone', align: 'center' },
				{ text: 'Действия', sortable: false, align: 'center' }
			],
			contactFaces: []
		}
	},
	computed: {
		...mapGetters(['role']),
		isDisabled () {
			return this.role === 'manager'
		}
	},
	methods: {
		showModal (item) {
			this.itemForModal = item
			this.dialog = true
		},
		editContactFace (item) {
			this.$router.push({name: 'EditContactFace'})
			this.$store.commit('setItemSelectedContactFace', item)
		},
		async deleteContactFace (contactFace) {
			try {
				this.isLoading = true
				await axios.post(`${this.$root.SERVER_HOST}/clients.delete`, { id: contactFace._id })
				this.contactFaces.splice(this.contactFaces.indexOf(contactFace), 1)
				this.isLoading = false
				this.dialog = false
				this.$store.commit('showSuccessMessage', 'Контактное лицо успешно удалено')
			} catch (err) {
				this.isLoading = false
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при удалении контактного лица')
			}
		},
		async getContactFaces () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/clients.get`)
			return res.data.clients
		}
	},
	async mounted () {
		try {
			this.isLoading = true
			this.contactFaces = await this.getContactFaces()
			this.isLoading = false
		} catch (err) {
			this.isLoading = false
			this.$store.commit('setError', err)
			this.$store.commit('showErorrMessage', 'Произошла ошибка при загрузке')
			this.isError = true
		}
	}
}
</script>
