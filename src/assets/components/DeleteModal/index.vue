<template lang="pug">
	v-dialog(v-model='dialog', persistent, max-width='290')
		v-card
			v-card-title.headline.text-xs-center Подтверждение удаления
			v-card-text.text-xs-center Вы действительно хотите удалить пользователя #[br] #[span.title {{this.item.fullName}}?]
			v-card-actions
				v-btn(color='red darken-1', flat, @click.native="$emit('delete', item)") Удалить
				v-spacer
				v-btn(color='green darken-1', flat, @click.native="$emit('notDeleted')") Не удалять
</template>

<script>
export default {
	name: 'DeleteModal',
	props: {
		dialog: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object
		}
	}
}
</script>
