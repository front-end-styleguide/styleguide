/* globals pangolinBase */

import ky from 'ky'

const connector = ky.create({
  prefixUrl: pangolinBase
})

export default {
  /**
   * Get project information
   */
  getProject () {
    return connector.get('pangolin/project.json').json()
  },

  /**
   * Get template list
   */
  getTemplates () {
    return connector.get('pangolin/templates.json').json()
  },

  /**
   * Get component list
   */
  getComponents () {
    return connector.get('pangolin/components.json').json()
  },

  /**
   * Get additional component file
   * @param {string} path Source path
   */
  getComponentFile (path) {
    return connector.get(`${path}.html`).text()
  }
}