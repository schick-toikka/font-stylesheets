const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp');
const slugify = require('slugify')
const fontStyleSheetTemplate = require('./lib/font-style-sheet-template')
const families = require('./lib/style-sheets.json')

const defaultStyle =  { "name": null, "cssStyle": "normal" }

const generateStyleSheetSet = family =>
  family.weights
    .reduce(
      (styleSheets, weight) =>
        [
          ...styleSheets,
          ...(family.styles && family.styles.length > 0 ? family.styles : [defaultStyle]).map(style => {
            const name = `${family.name}${weight.name ? ' ' + weight.name : ''}${style.name ? ' ' + style.name : ''}`
            return {
              name,
              css: fontStyleSheetTemplate(
                weight.cssWeight ? family.name : `${family.name} ${weight.name}`,
                weight.cssWeight || 400,
                style.cssStyle,
                name
              )
            }
          })
        ]
    , [])

const styleSheets = families.reduce((sheets, family) => {
  const styleSheetSet = generateStyleSheetSet(family)
  const name = `${slugify(family.name).toLowerCase()}`
  return [
    ...sheets,
    {
      filename: `${name}/${name}.css`,
      css: `${styleSheetSet.map(styleSheet => styleSheet.css).join('\n\n')}\n`
    },
    ...(styleSheetSet.length > 1 ? (
      styleSheetSet.map(styleSheet => ({
        filename: `${name}/${slugify(styleSheet.name).toLowerCase()}.css`,
        css: `${styleSheet.css}\n`
      }))
    ) : [])
  ]
}, [])

styleSheets.forEach(styleSheet => {
  const dir = `style-sheets/${path.dirname(styleSheet.filename)}`
  mkdirp.sync(dir)
  fs.writeFileSync(`style-sheets/${styleSheet.filename}`, styleSheet.css)
})
