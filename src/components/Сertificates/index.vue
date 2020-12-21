<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-expansion-panel.mb-3
			v-expansion-panel-content
				div.title(slot="header") Фильтр
				certificate-filter(:statuses='statuses', :numbersTypeGroup="numbersTypeGroup",
													:namesInstallGroup='namesInstallGroup',
													@update='updateCertificates')
		v-card.elevation-1.pa-2
			v-card-title.title Сертификаты
				v-layout(row, wrap, justify-space-between, align-center)
					v-flex(lg4, md5, sm12)
						v-menu(transition='slide-x-transition', bottom, right, v-if='isDisable')
							v-btn(small, slot='activator', color='teal', dark) Добавить
								v-icon(dark) add
							v-list
								v-list-tile(@click='$router.push({name: "NewСertificate", params: {type: "individual"} })')
									v-list-tile-title Физическое лицо
								v-list-tile(@click='$router.push({name: "NewСertificate", params: {type: "legal"} })')
									v-list-tile-title Юридическое лицо
					v-flex(lg1, offset-lg3, md1, sm12)
						v-menu(v-model="menuHeadersCertificates", bottom, offset-y, :close-on-content-click="false")
							v-btn.ma-0(slot='activator', flat, icon, title="Отобразить/Скрыть колонки")
								v-icon(color="teal") visibility_off
							v-card(color="blue", flat)
								v-card-title.white--text.py-2.subheading
									| Отобразить/Скрыть колонки
									v-spacer
									v-btn.ml-4.mr-1(icon, @click='menuHeadersCertificates = false')
										v-icon(color='white', style="font-size: 24px;") clear
								v-list(dense)
									v-list-tile(v-for="item in headers", :key="item.value",
											v-if="item.value !== 'companyName' && item.value !== 'fullName'")
										v-checkbox(v-model="item.isDisplay", :label='item.text', color='blue',
												:value='item.isDisplay', hide-details, @change="saveLastChoice(item)")
					v-flex(lg4, md5, sm12)
						v-text-field(v-model='search', append-icon='search', label='Поиск...')
			v-data-table(:headers='actualHeadersTable',
									:items='certificates',
									:loading='isLoading',
									:search='search',
									no-results-text='Ничего не найдено',
									no-data-text='',
									:rows-per-page-items='[50, 100, 150, {"text":"Все","value":-1}]'
									rows-per-page-text='Строк на странице',
									disable-initial-sort,
									v-model="selectedCertificates",
									select-all,
									item-key='_id'
								)
				v-progress-linear(slot='progress', color='blue darken-3', indeterminate)
				template(slot='items', slot-scope='props')
					td.text-xs-center.px-0
						v-checkbox(v-model="props.selected", primary, hide-details)
					td.text-xs-center.pl-0
						| {{ props.item.companyName ? props.item.companyName : 'Физ.лицо'}}
					td {{ props.item.fullName }}
					td.text-xs-center(v-if="isDisplayColumnInn") {{ props.item.inn }}
					td.text-xs-center(v-if="isDisplayColumnDateCreation")
						| {{ props.item.dateCreation | formateDate }}
					td.text-xs-center(v-if="isDisplayColumnPhone")
						| {{ props.item.client.length ? props.item.client[0].phone : 'Нет КЛ' }}
					td.text-xs-center(v-if="isDisplayColumnEmail")
						| {{ props.item.client.length ? props.item.client[0].email : 'Нет КЛ' }}
					td.text-xs-center(v-if="isDisplayColumnCreator") {{ props.item.creator[0].fullName }}
					td.text-xs-center(v-if="isDisplayColumnExecutor") {{ props.item.executors[0].fullName }}
					td.text-xs-center(v-if="isDisplayColumnStatus")
						v-chip(:color='setColorStatus(props.item.status)', small) {{ formatStatuses(props.item.status) }}
					td.text-xs-center(v-if="isDisplayColumnActions")
						v-btn.mx-0(icon, @click='editCertificate(props.item)')
							v-icon(color='teal darken-1') edit
				template(slot='no-data')
					.headline.text-xs-center.pa-2(v-if='!certificates.length && !isLoading') Нет добавленных сертификатов
					v-alert(:value='true', v-if='isError', color='error', icon='warning') Похоже проихошла ошибка, обновите страницу :(
				template(slot='pageText', slot-scope='{ pageStart, pageStop }') c {{ pageStart }} по {{ pageStop }}
		v-snackbar(bottom, :value="actionSnackbar", :timeout="9999999", color="white", auto-height)
			v-btn.py-1.px-2.ml-1(outline, color="primary", @click="downloadCertificates", :disabled="isDownload",
					:loading="isDownload") Скачать сертификат
			v-btn.py-1.px-2.mr-1(outline, color="teal darken-1", @click="openModalChangeStatus") Изменить статус
		v-dialog(v-model="isModalChangeStatus", max-width="300px")
			v-card
				v-card-text
					v-select(v-model="selectedStatus", :items="itemsStatus", label="Выберите статус",
							item-value="id", item-text="title", dense, :loading="isLoadingChangeStatus")
				v-card-actions
					v-btn(color="pink", flat, @click.stop="isModalChangeStatus = false", :disabled="isLoadingChangeStatus") Отмена
					v-spacer
					v-btn(color="teal darken-1", flat, @click.stop="changeStatusSelectedCertificates",
							:disabled="isLoadingChangeStatus") Применить
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: 'Certificates',
	components: {
		CertificateFilter: () => import('@/assets/components/forms/CertificateFilter')
	},
	data () {
		return {
			search: '',
			isLoading: true,
			isError: false,
			statuses: [],
			numbersTypeGroup: [],
			namesInstallGroup: [],
			headers: [
				{ text: 'Организация', value: 'companyName', align: 'center', isDisplay: true, class: 'pl-0' },
				{ text: 'ФИО владельца', align: 'left', value: 'fullName', isDisplay: true },
				{ text: 'ИНН', value: 'inn', align: 'center', isDisplay: true },
				{ text: 'Дата создания', value: 'dateCreation', align: 'center', isDisplay: true },
				{ text: 'Контактный телефон', sortable: false, value: 'phone', align: 'center', isDisplay: true },
				{ text: 'Контактный email', sortable: false, value: 'email', align: 'center', isDisplay: true },
				{ text: 'Создатель', value: 'creator[0].fullName', align: 'center', isDisplay: true },
				{ text: 'Исполнитель', value: 'executors[0].fullName', align: 'center', isDisplay: true },
				{ text: 'Статус', value: 'status', align: 'center', isDisplay: true },
				{ text: 'Действия', sortable: false, align: 'center', isDisplay: true, value: 'actions' }
			],
			certificates: [],
			statusesColor: [
				{ id: 'work', color: 'blue lighten-4' },
				{ id: 'reg', color: 'purple lighten-4' },
				{ id: 'done', color: 'pink lighten-4' },
				{ id: 'issued', color: 'green lighten-4' },
				{ id: 'problem', color: 'deep-orange lighten-4' },
				{ id: 'is_formed', color: 'yellow lighten-4' },
				{ id: 'request', color: 'teal lighten-4' }
			],
			menuHeadersCertificates: false,
			selectedCertificates: [],
			isDownload: false,
			isModalChangeStatus: false,
			itemsStatus: [],
			selectedStatus: null,
			isLoadingChangeStatus: false
		}
	},
	filters: {
		formateDate (value) {
			if (value) {
				return moment(String(value)).format('DD.MM.YYYY, HH:mm')
			}
		}
	},
	computed: {
		...mapGetters(['role']),
		isDisable () {
			if (this.role === 'remoteExecutor' || this.role === 'executor' || this.role === 'installer') {
				return false
			} else {
				return true
			}
		},
		actualHeadersTable: function () {
			let actualHeaders = this.headers.filter(ad => ad.isDisplay === true)
			return actualHeaders
		},
		isDisplayColumnInn: function () {
			return this.headers.find(ad => ad.value === 'inn').isDisplay
		},
		isDisplayColumnDateCreation: function () {
			return this.headers.find(ad => ad.value === 'dateCreation').isDisplay
		},
		isDisplayColumnPhone: function () {
			return this.headers.find(ad => ad.value === 'phone').isDisplay
		},
		isDisplayColumnEmail: function () {
			return this.headers.find(ad => ad.value === 'email').isDisplay
		},
		isDisplayColumnCreator: function () {
			return this.headers.find(ad => ad.value === 'creator[0].fullName').isDisplay
		},
		isDisplayColumnExecutor: function () {
			return this.headers.find(ad => ad.value === 'executors[0].fullName').isDisplay
		},
		isDisplayColumnStatus: function () {
			return this.headers.find(ad => ad.value === 'status').isDisplay
		},
		isDisplayColumnActions: function () {
			return this.headers.find(ad => ad.value === 'actions').isDisplay
		},
		actionSnackbar: function () {
			return this.selectedCertificates.length
		},
		selectedCertificatesID: function () {
			let selectedID = []
			if (this.selectedCertificates.length) {
				this.selectedCertificates.forEach((certificate) => {
					selectedID.push(certificate._id)
				})
			}
			return selectedID
		}
	},
	methods: {
		editCertificate (item) {
			this.$store.commit('setItemSelectedCertificate', item)
			this.$router.push({name: 'EditСertificate'})
		},
		formatStatuses (value) {
			for (const iterator of this.statuses) {
				if (iterator.id === value) return iterator.title
			}
		},
		setColorStatus (value) {
			for (const iterator of this.statusesColor) {
				if (iterator.id === value) return iterator.color
			}
		},
		async getItemsForSelect () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/certificates.getParametrs`)
			return res.data.items
		},
		async getCertificates () {
			try {
				this.isLoading = true
				const res = await axios.post(`${this.$root.SERVER_HOST}/certificates.get`)
				this.isLoading = false
				return res.data.items
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при получении данных')
				this.isLoading = false
			}
		},
		async updateCertificates (parameters, firstInit = false) {
			try {
				this.isLoading = true
				const res = await axios.post(`${this.$root.SERVER_HOST}/certificates.get`, parameters)
				this.certificates = res.data.items
				this.isLoading = false
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при обновлении')
				this.isLoading = false
			}
		},
		saveLastChoice (item) {
			let lastChoices = JSON.parse(localStorage.getItem('hiddenHeadersCertificates')) || []
			let foundedLastChoice = lastChoices.indexOf(item.value)
			if (item.isDisplay) {
				if (foundedLastChoice !== -1) {
					lastChoices.splice(foundedLastChoice, 1)
				}
			} else {
				lastChoices.push(item.value)
			}
			localStorage.setItem('hiddenHeadersCertificates', JSON.stringify(lastChoices))
		},
		async downloadCertificates () {
			try {
				this.isDownload = true
				console.log('selectedCertificatesID', this.selectedCertificatesID)
				const res = await axios.post(`${this.$root.SERVER_HOST}/certificates.getLinkArhivedCert`, {ids: this.selectedCertificatesID})
				console.log(res)
				this.selectedCertificates = []
				this.isDownload = false
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Не удалось скачать сертификаты')
				this.isDownload = false
			}
		},
		openModalChangeStatus () {
			this.selectedStatus = null
			this.isModalChangeStatus = true
		},
		async changeStatusSelectedCertificates () {
			try {
				this.isLoadingChangeStatus = true
				await axios.post(`${this.$root.SERVER_HOST}/certificates.updateStatus`, {
					ids: this.selectedCertificatesID,
					status: this.selectedStatus
				})
				this.selectedStatus = []
				this.$store.commit('showSuccessMessage', 'Статус изменен')
				this.isLoadingChangeStatus = false
			} catch (err) {
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Не удалось изменить статус')
				this.isLoadingChangeStatus = false
			}
		}
	},
	async mounted () {
		try {
			this.isLoading = true
			let lastChoices = JSON.parse(localStorage.getItem('hiddenHeadersCertificates')) || []
			if (lastChoices) {
				lastChoices.forEach(lc => {
					this.headers.find(h => h.value === lc).isDisplay = false
				})
			}
			let lastSelectedFilter = JSON.parse(localStorage.getItem('lastSelectedFilter'))
			if (!lastSelectedFilter) {
				this.certificates = await this.getCertificates()
			} else {
				this.updateCertificates(lastSelectedFilter)
			}
			let itemsForSelect = await this.getItemsForSelect()
			this.statuses = itemsForSelect.statusCert
			this.numbersTypeGroup = itemsForSelect.numbersTypeGroup
			this.namesInstallGroup = itemsForSelect.namesInstallGroup
			this.itemsStatus = itemsForSelect.statusCert
		} catch (err) {
			this.$store.commit('setError', err)
			this.$store.commit('showErorrMessage', 'Произошла ошибка при загрузке')
			this.isError = true
			this.isLoading = false
		}
	}
}
</script>
