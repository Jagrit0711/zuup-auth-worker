import sys
import base64
import re
from PIL import Image
from io import BytesIO

img_path = "/home/zylon/.gemini/antigravity/brain/27fefdbd-cfc0-4ff9-80e4-158f4b52e2a3/moza_doodle_login_1781453395174.png"

img = Image.open(img_path).convert("RGBA")
img = img.resize((500, 500), Image.Resampling.LANCZOS)
datas = img.getdata()

newData = []
for item in datas:
    brightness = sum(item[:3]) / 3
    if brightness < 30:
        newData.append((255, 255, 255, 0)) # transparent
    else:
        alpha = int((brightness / 255.0) * 255)
        newData.append((255, 255, 255, alpha))

img.putdata(newData)
buffered = BytesIO()
img.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

with open("src/index.ts", "r") as f:
    content = f.read()

# 1. Update signature
content = content.replace("const renderLoginUI = (error?: string) => `", "const renderLoginUI = (error?: string, siteName: string = 'Zuup') => `")

# 2. Update mascot image tag
new_img_tag = f'<img src="data:image/png;base64,{img_str}" alt="Moza Mascot" class="fixed -bottom-10 -right-10 w-[450px] h-[450px] object-contain pointer-events-none opacity-40 z-0 rotate-[-10deg]" />'
pattern = r'<!-- Floating Moza Mascot \(Bottom Right\) -->\s*<img src="data:image/png;base64,.*?/>'
content = re.sub(pattern, '<!-- Floating Moza Mascot (Bottom Right) -->\n    ' + new_img_tag, content, flags=re.DOTALL)

# 3. Update the h2 to use siteName
content = content.replace('<h2 class="text-[22px] font-bold text-white mb-2">Sign in to Zuup</h2>', '<h2 class="text-[22px] font-bold text-white mb-2">Sign in to ${siteName}</h2>')

# 4. Replace the app.get('/login') route
new_route = """app.get('/login', (c) => {
  const error = c.req.query('error');
  const redirectTo = c.req.query('redirect_to');
  let siteName = 'Zuup';
  
  if (redirectTo) {
    try {
      const url = new URL(redirectTo);
      siteName = url.hostname;
    } catch(e) {}
  }
  
  return c.html(renderLoginUI(error, siteName));
});"""

content = re.sub(r"app\.get\('/login', \(c\) => c\.html\(renderLoginUI\(c\.req\.query\('error'\)\)\)\);", new_route, content)

with open("src/index.ts", "w") as f:
    f.write(content)

print("Injected new doodle mascot and updated UI!")
