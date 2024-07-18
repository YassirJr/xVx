const modules = import.meta.glob('../views/**/*.vue')
const getView = (path) => modules['../views/' + path + '.vue']

export default getView
