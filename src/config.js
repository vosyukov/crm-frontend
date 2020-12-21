const isProduction = process.env.NODE_ENV === 'production'
let SERVER_HOST = null

if (isProduction) {
	SERVER_HOST = 'http://95.53.131.36:3000/api/v1'
} else {
	SERVER_HOST = 'http://85.143.173.3:3050/api/v1'
}

export {
	SERVER_HOST
}
