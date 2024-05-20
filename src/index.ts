// Import the "glob" and "fs" modules
import glob from "glob"
import fs from "fs/promises"
import { settings } from './settings';

// Define an async function called "convert"
async function convert () {
    // Use "glob" to find all TypeScript files in a specific directory and its subdirectories, except those that match certain patterns
    const files = await glob(settings.projectFilesPathGlob, {ignore: ["**/.d.ts", "__types__", "**/node_modules/**"]});
    // Get the total number of files found
    const total = files.length;
    // Initialize a counter variable
    let counter = 0;
    // Loop through each file found
    for (const file of files) {
        // Increment the counter
        counter++;
        // Calculate the percentage of files processed so far and log it to the console
        console.log(Math.floor(100 / total * counter));
		// Call the "parseFile" function for the current file
		await parseFile(file);
    }
    // Log "DONE" to the console when all files have been processed
    console.log("DONE")
}

// Define an async function called "parseFile" that takes a file path as a parameter
async function parseFile (filePath: string) {
    console.log(filePath)
    // Extract the file name from the file path
    const fileName = filePath.split("/").at(-1);
    // Use "glob" to find all files with the same name in any directory under a certain path, except those that match certain patterns and are in the same directory as the original file
    const duplicatedFilesPath = (await glob(`${settings.folderWithDuplicatedFiles}${fileName}`, { ignore: ["**/.d.ts", "__types__", "**/node_modules/**"] }))

    const duplicatedFilePathFiltered = duplicatedFilesPath.filter(currentFilePath => currentFilePath !== filePath);
    console.log(duplicatedFilesPath)
    console.log(duplicatedFilePathFiltered)
    // Loop through each duplicated file path found
    for (let duplicatedFilePath of duplicatedFilePathFiltered) {
        // Use "fs" to delete the duplicated file
        await fs.unlink(duplicatedFilePath);
    }
}

// Call the "convert" function
convert();
