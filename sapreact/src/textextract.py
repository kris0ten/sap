
from PIL import Image
import pytesseract

# Open an image file
image = Image.open('/Users/krishtenu/Desktop/bustick.png')

# Use Tesseract to do OCR on the image
text = pytesseract.image_to_string(image)

# Print the text
print(text)
