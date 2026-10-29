const fs = require('fs');
const path = require('path');

const GA_TAG = `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0JC406N8HR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0JC406N8HR');
</script>
</head>`;

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    
    if (fs.statSync(fullPath).isDirectory() && file !== 'node_modules' && file !== '.git') {
      processDirectory(fullPath);
    } 
    else if (path.extname(fullPath) === '.html') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (!content.includes('G-0JC406N8HR') && content.includes('</head>')) {
        content = content.replace('</head>', GA_TAG);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Successfully added GA4 to:', fullPath);
      }
    }
  });
}

processDirectory('.');
