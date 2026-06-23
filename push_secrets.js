const { execSync } = require('child_process');
const fs = require('fs');

try {
    const devVars = fs.readFileSync('.dev.vars', 'utf-8');

    devVars.split('\n').forEach(line => {
        if(!line.trim() || line.startsWith('#')) return;
        const [key, ...rest] = line.split('=');
        const val = rest.join('=');
        console.log(`Putting secret: ${key}`);
        try {
            execSync(`npx wrangler secret put ${key}`, { input: val, stdio: ['pipe', 'pipe', 'pipe'] });
            console.log(`Success: ${key}`);
        } catch(err) {
            console.error(`Failed to put ${key}: ${err.message}`);
            if (err.stderr) console.error(err.stderr.toString());
        }
    });
    console.log('All secrets uploaded successfully!');
} catch (e) {
    console.error(e);
}
