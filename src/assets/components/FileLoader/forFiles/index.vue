<template lang="pug">
	v-card.pa-2(color="grey lighten-4")
		v-card-title.title.px-2 Прикрепление файлов
			v-layout
				v-flex(justify-end, d-flex).px-0
					v-spacer
					input(type='file', name='file', multiple, ref='fileLoader', style='display: none', @change="setFiles($event)")
					v-btn(color='teal darken-2', small, dark, @click.stop='addFile', style="width: 100px") Добавить файлы
						v-icon(dark, small).pl-2 note_add
		v-layout(v-if='files.length')
			v-flex.px-3
				v-list(subheader)
					v-subheader Добавленные файлы
					v-list-tile(v-for='(file, index) in files',
											:key='file.name',
											avatar)
						v-list-tile-avatar(style='min-width: 30px')
							v-icon(color='grey darken-2') insert_drive_file
						v-list-tile-content
							v-list-tile-title {{ file.name }}
						v-list-tile-action
							v-btn(icon, ripple, target='_blank', :href='file.url', v-if='file.url')
								v-icon(color='green lighten-1') save
						v-list-tile-action(v-if='canDelete')
							v-btn(icon, ripple, @click='deleteFile(index)')
								v-icon(color='red lighten-1') delete
		v-card-actions(v-if='files.length').pl-0
			v-btn(@click='downloadArhivedFiles()', color='blue darken-3', outline, small) Скачать архивом
				v-icon(color='blue darken-3', right) cloud_download
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
	data () {
		return {
			loading: false
		}
	},
	name: 'FileLoaderForFiles',
	props: {
		files: {
			type: Array
		},
		sertificateId: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapGetters(['role']),
		canDelete () {
			if (this.role === 'admin' || this.role === 'manager') {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		addFile () {
			this.$refs.fileLoader.click()
		},
		setFiles (e) {
			this.$emit('setFiles', e.target.files)
		},
		deleteFile (index) {
			this.$emit('deleteFile', index)
		},
		async downloadArhivedFiles () {
			try {
				this.loading = true
				const response = await axios.post(`${this.$root.SERVER_HOST}/certificates.getLinkArhivedFiles`, {id: this.sertificateId})
				window.open(response.data.link)
				this.loading = false
			} catch (err) {
				this.loading = false
				this.$store.commit('setError', err)
				this.$store.commit('showErorrMessage', 'Не удалось скачать архив')
			}
		}
	}
}
</script>
