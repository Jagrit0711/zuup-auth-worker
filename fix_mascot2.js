const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src/index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

// If not already there, add a global constant for the mascot at the top
if (!content.includes('const MOZA_MASCOT_B64 =')) {
    // Find the base64 string for the Moza Mascot from the first occurrence (login UI)
    const mascotMatch = content.match(/<img src="\${MOZA_MASCOT_B64}"/);
    if (!mascotMatch) {
       console.log('Mascot string not replaced correctly in first pass');
    }
}

// Just prepend the variable to the very beginning of the file!
const b64Path = path.join(__dirname, 'mascot.b64');
const b64 = fs.readFileSync(b64Path, 'utf8').trim();

if (!content.includes('const MOZA_MASCOT_B64 =')) {
    content = `const MOZA_MASCOT_B64 = '${b64}';\n` + content;
    fs.writeFileSync(indexPath, content);
}

