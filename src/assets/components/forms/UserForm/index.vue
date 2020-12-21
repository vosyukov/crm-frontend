<template lang="pug">
	v-form(ref='form', v-model='valid', autocomplete="off")
		v-text-field(v-model='parameters.fullName',
								:rules="[v => !!v || 'Введите ФИО']",
								label='ФИО',
								required)
		v-select(v-model='parameters.role',
						:items='roles',
						item-value='id'
						item-text='title'
						:rules="[v => !!v || 'Выберите свою роль']",
						label='Роль',
						required)
		v-text-field(v-model='parameters.phone',
								type='tel', :rules='phoneRules',
								label='Контактный телефон',
								:mask="'# (###) ###-##-##'",
								validate-on-blur, required)
		v-text-field(v-model='parameters.password'
								:append-icon="iconEye ? 'visibility' : 'visibility_off'"
								:append-icon-cb='() => (iconEye = !iconEye)'
								:type="iconEye ? 'password' : 'text'"
								:rules="passwordRules",
								label='Пароль', validate-on-blur,
								hint='Для отображение пароля нажмите на кнопку в виде глаза'
								counter, persistent-hint,
								required, loading)
			v-progress-linear(slot='progress',
												:value='progress',
												:color='color',
												height='3')
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
import axios from 'axios'

export default {
	name: 'UserForm',
	props: {
		parameters: {
			type: Object
		}
	},
	data () {
		return {
			valid: false,
			checkbox: false,
			iconEye: true,
			passwordRules: [
				v => !!v || 'Введите пароль',
				v => v.length >= 8 || 'Пароль должен быть от 8 до 25 символов',
				v => v.length <= 25 || 'Пароль должен быть от 8 до 25 символов'
			],
			phoneRules: [
				v => !!v || 'Введите номер',
				v => v.length === 11 || 'Введите номер полностью'
			],
			roles: []
		}
	},
	computed: {
		progress () {
			return Math.min(100, this.parameters.password.length * 10)
		},
		color () {
			return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
		}
	},
	methods: {
		async getRoles () {
			const res = await axios.post(`${this.$root.SERVER_HOST}/users.getRoles`)
			return res.data.roles
		}
	},
	async mounted () {
		try {
			this.roles = await this.getRoles()
		} catch (err) {
			this.$store.commit('setError', err)
			this.$store.commit('showErorrMessage', 'Произошла ошибка при загрузке')
		}
	}
}
</script>
