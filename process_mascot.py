from PIL import Image
import base64
import sys
from io import BytesIO

img_path = sys.argv[1]
out_txt = sys.argv[2]

img = Image.open(img_path).convert("RGBA")
# Resize to 500x500 to save space but keep quality
img = img.resize((500, 500), Image.Resampling.LANCZOS)
datas = img.getdata()

newData = []
for item in datas:
    # White background removal (fuzziness)
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        newData.append((255, 255, 255, 0)) # transparent
    else:
        newData.append(item)

img.putdata(newData)

buffered = BytesIO()
img.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

with open(out_txt, "w") as f:
    f.write(img_str)

print("Base64 saved to", out_txt)
