module.exports = (family, weight, style, filenameBase) => `@font-face {
  font-family: '${family}';
  font-weight: ${weight};
  font-style: ${style};
  src: url('${filenameBase}.eot');
  src: url('${filenameBase}.eot?#iefix') format('embedded-opentype'),
       url('${filenameBase}.woff') format('woff');
}`
