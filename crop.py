from PIL import Image

def crop_trans(p):
    img = Image.open(p).convert('RGBA')
    bbox = img.getbbox()
    if bbox:
        img.crop(bbox).save(p)
        print(p, 'cropped to', bbox)

crop_trans(r'd:\CredAgent\frontend\public\logo.png')
crop_trans(r'd:\CredAgent\frontend\public\wordmark.png')
