const fs = require('fs');

let html = fs.readFileSync(__dirname+'/dist/index.html').toString();

html = html.replace('inline.bundle.js','js/inline.bundle.js');
html = html.replace('polyfills.bundle.js','js/polyfills.bundle.js');
html = html.replace('styles.bundle.js','js/styles.bundle.js');
html = html.replace('vendor.bundle.js','js/vendor.bundle.js');
html = html.replace('main.bundle.js','js/main.bundle.js');

fs.writeFileSync(__dirname+'/dist/index.html', html);