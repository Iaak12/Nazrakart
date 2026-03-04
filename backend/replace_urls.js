import fs from 'fs';
import path from 'path';

const directoryPath = 'C:\\Users\\ayaz\\Desktop\\project-app-mern\\frontend\\src';

function replaceInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if localhost:5000 exists
    if (content.includes('http://localhost:5000')) {
        let newContent = content.replace(/http:\/\/localhost:5000/g, '${import.meta.env.VITE_API_URL}');

        newContent = newContent.replace(/'\$\{import.meta.env.VITE_API_URL\}([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
        newContent = newContent.replace(/"\$\{import.meta.env.VITE_API_URL\}([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

console.log('Starting URL replacement...');
walkDir(directoryPath);
console.log('Replacement complete.');
