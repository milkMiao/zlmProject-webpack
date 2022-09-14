const Markdown = require('markdown-it')

const markdown = new Markdown()

module.exports = (source) => {
	console.log();
	return `export default \`${markdown.render(source)}\``
}
