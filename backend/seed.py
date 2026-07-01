import os
import django
import requests
from django.core.files.base import ContentFile
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product, ProductSize, ProductImage

dummyProducts = [
  { "id": 1, "title": 'Striped Knit Shirt', "price": 399000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL'], "img": 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750141248450-fulls-(4).png' },
  { "id": 2, "title": 'Signature Denim Shirt', "price": 450000, "cat": 'Man', "sizes": ['M', 'L', 'XL', 'XXL'], "img": 'https://sgp1.digitaloceanspaces.com/upload-file-s3/lascada/12/1750403679332-untitled-00774-(1).jpg' },
  { "id": 3, "title": 'Core Black Hoodie', "price": 599000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL', 'XXL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-black-hoodie-front.png?v=1780053097' },
  { "id": 4, "title": 'Schematic Longsleeve Tee', "price": 299000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/schematic-longsleeve-front.png?v=1780053340' },
  { "id": 5, "title": 'Expressive Tee', "price": 249000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/expressive-tee-front.png?v=1780052951' },
  { "id": 6, "title": 'Kinetic Tee', "price": 249000, "cat": 'Man', "sizes": ['M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/kinetic-tee-front.png?v=1780053256' },
  { "id": 7, "title": 'Wave Hoodie', "price": 599000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL', 'XXL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/wave-hoodie-front.png?v=1780053289' },
  { "id": 8, "title": 'Core Crew Sweatshirt', "price": 499000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/core-crew-front.png?v=1780052909' },
  { "id": 9, "title": 'Reverb Longsleeve', "price": 349000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL', 'XXL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/reverb-longsleeve-front.png?v=1780053317' },
  { "id": 10, "title": '11_11 Crew Sweatshirt', "price": 499000, "cat": 'Man', "sizes": ['M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/11-11-crew-front_fb8efabc-8659-4bcc-b66c-c6102044ae18.png?v=1780053477' },
  { "id": 11, "title": 'Research Preview Hoodie', "price": 649000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/research-preview-hoodie-font.png?v=1780052640' },
  { "id": 12, "title": 'Employee Tee', "price": 249000, "cat": 'Man', "sizes": ['S', 'M', 'L', 'XL', 'XXL'], "img": 'https://cdn.shopify.com/s/files/1/0999/0412/7311/files/employee-tee-front.png?v=1780052707' },
]

def run():
    print("Seeding database...")
    cat_man, _ = Category.objects.get_or_create(name='T-Shirt', slug='t-shirt')
    
    for item in dummyProducts:
        print(f"Creating {item['title']}...")
        prod, created = Product.objects.get_or_create(
            slug=slugify(item['title']),
            defaults={
                'title': item['title'],
                'price': item['price'],
                'category': cat_man,
                'gender': 'Man',
                'description': 'Premium apparel product.'
            }
        )
        if created:
            for size in item['sizes']:
                ProductSize.objects.create(product=prod, size=size, stock=10)
            
            # Save image URL
            ProductImage.objects.create(product=prod, image_url=item['img'], is_primary=True)

    print("Seeding complete.")

if __name__ == '__main__':
    run()
