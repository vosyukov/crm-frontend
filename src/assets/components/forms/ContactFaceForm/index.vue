<template lang="pug">
	v-form(ref='form', v-model='valid')
		v-text-field(v-model='parameters.fullName',
								:rules="[v => !!v || 'Введите ФИО']",
								label='ФИО', required)
		v-text-field(v-model='parameters.post',
								:rules="[v => !!v || 'Введите должность']",
								label='Должность', required)
		v-text-field(v-model='parameters.phone',
								:rules='phoneRules', type='tel',
								label='Контактный телефон',
								:mask="'# (###) ###-##-##'",
								validate-on-blur, required)
		v-text-field(v-model='parameters.email',
								:rules='emailRules',
								type='email', label='E-mail',
								validate-on-blur, required)
		v-checkbox(v-model='checkbox',
							color='teal darken-1'
							:rules="[v => !!v || 'Вы должны быть уверены в правильности введенных данных']",
							label='Вы уверены в правильности введенных данных?',
							required)
		v-layout
			v-spacer
			v-btn(:disabled='!valid',
						color='teal lighten-2',
						@click="$emit('submit', parameters)") Сохранить
</template>

<script>
export default {
	name: 'ContactFaceForm',
	props: {
		parameters: {
			type: Object
		}
	},
	data () {
		return {
			valid: false,
			checkbox: false,
			phoneRules: [
				v => !!v || 'Введите номер',
				v => v.length === 11 || 'Введите номер полностью'
			],
			emailRules: [
				v => !!v || 'Введите e-mail',
				v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail должен быть валидный'
			]
		}
	}
}
</script>
