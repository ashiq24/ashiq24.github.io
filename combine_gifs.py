import sys
import subprocess

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    import imageio
    from PIL import Image
    import numpy as np
except ImportError:
    install("imageio")
    install("Pillow")
    install("numpy")
    import imageio
    from PIL import Image
    import numpy as np

png_path = "assets/img/paper_fig/soft_eq_fig.png"
gif_path = "assets/img/paper_fig/softeq_gif.gif"
out_path = "assets/img/paper_fig/softeq_combined.gif"

print("Reading PNG...")
png_img = Image.open(png_path).convert("RGBA")

print("Reading GIF...")
gif_reader = imageio.get_reader(gif_path)
frames = []
for frame in gif_reader:
    frames.append(Image.fromarray(frame).convert("RGBA"))

target_width = max(png_img.width, frames[0].width)

def resize_to_width(img, t_width):
    if img.width == t_width:
        return img
    wpercent = (t_width / float(img.width))
    hsize = int((float(img.height) * float(wpercent)))
    return img.resize((t_width, hsize), Image.LANCZOS)

png_resized = resize_to_width(png_img, target_width)

new_frames = []
print("Combining frames...")
for f in frames:
    f_res = resize_to_width(f, target_width)
    total_height = png_resized.height + f_res.height
    new_img = Image.new('RGBA', (target_width, total_height), (255, 255, 255, 255))
    new_img.paste(png_resized, (0, 0))
    new_img.paste(f_res, (0, png_resized.height))
    
    bg = Image.new("RGB", new_img.size, (255, 255, 255))
    bg.paste(new_img, mask=new_img.split()[3]) 
    new_frames.append(np.array(bg))

try:
    meta = gif_reader.get_meta_data()
    duration = meta.get('duration', 100) # ms
    if duration == 0:
        duration = 100
except:
    duration = 100

print(f"Saving to {out_path} with duration {duration}...")
imageio.mimsave(out_path, new_frames, format='GIF', duration=duration, loop=0)
print("Done!")
