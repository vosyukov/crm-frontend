import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Certificates',
			component: () => import('@/components/Сertificates'),
			meta: { requiresAuth: true }
		},
		{
			path: '/newCertificate/:type',
			name: 'NewСertificate',
			component: () => import('@/components/Сertificates/NewCertificate'),
			props: true,
			meta: { requiresAuth: true }
		},
		{
			path: '/editCertificate',
			name: 'EditСertificate',
			component: () => import('@/components/Сertificates/EditCertificate'),
			meta: { requiresAuth: true }
		},
		{
			path: '/users',
			name: 'Users',
			component: () => import('@/components/Users'),
			meta: { requiresAuth: true }
		},
		{
			path: '/newUser',
			name: 'NewUser',
			component: () => import('@/components/Users/NewUser'),
			meta: { requiresAuth: true }
		},
		{
			path: '/editUser',
			name: 'EditUser',
			component: () => import('@/components/Users/EditUser'),
			meta: { requiresAuth: true }
		},
		{
			path: '/contactFaces',
			name: 'ContactFaces',
			component: () => import('@/components/ContactFaces'),
			meta: { requiresAuth: true }
		},
		{
			path: '/newContactFace',
			name: 'NewContactFace',
			component: () => import('@/components/ContactFaces/NewContactFace'),
			meta: { requiresAuth: true }
		},
		{
			path: '/editContactFace',
			name: 'EditContactFace',
			component: () => import('@/components/ContactFaces/EditContactFace'),
			meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/components/Login')
		},
		{
			path: '/installGroup',
			name: 'InstallGroup',
			component: () => import('@/components/InstallGroup'),
			meta: { requiresAuth: true }
		}
	]
})
