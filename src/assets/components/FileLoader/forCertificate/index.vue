<template lang="pug">
	v-card.pa-2(color="grey lighten-4")
		v-card-title.title.px-2 Прикрепление сертификата
			v-layout
				v-flex(justify-end, d-flex).px-0
					v-spacer
					input(type='file', name='file', multiple, ref='fileLoader', webkitdirectory, style='display: none', @change="setFiles($event)")
					v-btn(v-if='!filesCertificate.length', color='teal darken-2', small, dark, @click.stop='addFile', style="width: 130px") Добавить файл
						v-icon(dark, small).pl-2 note_add
					v-btn(v-if="filesCertificate.length && role === 'admin'", color='red lighten-1', small, dark, @click='deleteCertificate', style="width: 100px") Удалить файл
						v-icon(dark, small).pl-2 delete
		v-layout(v-if='filesCertificate.length')
			v-flex.px-3
				v-list(subheader)
					v-subheader Добавленный сертификат
					v-list-tile(v-for='(file, index) in filesCertificate',
											:key='file.name', avatar)
						v-list-tile-avatar(style='min-width: 30px')
							v-icon(color='grey darken-2') insert_drive_file
						v-list-tile-content
							v-list-tile-title {{ file.name }}
						v-list-tile-action
							v-btn(icon, ripple, target='_blank', :href='file.url', v-if='file.url')
								v-icon(color='green lighten-1') save
						v-list-tile-action(v-if='isDelete')
							v-btn(icon, ripple, @click='deleteFile(index)')
								v-icon(color='red lighten-1') delete
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'FileLoaderForCertificate',
	data () {
		return {
			isDelete: false
		}
	},
	computed: {
		...mapGetters(['filesCertificate', 'role'])
	},
	methods: {
		addFile () {
			this.$refs.fileLoader.click()
		},
		setFiles (e) {
			this.$store.commit('setFileCertificate', e.target.files)
			this.$store.commit('setFilePaths', e.target.files)
		},
		deleteFile (index) {
			this.$store.commit('deleteFileCertificate', index)
		},
		deleteCertificate () {
			this.$emit('deleteCertificate')
		}
	},
	mounted () {
		if (this.filesCertificate.length === 0) {
			this.isDelete = true
		} else {
			this.isDelete = false
		}
	}
}
</script>
