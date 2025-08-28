const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Books data from mock.ts
const BOOKS = [
  {
    id: "1",
    title: "Дві білки і шишка з гілки",
    author: "Світлана Максименко",
    cover: "/images/books/dvi-bilki-i-shishka-z-gilki_1.webp",
    category: "Дитяча література",
    code: "DL-001",
    pages: 32,
    status: "available",
    available: true,
    rating: 4.8,
    rating_count: 156,
    badges: ["Нове"],
    short: "Чарівна історія про двох білочок та їхні пригоди в лісі. Книга навчає дітей дружбі, взаємодопомозі та турботі про природу. Яскраві ілюстрації та цікавий сюжет зачарують маленьких читачів віком від 3 років.",
    age_range: "3+",
    price_uah: 150
  },
  {
    id: "2", 
    title: "Джуді Муді",
    author: "Меґан Макдональд",
    cover: "/images/books/dzhudi-mudi_8.webp",
    category: "Дитяча література",
    code: "DL-002",
    pages: 160,
    status: "available",
    available: true,
    rating: 4.7,
    rating_count: 203,
    badges: ["В тренді"],
    short: "Веселі пригоди незвичайної дівчинки Джуді Муді, яка завжди потрапляє в кумедні ситуації. Книга розвиває почуття гумору та допомагає дітям краще розуміти емоції. Ідеально для читання школярами.",
    price_uah: 180
  },
  {
    id: "3",
    title: "Гімназист і чорна рука", 
    author: "Олекса Стороженко",
    cover: "/images/books/gimnazist-i-chorna-ruka_3.webp",
    category: "Дитяча література",
    code: "DL-003",
    pages: 200,
    status: "issued",
    available: false,
    rating: 4.5,
    rating_count: 89,
    badges: ["Класика"],
    short: "Захоплююча пригодницька повість про гімназиста та таємничі події. Класичний твір української дитячої літератури, який поєднує детектив з життям підлітків. Розвиває логічне мислення та цікавість до читання.",
    price_uah: 200
  },
  {
    id: "4",
    title: "Казочки Доні та Синочку",
    author: "Народні українські казки",
    cover: "/images/books/kazochki-doni-ta-sinochku-ukrains-ki-kazki.webp",
    category: "Казки", 
    code: "KZ-001",
    pages: 96,
    status: "available",
    age_range: "4+",
    available: true,
    rating: 4.9,
    rating_count: 145,
    badges: ["В тренді"],
    short: "Збірка українських народних казок про Доню та Синочка. Традиційні історії, які передавалися з покоління в покоління. Виховують добрі цінності та знайомлять дітей з українською культурою.",
    price_uah: 120
  },
  {
    id: "5",
    title: "Тракторець боїться",
    author: "Петро Синявський", 
    cover: "/images/books/traktorec-boit-sja.webp",
    category: "Дитяча література",
    code: "DL-004", 
    pages: 48,
    status: "available",
    age_range: "3+",
    available: true,
    rating: 4.6,
    rating_count: 72,
    badges: ["Нове"],
    short: "Добра історія про маленького тракторця, який подолав свої страхи. Книга допомагає дітям справлятися з власними переживаннями та вчить бути сміливими. Чудові ілюстрації та простий текст для найменших.",
    price_uah: 100
  },
  {
    id: "6", 
    title: "Під жовтим небом мрій",
    author: "Марина Павленко",
    cover: "/images/books/pid-zhovtim-nebom-mrij.webp",
    category: "Підліткова література",
    code: "PL-001",
    pages: 240,
    status: "available", 
    age_range: "12+",
    available: true,
    rating: 4.8,
    rating_count: 118,
    badges: ["В тренді"],
    short: "Лірична повість про підлітків, їхні мрії та перші кохання. Автор тонко передає емоції молодості та важливість віри в себе. Книга допомагає підліткам краще розуміти себе та свої почуття.",
    price_uah: 220
  },
  {
    id: "7",
    title: "Заєць Гібіскус і чемпіонат лісу з футболу", 
    author: "Енді Райлі",
    cover: "/images/books/zaec-gibiskus-i-chempionat-lisu-z-futbolu.webp",
    category: "Дитяча література",
    code: "DL-005",
    pages: 128,
    status: "issued",
    age_range: "6+", 
    available: false,
    rating: 4.4,
    rating_count: 67,
    badges: ["Нове"], 
    short: "Весела історія про зайця Гібіскуса та лісовий футбольний турнір. Книга навчає командній роботі, справедливості та тому, що перемога - це не головне. Ідеально для маленьких любителів спорту.",
    price_uah: 170
  },
  {
    id: "8",
    title: "Захар Беркут",
    author: "Іван Франко",
    cover: "/images/books/zahar-berkut_4_1.webp", 
    category: "Класика",
    code: "KL-001",
    pages: 320,
    status: "available",
    age_range: "14+",
    available: true,
    rating: 4.7,
    rating_count: 134,
    badges: ["Класика"],
    short: "Видатний історичний роман Івана Франка про боротьбу карпатських горян проти монголо-татарських завойовників. Епічна розповідь про мужність, патріотизм та любов до рідної землі. Шедевр української літератури.",
    price_uah: 300
  },
  {
    id: "9", 
    title: "Пригоди в дивовижному світі",
    author: "Анна Красуля",
    cover: "/images/books/image_processing20240819-40-j6ogl7.webp",
    category: "Фантастика для дітей", 
    code: "FD-001",
    pages: 192,
    status: "available",
    age_range: "8+",
    available: true,
    rating: 4.6,
    rating_count: 91,
    badges: ["Нове"],
    short: "Захоплююча фантастична історія про дітей, які потрапляють до паралельного світу. Книга розвиває уяву, навчає дружбі та відвазі. Яскравий сюжет та несподівані повороти подій зачарують юних читачів.",
    price_uah: 190
  },
  {
    id: "10",
    title: "Лісові пригоди", 
    author: "Оксана Драгоманова",
    cover: "/images/books/d7325c14_4b11e07649665b222b0df664aa33a60f-1.webp",
    category: "Природничі оповідання",
    code: "PO-001", 
    pages: 144,
    status: "available",
    available: true,
    rating: 4.5,
    rating_count: 189,
    badges: ["В тренді"],
    short: "Збірка пізнавальних оповідань про тварин лісу та їхнє життя. Книга навчає дітей любити природу та дбайливо ставитися до довкілля. Поєднує захоплюючі історії з корисними знаннями про природу.",
    price_uah: 160
  },
  {
    id: "11",
    title: "Казки старого дуба", 
    author: "Галина Малик",
    cover: "/images/books/becfc41438e625b9.jpg",
    category: "Казки",
    code: "KZ-002", 
    pages: 112,
    status: "available",
    available: true,
    rating: 4.8,
    rating_count: 143,
    badges: ["Нове"],
    short: "Чарівні казки, які розповідає мудрий старий дуб лісовим мешканцям. Кожна історія несе важливий життєвий урок про доброту, мудрість та взаємодопомогу. Красиві ілюстрації та захоплюючі сюжети.",
    price_uah: 130
  },
  {
    id: "12",
    title: "Молодіжні пригоди", 
    author: "Тетяна Стус",
    cover: "/images/books/a202209a29003755.jpg",
    category: "Підліткова література",
    code: "PL-002", 
    pages: 280,
    status: "available",
    available: true,
    rating: 4.6,
    rating_count: 167,
    badges: ["В тренді"],
    short: "Сучасна повість про підлітків та їхні пошуки себе у складному світі. Автор торкається важливих тем дружби, перших кохань та життєвих виборів. Актуальна та зрозуміла мова для сучасної молоді.",
    price_uah: 250
  },
  {
    id: "13",
    title: "Чарівний ліс", 
    author: "Богдан Лепкий",
    cover: "/images/books/74e10b67_9789664484104.webp",
    category: "Казки",
    code: "KZ-003", 
    pages: 96,
    status: "issued",
    available: false,
    rating: 4.7,
    rating_count: 201,
    badges: ["Класика"],
    short: "Класичні українські казки про чарівний ліс та його мешканців. Традиційні мотиви поєднані з унікальним авторським стилем. Виховують національну свідомість та любов до рідної культури.",
    price_uah: 140
  },
  {
    id: "14",
    title: "Секрети дитинства", 
    author: "Ірина Жиленко",
    cover: "/images/books/adea76185896e86af796c11e23feee06.webp",
    category: "Сімейні історії",
    code: "SI-001", 
    pages: 176,
    status: "available",
    available: true,
    rating: 4.9,
    rating_count: 89,
    badges: ["В тренді"],
    short: "Тепла розповідь про дитинство, сім'ю та перші життєві відкриття. Книга допомагає зрозуміти важливість родинних цінностей та традицій. Лагідний стиль та глибокі емоції зачеплять серця читачів.",
    price_uah: 180
  },
  {
    id: "15",
    title: "Пригоди юного дослідника", 
    author: "Максим Рильський",
    cover: "/images/books/f7f62476f026ed35.jpg",
    category: "Пізнавальна література",
    code: "PZ-001", 
    pages: 208,
    status: "available",
    available: true,
    rating: 4.5,
    rating_count: 124,
    badges: ["Нове"],
    short: "Захоплююча книга для дітей про наукові відкриття та дослідження. Поєднує пригодницький сюжет з корисними знаннями про світ науки. Надихає дітей на пізнання та експериментування.",
    price_uah: 210
  },
  {
    id: "16",
    title: "Таємниці старого замку", 
    author: "Володимир Винниченко",
    cover: "/images/books/9ab0e8524aed78ad.jpg",
    category: "Містика для дітей",
    code: "MD-001", 
    pages: 192,
    status: "available",
    available: true,
    rating: 4.6,
    rating_count: 156,
    badges: ["В тренді"],
    short: "Інтригуюча історія про дітей, які розкривають таємниці старовинного замку. Легкий присмак містики поєднаний з цікавим детективним сюжетом. Розвиває логічне мислення та уяву дітей.",
    price_uah: 200
  }
]

async function seedBooks() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🌱 Starting book seeding...')

  try {
    // First, clear existing books (optional)
    console.log('Clearing existing books...')
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .neq('id', 'never-match') // Delete all rows

    if (deleteError) {
      console.warn('Warning during clearing books:', deleteError.message)
    }

    // Insert books one by one to avoid conflicts
    for (const book of BOOKS) {
      console.log(`📚 Inserting: ${book.title}...`)
      
      const bookData = {
        code: book.code,
        title: book.title,
        author: book.author,
        category: book.category,
        subcategory: null,
        description: book.short,
        short_description: book.short,
        isbn: null,
        pages: book.pages,
        age_range: book.age_range || null,
        language: 'Ukrainian',
        publisher: null,
        publication_year: null,
        cover_url: `http://localhost:3000${book.cover}`, // Local development URL
        status: book.status,
        qty_total: 1,
        qty_available: book.available ? 1 : 0,
        available: book.available,
        price_uah: book.price_uah,
        location: 'вул. Маріупольська 13/2, Кафе "Книжкова"',
        rating: book.rating,
        rating_count: book.rating_count,
        badges: book.badges,
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting ${book.title}:`, error.message)
      } else {
        console.log(`✅ Successfully inserted: ${book.title}`)
      }
    }

    console.log('🎉 Book seeding completed!')
    
    // Get final count
    const { count, error: countError } = await supabase
      .from('books')
      .select('*', { count: 'exact' })

    if (!countError) {
      console.log(`📊 Total books in database: ${count}`)
    }

  } catch (error) {
    console.error('💥 Seeding failed:', error)
  }
}

// Run the seeding
seedBooks()