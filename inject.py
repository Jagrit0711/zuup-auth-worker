import sys

with open("src/index.ts", "r") as f:
    content = f.read()

with open("mascot.b64", "r") as f:
    b64 = f.read().strip()

content = content.replace("MOZA_B64_PLACEHOLDER", "data:image/png;base64," + b64)

with open("src/index.ts", "w") as f:
    f.write(content)

print("Injected base64 image into index.ts!")
