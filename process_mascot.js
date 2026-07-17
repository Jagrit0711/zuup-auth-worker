const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const imagePath = '/Users/zylon/.gemini/antigravity-ide/brain/d19eb6a0-17dc-4c13-b985-09d423ef08ef/moza_line_art_1784280495756.png';
const indexPath = path.join(__dirname, 'src/index.ts');

async function processImage() {
    console.log('Loading image...');
    const image = await Jimp.read(imagePath);
    
    console.log('Processing pixels to remove fake checkerboard background...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // If the pixel is not bright enough (e.g. not the white lines), make it transparent
        if (r < 200 || g < 200 || b < 200) {
            this.bitmap.data[idx + 3] = 0; // alpha = 0 (transparent)
        } else {
            // Ensure the lines are pure white and fully opaque
            this.bitmap.data[idx + 0] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
            this.bitmap.data[idx + 3] = 255;
        }
    });

    console.log('Generating base64...');
    const base64Data = await image.getBase64Async(Jimp.MIME_PNG);
    
    console.log('Updating index.ts...');
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace the old constant with the new one
    // We match from "const MOZA_MASCOT_B64 = '" up to the next semicolon or newline
    const regex = /const MOZA_MASCOT_B64 = '[^']+';/;
    if (content.match(regex)) {
        content = content.replace(regex, `const MOZA_MASCOT_B64 = '${base64Data}';`);
        fs.writeFileSync(indexPath, content);
        console.log('Successfully updated MOZA_MASCOT_B64 in index.ts!');
    } else {
        console.error('Could not find MOZA_MASCOT_B64 declaration in index.ts!');
    }
}

processImage().catch(console.error);
