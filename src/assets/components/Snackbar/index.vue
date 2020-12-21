<template lang="pug">
	v-snackbar(:timeout="Number(1666)",
						bottom, right,
						:color='snackbar.color'
						v-model='snackbar.isActive')
			.title {{ snackbar.text }}
</template>

<script>
export default {
	name: 'Snackbar',
	computed: {
		snackbar () {
			return this.$store.state.snackbar
		}
	}
}
</script>
