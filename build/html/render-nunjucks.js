const fs = require('fs')
const nunjucks = require('nunjucks')
const path = require('path')

const pageList = require('./page-list')
const SectionExtension = require('./section-extension')

/**
 * Load template as string
 * @param {string} name Template name
 */
function loadTemplate (name) {
  return fs.readFileSync(
    path.resolve(__dirname, `../../docs/templates/${name}.njk`)
  ).toString()
}

// Cache templates
const templates = {
  head: loadTemplate('head'),
  sidebar: loadTemplate('sidebar'),
  footer: loadTemplate('footer'),
  components: loadTemplate('components')
}

/**
 * Get page name and URL
 * @param {string} cwd Current working directory
 */
function pageObjects (cwd, pageType) {
  return pageList[pageType](cwd).map((page) => {
    return {
      name: page,
      url: pageType === 'components'
        ? `components/${page}.html`
        : `${page}.html`
    }
  })
}

/**
 * Render Nunjucks file to string
 * @param {string} cwd Current working directory
 * @param {string} file File to render
 * @return {Promise<string>}
 */
module.exports = function (cwd, file) {
  return new Promise((resolve, reject) => {
    // Create Nunjucks environment
    let env = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(`${cwd}/src`)
    )

    // Prefix URL to make it relative
    env.addFilter('relative', (url) => {
      if (file.startsWith('components/')) {
        return `../${url}`
      } else {
        return url
      }
    })

    // Add custom section tag
    env.addExtension('SectionExtension', new SectionExtension())

    // Add environment variables to Nunjucks
    env.addGlobal('process', {
      env: {
        NODE_ENV: process.env.NODE_ENV,
        FESG_ENV: process.env.FESG_ENV
      }
    })

    const head = () => {
      let html = new nunjucks.Template(templates.head, env).render()

      return new nunjucks.runtime.SafeString(html)
    }

    const sidebar = () => {
      let html = new nunjucks.Template(templates.sidebar, env).render({
        components: pageObjects(cwd, 'components'),
        prototypes: pageObjects(cwd, 'prototypes')
      })

      return new nunjucks.runtime.SafeString(html)
    }

    const footer = () => {
      let html = new nunjucks.Template(templates.footer, env).render()

      return new nunjucks.runtime.SafeString(html)
    }

    const components = () => {
      return new nunjucks.Template(templates.components, env)
    }

    // Add components, footer, and sidebar templates
    env.addGlobal('fesg', {
      head: head(),
      sidebar: sidebar(),
      footer: footer(),
      components: components()
    })

    env.render(file, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
