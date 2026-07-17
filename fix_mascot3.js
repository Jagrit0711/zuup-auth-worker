const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src/index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

if (content.startsWith("const MOZA_MASCOT_B64 = 'iVBORw")) {
    content = content.replace("const MOZA_MASCOT_B64 = 'iVBORw", "const MOZA_MASCOT_B64 = 'data:image/png;base64,iVBORw");
    fs.writeFileSync(indexPath, content);
    console.log("Fixed mascot base64 prefix!");
} else {
    console.log("Prefix already fixed or not found.");
}
