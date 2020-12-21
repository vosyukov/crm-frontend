<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(xs12)
				v-card.elevation-1
					v-card-title.title Пользователи
						v-layout(row, wrap, justify-space-between, align-center)
							v-flex(lg4, md5, sm12)
								v-btn(small, color='teal', dark, @click='$router.push({name: "NewUser"})') Добавить
									v-icon(dark) add
							v-flex(lg4, md5, sm12)
								v-text-field(v-model='search', append-icon='search', label='Поиск...')
					v-data-table(:headers='headers',
											:items='users',
											:loading='isLoading',
											:search='search',
											no-results-text='Ничего не найдено',
											no-data-text='Нет данных',
											disable-initial-sort,
											hide-actions)
						v-progress-linear(slot='progress', color='blue darken-3', indeterminate)
						template(slot='items', slot-scope='props')
							td {{ props.item.fullName }}
							td.text-xs-center {{ formatUserRoles(props.item.role) }}
							td.text-xs-center {{ props.item.phone }}
							td.text-xs-center {{ props.item.dateCreation | formateDate }}
							td.justify-center.layout.px-0
								v-btn.mx-0(icon, @click='editUser(props.item)')
									v-icon(color='teal') edit
								v-btn.mx-0(icon, @click='showModal(props.item)')
									v-icon(color='pink') delete
						template(slot='no-data')
							.headline.text-xs-center.pa-2(v-if='!users.length') Нет добавленных пользователей
							v-alert(:value='true', v-if='isError', color='error', icon='warning') Похоже проихошла ошибка, обновите страницу :(
			delete-modal(:dialog='dialog',
									:item='itemForModal',
									name='пользователя'
									@notDeleted='dialog = false'
									@delete='deleteUser')
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
	name: 'Users',
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
				{ text: 'Роль', value: 'role', align: 'center' },
				{ text: 'Контактный номер', sortable: false, value: 'phone', align: 'center' },
				{ text: 'Дата создания', value: 'dateCreation', align: 'center' },
				{ text: 'Действия', sortable: false, align: 'center' }
			],
			users: [],
			roles: []
		}
	},
	filters: {
		formateDate (value) {
			if (value) {
				return moment(String(value)).format('DD.MM.YYYY')
			}
		}
	},
	methods: {
		showModal (item) {
			this.itemForModal = item
			this.dialog = true
		},
		editUser (item) {
			this.$router.push({name: 'EditUser'})
			this.$store.commit('setItemSelectedUser', item)
		},
		formatUserRoles (value) {
			for (const iterator of this.roles) {
				if (iterator.id === value) return iterator.title
			}
		},
		async getRoles () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/users.getRoles`)
			return res.data.roles
		},
		async deleteUser (user) {
			try {
				this.isLoading = true
				await axios.post(`${this.$root.SERVER_HOST}/users.delete`, { id: user._id })
				this.users.splice(this.users.indexOf(user), 1)
				this.isLoading = false
				this.dialog = false
				this.$store.commit('showSuccessMessage', 'Пользователь успешно удален')
			} catch (err) {
				this.isLoading = false
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при удалении пользователя')
			}
		},
		async getUsers () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/users.get`)
			return res.data.users
		}
	},
	async mounted () {
		try {
			this.isLoading = true
			this.users = await this.getUsers()
			this.roles = await this.getRoles()
			this.isLoading = false
		} catch (err) {
			this.isLoading = false
			this.$store.commit('setError', err)
			this.$store.commit('showErorrMessage', 'Произошла ошибка при загрузке')
		}
	}
}
</script>
