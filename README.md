# Front-End Styleguide
Front-end development styleguide with Sass, JavaScript and Handlebars.
Uses the [Gulp](http://gulpjs.com/) task runner to compile [Sass](http://sass-lang.com/) files, [lint](http://jshint.com/) and concatenate JavaScript and create static HTML from [Handlebars](http://handlebarsjs.com/).


## Contents
1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [Usage](#usage)
  1. [Tasks](#tasks)
  2. [Sass](#sass)
  3. [JavaScript](#javascript)
  4. [Handlebars](#handlebars)
  5. [Holder.js](#holderjs)
  6. [Assets](#assets)
4. [Styleguide CSS](#styleguide-css)
5. [Credits](#credits)


## Dependencies
* [Node.js with npm](https://nodejs.org/)
* Windows: Use [Node.js 6.x.x](https://nodejs.org/en/download/current/) to avoid paths that exceed 260 characters.


## Installation
1. Get the [latest Front-End Styleguide release](https://github.com/MVSde/styleguide/releases/latest).
2. Run `npm install` to download Node Modules.
3. Install global Gulp with `npm install -g gulp`. This step is required to get CLI access to gulp.


_To update previously downloaded Node Modules run `npm update`._


## Usage

### Tasks
These are the main Gulp tasks:
* Run `gulp` to start the default task. This task watches for file changes and starts Browsersync.  
All generated files are placed in `dev`.
* Run `gulp development` to start the default task without file watching and Browsersync.  
All generated files are placed in `dev`.
* Run `gulp production` to create prduction ready files. This task minifys CSS and JavaScript files and compresses images.  
All genereated files will be placed in `dist`.

There are more tasks available for standalone execution:
* `sass:dev` and `sass:dist` for Sass compilation.
* `js:dev` and `js:dist` for JavaScript concatenation and linting.
* `handlebars:dev` and `handlebars:dist` for static HTML file generation.
* `assets:dev` and `assets:dist` for assets copying and image minification.

_The generated folders `dev` and `dist` are not versioned by Git._


### Sass
Located in `src/css`.  
Output to `dev/css` or `dist/css`.

*Sass* is a CSS-Preprocessor supporting variables, nesting and mixins - among many other features. For a complete documentation jump to the [Sass Basics](http://sass-lang.com/guide).

This styleguide splits the CSS into small parts. This ensures a far better organization of style declarations. Each component sits in it's own file and is re-usable across the project. See [Handlebars-Section](#handlebars) for the HTML-side of componentization.

The function `@import` includes the corresponding file in the main Sass file. The final output is one large CSS file to minimize requests. See `src/css/main.scss` for more information.

_The development task generates sourcemaps._


### JavaScript
Located in `src/js`.  
Output to `dev/js` or `dist/js`.

JavaScript files are concatenated in the following order: first files from `libraries`, second files from `components`. Within these folders the order is alphabetical.

All 3rd-party stuff should be placed inside the folder `src/js/libraries`. JSHint ignores files in this folder to prevent error spamming. jQuery 2 is included with this styleguide but it can be replaced with another library or removed completely.

_The development task runs JSHint and generates sourcemaps. The production task uglifies the source._


### Handlebars
Located in `src/html`.<br>
Output to `dev` or `dist`.

*Handlebars* is an HTML templating engine based on JavaScript. Gulp creates static HTML from Handlebars files.

Hierarchic organisation with subfolders is supported. The output reflects the input file tree.


#### Layouts
Layouts determine the overall structure of the HTML document. They contain the `<head>` area, scripts and styles.

Layouts are located in `src/html/partials/layouts`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{file.meta.title}}</title>
  </head>
  <body>
    {{{block "content"}}}
  </body>
</html>
```


#### Includes
These files can be included in all other files (even in other includes). The process is comparable to PHP's `include`.

Includes are located in `src/html/partials/includes`. The Handlebars renderer accesses them relative to the `src/html/partials` folder.

The syntax `{{> "includes/example" }}` includes the file `src/html/partials/includes/example.hbs`.


#### Pages and Components
Pages are the actual web pages displayed by the browser.<br>
Components are reference pages for smaller UI parts. The gulp task `production` will not render them.

The `default` gulp task injects a flyout menu into pages and components for easier navigation during development.

Pages are located in `src/html/pages`, components in `src/html/components`.

The YAML front matter between `---` contains general information like the page title and description. This will be used primarily by layouts. You can add additional information, which can be accessed via `{{file.meta.key}}`. Replace `key` with the name from the front matter.

```html
---
title: Example
description: Only used for components.
---
{{#extend "layouts/components"}}
  {{#content "content"}}
    <p>This will be injected into the layout.</p>
  {{/content}}
{{/extend}}
```

### Holder.js
Use [Holder.js](https://github.com/imsky/holder) to include image placeholders.

This basic example generates a grey 300 by 200 pixel image.

```html
<img src="" data-src="holder.js/300x200" alt="Image Placeholder">
```

[More advanced options](https://github.com/imsky/holder#placeholder-options) like color, text and font are available.


### Assets
Located in `src/assets`.<br>
Output to `dev/assets` or `dist/assets`.

All files and folders placed in `src/assets` will be copied to `dev/assets` or `dist/assets`. The distribution task minifies images with a lossless compressor.


## Styleguide CSS
The components pages and the development menu use some styling.

All styles are located in `src/html/css/sg.scss`.

The style definitions located in `src/css` use the prefix `sg-` to ensure compatibility with the main stylesheet.


## Credits

[Material icons by Google](https://design.google.com/icons/)
