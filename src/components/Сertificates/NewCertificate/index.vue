<template lang="pug">
	v-container(fluid, align-content-start, justify-start)
		v-layout
			v-flex(xs12)
				v-card.elevation-2
					v-card-title.title Сертификат {{ title }} лица
						v-spacer
						input(ref='inputFile' type="file", style='display: none', @change="parseExcel($event)")
						v-btn(color='teal darken-2', dark, @click='addFile') Импорт из Exсel
							v-icon(dark) import_export
					v-container(fill-height, fluid)
						v-layout
							v-flex(xs12)
								legal-entities-form(v-if="type === 'legal'",
																		:parameters='legalParameters',
																		:files='files',
																		@setFiles='setFiles',
																		@deleteFile='deleteFile',
																		@submit='sendSertificate')
								individuals-form(v-if="type === 'individual'",
																:parameters='individualParameters',
																:files='files',
																@setFiles='setFiles',
																@deleteFile='deleteFile',
																@submit='sendSertificate')
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'

export default {
	name: 'NewCertificate',
	components: {
		LegalEntitiesForm: () => import('@/assets/components/forms/LegalEntitiesForm'),
		IndividualsForm: () => import('@/assets/components/forms/IndividualsForm')
	},
	props: {
		type: {
			type: String
		}
	},
	data () {
		return {
			active: '',
			excelJson: [],
			files: [],
			legalParameters: {
				fullName: '',
				post: '',
				inn: '',
				kpp: '',
				ogrn: '',
				companyName: '',
				fss: '',
				pfr: '',
				kno: '',
				snils: '',
				passport: '',
				bDate: '',
				bAddress: '',
				registrationAddress: '',
				email: '',
				phone: '',
				certType: '',
				groupType: '',
				numberInGroup: '',
				cryptoProvider: '',
				reasonMaking: '',
				issuance: '',
				status: '',
				executorsId: '',
				innGroup: '',
				installersId: '',
				clientId: '',
				note: '',
				enityType: this.$route.params.type
			},
			individualParameters: {
				fullName: '',
				passport: '',
				bDate: '',
				bAddress: '',
				registrationAddress: '',
				snils: '',
				inn: '',
				email: '',
				phone: '',
				innGroup: '',
				certType: '',
				groupType: '',
				numberInGroup: '',
				cryptoProvider: '',
				reasonMaking: '',
				issuance: '',
				status: '',
				executorsId: '',
				installersId: '',
				clientId: '',
				note: '',
				enityType: this.$route.params.type
			}
		}
	},
	computed: {
		title () {
			if (this.type === 'legal') {
				return 'юридического'
			}
			if (this.type === 'individual') {
				return 'физического'
			}
		}
	},
	methods: {
		async sendSertificate (parameters) {
			try {
				this.$store.commit('setLoading', true)
				await this.addCertificate(parameters)
				this.$store.commit('setLoading', false)
				this.$router.go(-1)
				this.$store.commit('showSuccessMessage', 'Сертификат успешно добавлен')
			} catch (err) {
				this.$store.commit('setLoading', false)
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Произошла ошибка при добавлении сертификата')
			}
		},
		async addCertificate (parameters) {
			await axios.post(`${this.$root.SERVER_HOST}/certificates.add`, this.filePreparation(parameters), { headers: { 'Content-Type': 'multipart/form-data' } })
		},
		filePreparation (parameters) {
			const formData = new FormData()
			formData.append('parameters', JSON.stringify(parameters))
			for (var i = 0; i < this.files.length; i++) {
				let file = this.files[i]
				formData.append('files', file)
			}
			return formData
		},
		setFiles (files) {
			for (let i = 0; i < files.length; i++) {
				this.files.push(files[i])
			}
		},
		deleteFile (fileIndex) {
			this.files.splice(fileIndex, 1)
		},
		addFile () {
			this.$refs.inputFile.click()
		},
		fixdata (data) {
			let o = ''
			let l = 0
			let w = 10240
			for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
			o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
			return o
		},
		parseExcel (e) {
			e.stopPropagation()
			e.preventDefault()
			let file = e.target.files[0]
			let reader = new FileReader()
			reader.onload = e => {
				let result
				let data = e.target.result
				let fixedData = this.fixdata(data)
				let workbook = XLSX.read(btoa(fixedData), {type: 'base64'})
				let firstSheetName = workbook.SheetNames[0]
				let worksheet = workbook.Sheets[firstSheetName]
				result = XLSX.utils.sheet_to_formulae(worksheet)

				const newResult = new Map()

				/**
				 * Разбиваем строки на массивы по =
				 * Удаляем первую ' если есть
				 * Устанавливаем значения в Map
				 */
				for (const iterator of result) {
					let itemArr = iterator.split('=')
					itemArr[1] = itemArr[1].replace('\'', '')
					newResult.set(itemArr[0], itemArr[1])
				}

				// console.log(newResult)
				if (this.type === 'legal') {
					this.setLegalForm(newResult)
				} else {
					this.setIndividualForm(newResult)
				}
			}
			reader.readAsArrayBuffer(file)
		},
		setLegalForm (array) {
			this.legalParameters.fullName = array.get('B16')
			this.legalParameters.post = array.get('B17')
			this.legalParameters.inn = array.get('B18')
			this.legalParameters.kpp = array.get('D18')
			this.legalParameters.ogrn = array.get('B19')
			this.legalParameters.companyName = array.get('B20')
			/**
				проверка на пустые (необязательные поля)
			*/
			if (array.get('B21')) {
				this.legalParameters.fss = array.get('B21')
			}
			if (array.get('B22')) {
				this.legalParameters.pfr = this.deleteSymbols(array.get('B22'))
			}
			if (array.get('B23')) {
				this.legalParameters.kno = array.get('B23')
			}
			this.legalParameters.snils = this.deleteSymbols(array.get('B24'))
			this.legalParameters.passport = array.get('B25')

			const dateObject = XLSX.SSF.parse_date_code(array.get('B26'), {date1904: false})
			this.legalParameters.bDate = `${dateObject.d}.${dateObject.m}.${dateObject.y}`

			this.legalParameters.bAddress = array.get('B27')
			this.legalParameters.registrationAddress = array.get('B28')
			this.legalParameters.email = array.get('B29')
			this.legalParameters.phone = this.deleteSymbols(array.get('B30'))
		},
		setIndividualForm (array) {
			this.individualParameters.fullName = array.get('B6')

			const passportDateObject = XLSX.SSF.parse_date_code(array.get('I8'), {date1904: false})
			const passportDate = `${passportDateObject.d}.${passportDateObject.m}.${passportDateObject.y}`
			const passportValue = `${array.get('B8')} ${array.get('D8')} ${array.get('G8')} ${passportDate} ${array.get('A9')}`

			this.individualParameters.passport = passportValue

			const dateObject = XLSX.SSF.parse_date_code(array.get('B11'), {date1904: false})
			this.individualParameters.bDate = `${dateObject.d}.${dateObject.m}.${dateObject.y}`

			this.individualParameters.bAddress = array.get('F11')
			this.individualParameters.registrationAddress = array.get('C13')
			this.individualParameters.snils = this.deleteSymbols(array.get('D19'))
			this.individualParameters.inn = array.get('D20')
			this.individualParameters.email = array.get('D25')
			this.individualParameters.phone = this.deleteSymbols(array.get('D38'))
		},
		deleteSymbols (string) {
			return string.replace(/\D/g, '')
		}
	}
}
</script>
