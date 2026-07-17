const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src/index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

// Find the base64 string for the Moza Mascot
const mascotMatch = content.match(/<img src="(data:image\/png;base64,[^"]+)"/);
if (!mascotMatch) {
    console.error('Mascot not found!');
    process.exit(1);
}

const mascotB64 = mascotMatch[1];

// 1. If not already there, add a global constant for the mascot at the top
if (!content.includes('const MOZA_MASCOT_B64')) {
    content = content.replace(
        "import { EmailTemplate } from './components/layout';", 
        "import { EmailTemplate } from './components/layout';\n\nconst MOZA_MASCOT_B64 = '" + mascotB64 + "';"
    );
}

// 2. Replace the hardcoded base64 in renderLoginUI with the variable
content = content.replace(
    /<!-- Floating Moza Mascot \(Bottom Right\) -->\s*<img src="data:image\/png;base64,[^"]+"/,
    `<!-- Floating Moza Mascot (Bottom Right) -->\n    <img src="\${MOZA_MASCOT_B64}"`
);

// 3. Add the mascot to renderUpdatePasswordUI
if (!content.includes('<!-- Floating Moza Mascot (Bottom Right) -->') || content.match(/<!-- Floating Moza Mascot \(Bottom Right\) -->/g).length < 2) {
    // Inject it just inside the body tag in renderUpdatePasswordUI
    const bodyTag = '<body class="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-y-auto">';
    const replacement = bodyTag + `\n    <!-- Floating Moza Mascot (Bottom Right) -->\n    <img src="\${MOZA_MASCOT_B64}" class="fixed bottom-0 right-0 w-[500px] h-auto object-contain pointer-events-none z-0 opacity-90 hidden md:block" alt="Moza Mascot" />`;
    
    // Replace the second occurrence of the body tag (which is in renderUpdatePasswordUI)
    let bodyCount = 0;
    content = content.replace(/<body class="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-y-auto">/g, (match) => {
        bodyCount++;
        if (bodyCount === 2) {
            return replacement;
        }
        return match;
    });
}

fs.writeFileSync(indexPath, content);
console.log('Successfully refactored mascot base64 and injected into Update Password UI!');
