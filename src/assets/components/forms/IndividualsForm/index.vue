<template lang="pug">
	v-form(ref='form', v-model='valid')
		v-card.elevation-6
			v-card-title.title Данные о сертификате #[v-subheader(v-if='parameters.dateCreation') (создан: {{ parameters.dateCreation | formateDate }})]
			v-container.mb-4(fill-height, fluid, grid-list-xl)
				v-layout(fill-height, wrap, row)
					v-flex(lg6, sm12)
						v-text-field(v-model='parameters.fullName',
												:rules="[v => !!v || 'Введите ФИО']",
												label='ФИО',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.passport',
												hint='Серия, номер, кем выдан, дата выдачи, код подразделения',
												label='Паспортные данные',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.bDate',
												label='Дата рождения',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.bAddress',
												label='Место рождения',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.registrationAddress',
												label='Адрес регистрации',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.snils',
												label='СНИЛС'
												:readonly='isEditCertificate')
					v-flex(lg6, sm12)
						v-text-field(v-model='parameters.inn',
												:rules='innRules',
												label='ИНН', type='number',
												:readonly='isEditCertificate',
												required)
						v-text-field(v-model='parameters.email',
												type='email'
												label='E-mail',
												:readonly='isEditCertificate')
						v-text-field(v-model='parameters.phone',
												type='tel', mask='phone',
												label='Контактный телефон',
												:readonly='isEditCertificate')
						file-loader.mb-4(:files='files',
														:sertificateId='parameters._id',
														@setFiles='setFiles',
														@deleteFile='deleteFile')
						file-loader-certificate(v-if='isFileLoaderCertificate', @deleteCertificate="dialog = true")
		v-card.elevation-6.mb-4
			v-card-title.title Параметры изготовления
			v-container(fill-height, fluid, grid-list-xl)
				v-layout(fill-height, wrap)
					v-flex(lg6, sm12)
						v-select(v-model='parameters.groupType',
										:items='items.groupTypes',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='ТИП группы')
						v-select(v-model='parameters.numberTypeGroup',
										:items='items.numbersTypeGroup',
										:readonly='isLeadership',
										item-value='id',
										item-text='name',
										label='Номер АЦ')
						v-select(v-model='parameters.installGroup',
										:items='items.namesInstallGroup',
										:readonly='isLeadership',
										item-value='_id',
										item-text='groupName',
										label='Группа установки')
						v-text-field(v-model='parameters.innGroup',
												:readonly='isLeadership', type='number',
												label='ИНН группы',
												v-show='isGroup')
						v-select(v-model='parameters.numberInGroup',
										:items='items.numberInGroup',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='Количество в группе',
										v-show='isGroup')
						v-select(v-model='parameters.certType',
										:items='items.certTypes',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='Тип сертификата')
						v-select(v-model='parameters.cryptoProvider',
										:items='items.cryptoProviders',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='Крипто провайдер')
						v-select(v-model='parameters.reasonMaking',
										:items='items.reasonsMaking',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='Причина изготовления',
										required)
						v-select(v-model='parameters.issuance',
										:items='items.issuanceCert',
										:readonly='isLeadership',
										item-value='id',
										item-text='title',
										label='Выдача сертификата')
					v-flex(lg6, sm12)
						v-select(v-model='parameters.status',
										:items='items.statusCert',
										:rules="[v => !!v || 'Выберите текущий статус сертификата']",
										:readonly='isLeadership && isExecutors',
										item-value='id',
										item-text='title',
										label='Текущий статус сертификата',
										required)
						v-select(v-model='parameters.executorsId',
										:items='items.executors',
										:rules="[v => !!v || 'Выберите исполнителя']",
										:readonly='isLeadership',
										item-value='_id',
										item-text='fullName',
										label='Исполнитель',
										required)
						v-select(v-model='parameters.installersId',
										:items='items.installers',
										:rules="[v => !!v || 'Выберите установщика']",
										:readonly='isLeadership',
										item-value='_id',
										item-text='fullName',
										label='Установщик',
										required)
						v-select(v-model='parameters.clientId',
										:items='items.clients',
										:readonly='isLeadership',
										item-value='_id', clearable,
										label='Контактное лицо')
							template(slot='selection', slot-scope='data')
								| {{ data.item.fullName }} - {{ data.item.email }}
							template(slot='item', slot-scope='data')
								| {{ data.item.fullName }} - {{ data.item.email }}
						v-text-field(v-model='parameters.note',
												label="Примечание",
												textarea)
						v-checkbox(v-model='checkbox',
											color='teal darken-1',
											v-if='role !== "installer"',
											:rules="[v => !!v || 'Вы должны быть уверены в правильности введенных данных']",
											label='Вы уверены в правильности введенных данных?',
											required)
		v-layout
			v-spacer
			v-btn(:disabled='!valid || isLoading',
						color='teal',
						large,
						flat,
						v-if='role !== "installer"',
						@click="$emit('submit', parameters)") Применить
			v-btn(:disabled='!valid || isLoading',
						color='teal lighten-2',
						large,
						v-if='role !== "installer"',
						@click="$emit('submit', parameters, true)") Сохранить
		v-dialog(v-model='dialog', persistent, max-width='340')
			v-card
				v-card-title.headline.text-xs-center Подтверждение удаления
				v-card-text.text-xs-center Вы действительно хотите удалить сертификат
				v-card-actions
					v-btn(color='red darken-1', flat, @click="deleteCertificate") Удалить
					v-spacer
					v-btn(color='green darken-1', flat, @click="dialog = false") Не удалять
</template>

<script>
import fileLoader from '@/assets/components/FileLoader/forFiles'
import fileLoaderCertificate from '@/assets/components/FileLoader/forCertificate'
import axios from 'axios'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
	name: 'IndividualForm',
	components: {
		fileLoader,
		fileLoaderCertificate
	},
	props: {
		parameters: {
			type: Object
		},
		files: {
			type: Array
		}
	},
	data () {
		return {
			valid: false,
			checkbox: false,
			menu: false,
			items: {},
			emailRules: [
				v => !!v || 'E-mail обязателен',
				v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail должен быть валидный'
			],
			innRules: [
				v => !!v || 'Введите ИНН',
				v => this.validateInn(v) || 'Не прошло проверку контрольного числа'
			],
			snilsRules: [
				v => v.length === 11 || 'Не хватает символов',
				v => this.validateSnils(v) || 'Не прошло проверку контрольного числа'
			],
			dialog: false
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
		...mapGetters(['role', 'isLoading']),
		isEditCertificate () {
			return this.$route.name === 'EditСertificate'
		},
		isAddCertificate () {
			return this.$route.name === 'NewСertificate'
		},
		isLeadership () {
			if ((this.isEditCertificate || this.isAddCertificate) && (this.role === 'manager' || this.role === 'admin')) {
				return false
			} else {
				return true
			}
		},
		isExecutors () {
			if (this.isEditCertificate && (this.role === 'remoteExecutor' || this.role === 'executor')) {
				return false
			} else {
				return true
			}
		},
		isFileLoaderCertificate () {
			if (this.role !== 'installer' && this.isEditCertificate) {
				return true
			} else {
				return false
			}
		},
		isGroup () {
			if (this.parameters.groupType !== 'none') {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		async getItemsForSelect () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/certificates.getParametrs`)
			return res.data.items
		},
		setFiles (files) {
			this.$emit('setFiles', files)
		},
		deleteFile (fileIndex) {
			this.$emit('deleteFile', fileIndex)
		},
		validateInn (inn) {
			const checkDigit = (inn, coefficients) => {
				let n = 0
				for (let i in coefficients) {
					n += coefficients[i] * inn[i]
				}
				return parseInt(n % 11 % 10)
			}
			switch (inn.length) {
			case 10:
				let n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8])
				if (n10 === parseInt(inn[9])) {
					return true
				}
				break
			case 12:
				let n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
				let n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8])
				if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
					return true
				}
				break
			}
			return false
		},
		validateSnils (snils) {
			let sum = 0
			for (let i = 0; i < 9; i++) {
				sum += parseInt(snils[i]) * (9 - i)
			}
			let checkDigit = 0
			if (sum < 100) {
				checkDigit = sum
			} else if (sum > 101) {
				checkDigit = parseInt(sum % 101)
				if (checkDigit === 100) {
					checkDigit = 0
				}
			}
			if (checkDigit === parseInt(snils.slice(-2))) {
				return true
			} else {
				return false
			}
		},
		async deleteCertificate () {
			try {
				this.isLoading = true
				await axios.post(`${this.$root.SERVER_HOST}/certificates.delCertFile `, {id: this.parameters._id})
				this.parameters.attachedCert = []
				this.isLoading = false
				this.dialog = false
			} catch (err) {
				this.isLoading = false
				this.dialog = false
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Не удалось удалить файл')
			}
		}
	},
	async mounted () {
		try {
			this.items = await this.getItemsForSelect()
		} catch (err) {
			this.$store.commit('setError', err)
		}
	}
}
</script>
