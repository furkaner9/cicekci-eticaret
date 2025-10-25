import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Kategorileri upsert ile oluştur / güncelle
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'buketler' },
      update: { image: '/images/categories/buketler.jpg', description: 'Özenle hazırlanmış taze çiçek buketleri' },
      create: {
        name: 'Buketler',
        slug: 'buketler',
        description: 'Özenle hazırlanmış taze çiçek buketleri',
        image: '/images/categories/buketler.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'aranjmanlar' },
      update: { image: '/images/categories/aranjmanlar.jpg', description: 'Şık ve zarif çiçek aranjmanları' },
      create: {
        name: 'Aranjmanlar',
        slug: 'aranjmanlar',
        description: 'Şık ve zarif çiçek aranjmanları',
        image: '/images/categories/aranjmanlar.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'saksili-cicekler' },
      update: { image: '/images/categories/saksili.jpg', description: 'Uzun ömürlü saksılı çiçekler' },
      create: {
        name: 'Saksılı Çiçekler',
        slug: 'saksili-cicekler',
        description: 'Uzun ömürlü saksılı çiçekler',
        image: '/images/categories/saksili.jpg'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'ozel-gunler' },
      update: { image: '/images/categories/ozel-gunler.jpg', description: 'Özel günler için tasarlanmış buketler' },
      create: {
        name: 'Özel Günler',
        slug: 'ozel-gunler',
        description: 'Özel günler için tasarlanmış buketler',
        image: '/images/categories/ozel-gunler.jpg'
      }
    })
  ])

  // Ürünleri upsert ile ekle / güncelle
  const products = [
    {
      name: 'Kırmızı Gül Buketi',
      slug: 'kirmizi-gul-buketi',
      description: '12 adet taze kırmızı gül ile hazırlanmış romantik buket.',
      price: 299.99,
      image: '/images/products/kirmizi-gul-1.png',
      images: ['/images/products/kirmizi-gul-1.png'],
      stock: 50,
      categoryId: categories[0].id,
      featured: true
    },
    {
      name: 'Pembe Gül Sepeti',
      slug: 'pembe-gul-sepeti',
      description: 'Hasır sepet içinde 15 adet pembe gül.',
      price: 329.99,
      image: '/images/products/pembe-gul-sepet.jpg',
      images: [],
      stock: 20,
      categoryId: categories[0].id,
      featured: false
    },
    {
      name: 'Orkide Aranjmanı',
      slug: 'orkide-aranjmani',
      description: 'Beyaz orkide çiçeklerinden oluşan zarif aranjman.',
      price: 399.99,
      image: '/images/products/beyaz-lilyum-1.jpg',
      stock:20,
      categoryId: categories[1].id,
      featured: true
    }

    // diğer ürünler...
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product },
      create: product
    })
  }

  console.log('✅ Seed tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
