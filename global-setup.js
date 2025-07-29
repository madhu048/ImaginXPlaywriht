// This code will clean the screenshot folder for every new execution of project.
const fs = require('fs-extra');

module.exports = async () => {
  const folderPath = 'screenshots';
  const errorscreeshotFolder = 'ErrorScreenshots';
  const playwrightReport = 'playwright-report';
  const TestResults = 'test-results';

  try {
    await fs.emptyDir(folderPath); // Clears all files from screenshots folder
    console.log(`🧹 Cleared '${folderPath}' folder.`);
  } catch (err) {
    console.error(`❌ Error clearing '${folderPath}':`, err);
  }
  try {
    await fs.emptyDir(errorscreeshotFolder); // Clears all files from errorscreeshotFolder folder
    console.log(`🧹 Cleared '${errorscreeshotFolder}' folder.`);
  } catch (err) {
    console.error(`❌ Error clearing '${errorscreeshotFolder}':`, err);
  }
  try {
    await fs.emptyDir(playwrightReport); // Clears all files from playwrightReport folder
    console.log(`🧹 Cleared '${playwrightReport}' folder.`);
  } catch (err) {
    console.error(`❌ Error clearing '${playwrightReport}':`, err);
  }
  try {
    await fs.emptyDir(TestResults); // Clears all files from test-results folder
    console.log(`🧹 Cleared '${TestResults}' folder.`);
  } catch (err) {
    console.error(`❌ Error clearing '${TestResults}':`, err);
  }
};
