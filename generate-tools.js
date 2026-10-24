const fs = require('fs'); 
const path = require('path');

// List of folders to scan for tools (includes standard /tools/ and any category folders)
const scanFolders = ['tools', 'finance', 'math', 'utility', 'scientific', 'everyday'];

function generateToolsJson() {
    let tools = [];

    scanFolders.forEach(folder => {
        if (fs.existsSync(folder)) {
            walkDirectory(folder, tools);
        }
    });

    // Write the output to tools.json in the root directory
    fs.writeFileSync('tools.json', JSON.stringify(tools, null, 2));
    console.log(`Success! Generated tools.json with ${tools.length} tools.`);
}

function walkDirectory(currentDir, toolsList) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
            // Recursively scan subfolders
            walkDirectory(fullPath, toolsList);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            const htmlContent = fs.readFileSync(fullPath, 'utf8');

            // 1. Extract Title
            const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : entry.name.replace('.html', '');

            // 2. Extract Description
            const descMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
            const description = descMatch ? descMatch[1] : '';

            // 3. Determine Category
            // First, check if a meta category tag exists in the file
            const catMatch = htmlContent.match(/<meta\s+name=["']category["']\s+content=["'](.*?)["']/i);
            let category = catMatch ? catMatch[1] : '';

            // Fallback: If no meta tag, derive category from the parent folder name (e.g. /finance/ -> Finance)
            if (!category) {
                const relativePath = path.relative('.', fullPath);
                const pathParts = relativePath.split(path.sep);
                
                if (pathParts.length > 1 && pathParts[0] !== 'tools') {
                    // Capitalize folder name (e.g., finance -> Finance)
                    category = pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
                } else {
                    category = 'General Tools';
                }
            }

            // Generate correct web URL path
            const webUrl = '/' + fullPath.replace(/\\/g, '/');

            toolsList.push({
                title,
                description,
                category,
                url: webUrl
            });
        }
    });
}

generateToolsJson();
