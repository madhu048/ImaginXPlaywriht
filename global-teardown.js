// global-teardown.js
import fs from 'fs';
import path from 'path';

export default async () => {
  const dir = 'FailedUrls';
  const mergedFile = path.join(dir, 'AllFailedUrls.txt');


  if (fs.existsSync(dir)) {
    // Collect all worker files
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.txt') && f.startsWith('FailedUrl_'));

    const allUrls = new Set();

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const urls = content.split('\n').map(url=>url.trim()).filter(Boolean); // it will split and remove the spaces and empty strings and will give array.
      urls.forEach(url=>allUrls.add(url)); // it will add each url to set so duplicats will be removed.
        // mergedContent += content.trim() + '\n';
    }
    let mergedContent = '';
    if (allUrls.size===0) {
      // If no failures, write base URL
      mergedContent = 'https://imaginxavr.com/\n';
      // mergedContent = 'https://dev.imaginxavr.com/imaginx/\n';
      console.log(`✔ All tests passed → saved base URL`);
    } else {
      mergedContent = [...allUrls].join('\n') + '\n';
      console.log(`❌ Merged failed URLs:\n${mergedContent}`);
    }

    // if (mergedContent.trim() === '') {
    //   // If no failures, write base URL
    //   mergedContent = 'https://imaginxavr.com/\n';
    //   // mergedContent = 'https://dev.imaginxavr.com/imaginx/\n';
    //   console.log(`✔ All tests passed → saved base URL`);
    // } else {
    //   console.log(`❌ Merged failed URLs:\n${mergedContent}`);
    // }

    fs.writeFileSync(mergedFile, mergedContent, 'utf8');
    console.log(`📄 Created merged file: ${mergedFile}`);
  }
};
