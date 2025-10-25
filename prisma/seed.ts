import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Kategorileri oluştur
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Buketler',
        slug: 'buketler',
        description: 'Özenle hazırlanmış taze çiçek buketleri',
        image: '/images/categories/buketler.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Aranjmanlar',
        slug: 'aranjmanlar',
        description: 'Şık ve zarif çiçek aranjmanları',
        image: '/images/categories/aranjmanlar.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Saksılı Çiçekler',
        slug: 'saksili-cicekler',
        description: 'Uzun ömürlü saksılı çiçekler',
        image: '/images/categories/saksili.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Özel Günler',
        slug: 'ozel-gunler',
        description: 'Özel günler için tasarlanmış buketler',
        image: '/images/categories/ozel-gunler.jpg'
      }
    })
  ])

  // Ürünleri oluştur
  const products = [
    {
      name: 'Kırmızı Gül Buketi',
      slug: 'kirmizi-gul-buketi',
      description: '12 adet taze kırmızı gül ile hazırlanmış romantik buket. Sevdiklerinize aşkınızı ifade etmenin en güzel yolu.',
      price: 299.99,
      image: '/images/products/kirmizi-gul.png',
      images: ['/images/products/kirmizi-gul-1.png'],
      stock: 50,
      categoryId: categories[0].id,
      featured: true
    },
    {
      name: 'Beyaz Lilyum Aranjmanı',
      slug: 'beyaz-lilyum-aranjmani',
      description: 'Zarif beyaz lilyumlar ile hazırlanmış özel aranjman. Modern ve şık tasarım.',
      price: 399.99,
      image: '/images/products/beyaz-lilyum.jpg',
      images: ['/images/products/beyaz-lilyum-1.jpg'],
      stock: 30,
      categoryId: categories[1].id,
      featured: true
    },
    {
      name: 'Karışık Mevsim Buketi',
      slug: 'karisik-mevsim-buketi',
      description: 'Mevsimin en taze çiçekleri ile renkli ve canlı buket. Her gün farklı çiçeklerle hazırlanır.',
      price: 249.99,
      image: '/images/products/karisik-buket.jpg',
      images: [],
      stock: 40,
      categoryId: categories[0].id,
      featured: true
    },
    {
      name: 'Orkide Saksısı',
      slug: 'orkide-saksisi',
      description: 'Uzun ömürlü ve zarif orkide bitkisi. İç mekan süslemesi için ideal.',
      price: 179.99,
      image: '/images/products/orkide.jpg',
      images: [],
      stock: 25,
      categoryId: categories[2].id,
      featured: false
    },
    {
      name: 'Doğum Günü Özel Buket',
      slug: 'dogum-gunu-ozel-buket',
      description: 'Renkli ve neşeli çiçeklerle hazırlanmış doğum günü buketi. Balon ve mesaj kartı hediye.',
      price: 349.99,
      image: '/images/products/dogumgunu-buket.jpg',
      images: [],
      stock: 35,
      categoryId: categories[3].id,
      featured: true
    },
    {
      name: 'Pembe Gül Sepeti',
      slug: 'pembe-gul-sepeti',
      description: 'Hasır sepet içinde 15 adet pembe gül. Romantik ve zarif bir hediye.',
      price: 329.99,
      image: '/images/products/pembe-gul-sepet.jpg',
      images: [],
      stock: 20,
      categoryId: categories[0].id,
      featured: false
    },
    {
      name: 'Lavanta Buketi',
      slug: 'lavanta-buketi',
      description: 'Kokulu lavanta dalları ile huzur dolu bir buket. Rahatlatıcı kokusu ile özel.',
      price: 199.99,
      image: '/images/products/lavanta.jpg',
      images: [],
      stock: 45,
      categoryId: categories[0].id,
      featured: false
    },
    {
      name: 'Gerbera Aranjmanı',
      slug: 'gerbera-aranjmani',
      description: 'Renkli gerberalar ile hazırlanmış neşeli aranjman. Mutluluk ve enerji dolu.',
      price: 279.99,
      image: '/images/products/gerbera.jpg',
      images: [],
      stock: 30,
      categoryId: categories[1].id,
      featured: false
    }
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
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