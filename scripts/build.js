const fs = require('fs-extra');

async function build() {
  const exclude = ['public/client', 'public/stylesheets'];
  await fs.copy('public', 'dist/public', {
    filter: (src) => {
      if (exclude.find((dir) => src.includes(dir))) {
        return false;
      }
      return true;
    },
  });

  await fs.copy('src/views', 'dist/views');
  console.log('Build completed successfully.');
}

build().catch(err => console.error('Build failed:', err));