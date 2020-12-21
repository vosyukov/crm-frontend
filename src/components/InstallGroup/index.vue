<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(xs12)
				v-card.elevation-1
					v-card-title.title Группы установки
						v-layout(row, wrap, justify-space-between, align-center)
							v-flex
								form(@submit.prevent="addGroupsInstall")
									v-layout(row, wrap, justify-space-between, align-center)
										v-spacer
										v-flex(lg4)
											v-text-field(v-model='name', label='Имя')
										v-flex(lg2)
											v-spacer
											v-btn.btn-submit(small, color='teal', @click="addGroupsInstall",
													:disabled="!name") Создать
												v-icon(dark) add
					v-data-table(:headers='headers',
							:items='groupsInstall',
							:loading='isLoading',
							no-results-text='Ничего не найдено',
							no-data-text='Нет данных',
							disable-initial-sort,
							hide-actions)
						template(slot='items', slot-scope='props')
							td.text-xs-center {{ props.item.createDate | formateDate }}
							td {{ props.item.groupName }}
							td.text-xs-center
								v-btn(flat, color='pink', icon, @click="deleteGroupsInstall(props.item._id)")
									v-icon delete
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: 'InstallGroup',
	data () {
		return {
			name: null,
			groupsInstall: [],
			headers: [
				{ text: 'Дата создания', align: 'center', value: 'createDate' },
				{ text: 'Имя', align: 'left', value: 'groupName' },
				{ text: 'Действия', sortable: false, align: 'center', value: '' }
			]
		}
	},
	computed: {
		...mapGetters(['isLoading'])
	},
	filters: {
		formateDate (value) {
			if (value) {
				return moment(String(value)).format('DD.MM.YYYY')
			}
		}
	},
	methods: {
		async getGroupsInstall () {
			try {
				this.$store.commit('setLoading', true)
				const res = await axios.post(`${this.$root.SERVER_HOST}/installGroup.get`)
				this.groupsInstall = res.data.items
				this.$store.commit('setLoading', false)
			} catch (err) {
				this.$store.commit('setLoading', false)
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при загрузке данных')
			}
		},
		async addGroupsInstall () {
			if (!this.name) return false
			try {
				this.$store.commit('setLoading', true)
				const newGroupInstall = await axios.post(`${this.$root.SERVER_HOST}/installGroup.add`, {name: this.name})
				this.groupsInstall.push(newGroupInstall.data)
				this.name = null
				this.$store.commit('setLoading', false)
			} catch (err) {
				this.$store.commit('setLoading', false)
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при создании')
			}
		},
		async deleteGroupsInstall (id) {
			try {
				this.$store.commit('setLoading', true)
				await axios.post(`${this.$root.SERVER_HOST}/installGroup.delete`, {id: id})
				let indexDeletedItem = this.groupsInstall.findIndex(item => item._id === id)
				if (indexDeletedItem) {
					this.groupsInstall.splice(indexDeletedItem, 1)
				}
				this.$store.commit('setLoading', false)
			} catch (err) {
				this.$store.commit('setLoading', false)
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при удалении')
			}
		}
	},
	mounted () {
		this.getGroupsInstall()
	}
}
</script>

<style scoped>
.btn-submit {
	color: #fff;
}
</style>
