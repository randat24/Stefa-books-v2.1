#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Конфигурация Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdrladrtjngzloiyihyk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcmxhZHJ0am5nemxvaXlpaHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDM5ODU4NCwiZXhwIjoyMDY5OTc0NTg0fQ.keGyqWQvrmx0q7labPCiz-7QID5VgdhvEE4Ak1UJ8h4'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Все книги из каталога
const CATALOG_BOOKS = [
  {
    id: "1",
    title: "Дві білки і шишка з гілки",
    author: "Світлана Максименко",
    cover: "/images/books/dvi-bilki-i-shishka-z-gilki_1.webp",
    category: "Дитяча література",
    code: "DL-001",
    pages: 32,
    status: "Нове",
    available: true,
    rating: { value: 4.8, count: 156 },
    badges: ["Нове"],
    short: "Чарівна історія про двох білочок та їхні пригоди в лісі. Книга навчає дітей дружбі, взаємодопомозі та турботі про природу. Яскраві ілюстрації та цікавий сюжет зачарують маленьких читачів віком від 3 років."
  },
  {
    id: "2", 
    title: "Джуді Муді",
    author: "Меґан Макдональд",
    cover: "/images/books/dzhudi-mudi_8.webp",
    category: "Дитяча література",
    code: "DL-002",
    pages: 160,
    status: "В тренді",
    available: true,
    rating: { value: 4.7, count: 203 },
    badges: ["В тренді"],
    short: "Веселі пригоди незвичайної дівчинки Джуді Муді, яка завжди потрапляє в кумедні ситуації. Книга розвиває почуття гумору та допомагає дітям краще розуміти емоції. Ідеально для читання школярами."
  },
  {
    id: "3",
    title: "Гімназист і чорна рука", 
    author: "Олекса Стороженко",
    cover: "/images/books/gimnazist-i-chorna-ruka_3.webp",
    category: "Дитяча література",
    code: "DL-003",
    pages: 200,
    status: "Класика",
    available: false,
    rating: { value: 4.5, count: 89 },
    badges: ["Класика"],
    short: "Захоплююча пригодницька повість про гімназиста та таємничі події. Класичний твір української дитячої літератури, який поєднує детектив з життям підлітків. Розвиває логічне мислення та цікавість до читання."
  },
  {
    id: "4",
    title: "Казочки Доні та Синочку",
    author: "Народні українські казки",
    cover: "/images/books/kazochki-doni-ta-sinochku-ukrains-ki-kazki.webp",
    category: "Казки", 
    code: "KZ-001",
    pages: 96,
    status: "В тренді",
    age: "4+",
    available: true,
    rating: { value: 4.9, count: 145 },
    badges: ["В тренді"],
    short: "Збірка українських народних казок про Доню та Синочка. Традиційні історії, які передавалися з покоління в покоління. Виховують добрі цінності та знайомлять дітей з українською культурою."
  },
  {
    id: "5",
    title: "Тракторець боїться",
    author: "Петро Синявський", 
    cover: "/images/books/traktorec-boit-sja.webp",
    category: "Дитяча література",
    code: "DL-004", 
    pages: 48,
    status: "Нове",
    age: "3+",
    available: true,
    rating: { value: 4.6, count: 72 },
    badges: ["Нове"],
    short: "Добра історія про маленького тракторця, який подолав свої страхи. Книга допомагає дітям справлятися з власними переживаннями та вчить бути сміливими. Чудові ілюстрації та простий текст для найменших."
  },
  {
    id: "6", 
    title: "Під жовтим небом мрій",
    author: "Марина Павленко",
    cover: "/images/books/pid-zhovtim-nebom-mrij.webp",
    category: "Підліткова література",
    code: "PL-001",
    pages: 240,
    status: "В тренді", 
    age: "12+",
    available: true,
    rating: { value: 4.8, count: 118 },
    badges: ["В тренді"],
    short: "Лірична повість про підлітків, їхні мрії та перші кохання. Автор тонко передає емоції молодості та важливість віри в себе. Книга допомагає підліткам краще розуміти себе та свої почуття."
  },
  {
    id: "7",
    title: "Заєць Гібіскус і чемпіонат лісу з футболу", 
    author: "Енді Райлі",
    cover: "/images/books/zaec-gibiskus-i-chempionat-lisu-z-futbolu.webp",
    category: "Дитяча література",
    code: "DL-005",
    pages: 128,
    status: "Нове",
    age: "6+", 
    available: false,
    rating: { value: 4.4, count: 67 },
    badges: ["Нове"], 
    short: "Весела історія про зайця Гібіскуса та лісовий футбольний турнір. Книга навчає командній роботі, справедливості та тому, що перемога - це не головне. Ідеально для маленьких любителів спорту."
  },
  {
    id: "8",
    title: "Захар Беркут",
    author: "Іван Франко",
    cover: "/images/books/zahar-berkut_4_1.webp", 
    category: "Класика",
    code: "KL-001",
    pages: 320,
    status: "Класика",
    age: "14+",
    available: true,
    rating: { value: 4.7, count: 134 },
    badges: ["Класика"],
    short: "Видатний історичний роман Івана Франка про боротьбу карпатських горян проти монголо-татарських завойовників. Епічна розповідь про мужність, патріотизм та любов до рідної землі. Шедевр української літератури."
  },
  {
    id: "9", 
    title: "Пригоди в дивовижному світі",
    author: "Анна Красуля",
    cover: "/images/books/image_processing20240819-40-j6ogl7.webp",
    category: "Фантастика для дітей", 
    code: "FD-001",
    pages: 192,
    status: "Нове",
    age: "8+",
    available: true,
    rating: { value: 4.6, count: 91 },
    badges: ["Нове"],
    short: "Захоплююча фантастична історія про дітей, які потрапляють до паралельного світу. Книга розвиває уяву, навчає дружбі та відвазі. Яскравий сюжет та несподівані повороти подій зачарують юних читачів."
  },
  {
    id: "10",
    title: "Лісові пригоди", 
    author: "Оксана Драгоманова",
    cover: "/images/books/d7325c14_4b11e07649665b222b0df664aa33a60f-1.webp",
    category: "Природничі оповідання",
    code: "PO-001", 
    pages: 144,
    status: "В тренді",
    available: true,
    rating: { value: 4.5, count: 189 },
    badges: ["В тренді"],
    short: "Збірка пізнавальних оповідань про тварин лісу та їхнє життя. Книга навчає дітей любити природу та дбайливо ставитися до довкілля. Поєднує захоплюючі історії з корисними знаннями про природу."
  },
  {
    id: "11",
    title: "Казки старого дуба", 
    author: "Галина Малик",
    cover: "/images/books/becfc41438e625b9.jpg",
    category: "Казки",
    code: "KZ-002", 
    pages: 112,
    status: "Нове",
    available: true,
    rating: { value: 4.8, count: 143 },
    badges: ["Нове"],
    short: "Чарівні казки, які розповідає мудрий старий дуб лісовим мешканцям. Кожна історія несе важливий життєвий урок про доброту, мудрість та взаємодопомогу. Красиві ілюстрації та захоплюючі сюжети."
  },
  {
    id: "12",
    title: "Молодіжні пригоди", 
    author: "Тетяна Стус",
    cover: "/images/books/a202209a29003755.jpg",
    category: "Підліткова література",
    code: "PL-002", 
    pages: 280,
    status: "В тренді",
    available: true,
    rating: { value: 4.6, count: 167 },
    badges: ["В тренді"],
    short: "Сучасна повість про підлітків та їхні пошуки себе у складному світі. Автор торкається важливих тем дружби, перших кохань та життєвих виборів. Актуальна та зрозуміла мова для сучасної молоді."
  },
  {
    id: "13",
    title: "Чарівний ліс", 
    author: "Богдан Лепкий",
    cover: "/images/books/74e10b67_9789664484104.webp",
    category: "Казки",
    code: "KZ-003", 
    pages: 96,
    status: "Класика",
    available: false,
    rating: { value: 4.7, count: 201 },
    badges: ["Класика"],
    short: "Класичні українські казки про чарівний ліс та його мешканців. Традиційні мотиви поєднані з унікальним авторським стилем. Виховують національну свідомість та любов до рідної культури."
  },
  {
    id: "14",
    title: "Секрети дитинства", 
    author: "Ірина Жиленко",
    cover: "/images/books/adea76185896e86af796c11e23feee06.webp",
    category: "Сімейні історії",
    code: "SI-001", 
    pages: 176,
    status: "В тренді",
    available: true,
    rating: { value: 4.9, count: 89 },
    badges: ["В тренді"],
    short: "Тепла розповідь про дитинство, сім'ю та перші життєві відкриття. Книга допомагає зрозуміти важливість родинних цінностей та традицій. Лагідний стиль та глибокі емоції зачеплять серця читачів."
  },
  {
    id: "15",
    title: "Пригоди юного дослідника", 
    author: "Максим Рильський",
    cover: "/images/books/f7f62476f026ed35.jpg",
    category: "Пізнавальна література",
    code: "PZ-001", 
    pages: 208,
    status: "Нове",
    available: true,
    rating: { value: 4.5, count: 124 },
    badges: ["Нове"],
    short: "Захоплююча книга для дітей про наукові відкриття та дослідження. Поєднує пригодницький сюжет з корисними знаннями про світ науки. Надихає дітей на пізнання та експериментування."
  },
  {
    id: "16",
    title: "Таємниці старого замку", 
    author: "Володимир Винниченко",
    cover: "/images/books/9ab0e8524aed78ad.jpg",
    category: "Містика для дітей",
    code: "MD-001", 
    pages: 192,
    status: "В тренді",
    available: true,
    rating: { value: 4.6, count: 156 },
    badges: ["В тренді"],
    short: "Інтригуюча історія про дітей, які розкривають таємниці старовинного замку. Легкий присмак містики поєднаний з цікавим детективним сюжетом. Розвиває логічне мислення та уяву дітей."
  }
]

async function seedCatalogBooks() {
  try {
    console.log('🚀 Starting to seed all catalog books...')
    
    // Обновляем или добавляем книги из каталога
    
    let successCount = 0
    let totalBooks = CATALOG_BOOKS.length
    
    console.log(`📚 Loading ${totalBooks} books from catalog...`)
    
    for (const book of CATALOG_BOOKS) {
      console.log(`\n📖 Processing: "${book.title}" by ${book.author}`)
      
      // Подготавливаем данные для Supabase
      const bookData = {
        code: book.code,
        title: book.title,
        author: book.author,
        category: book.category,
        subcategory: null,
        description: book.short, // Используем короткое описание как полное
        short_description: book.short,
        isbn: null,
        pages: book.pages,
        age_range: book.age || '0+',
        language: 'Ukrainian',
        publisher: null,
        publication_year: null,
        cover_url: book.cover,
        status: book.available ? 'available' : 'issued',
        available: book.available,
        qty_total: 1,
        qty_available: book.available ? 1 : 0,
        price_uah: Math.floor(Math.random() * 200) + 100, // Случайная цена от 100 до 300 грн
        location: 'вул. Маріупольська 13/2, Миколаїв',
        rating: book.rating.value,
        rating_count: book.rating.count,
        badges: book.badges,
        tags: [book.category.toLowerCase(), book.status.toLowerCase()],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      console.log(`   💾 Checking if book exists...`)
      
      // Проверяем, существует ли книга с таким кодом
      const { data: existingBook, error: checkError } = await supabase
        .from('books')
        .select('id, code')
        .eq('code', book.code)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`   ❌ Error checking book "${book.title}":`, checkError)
        continue
      }
      
      if (existingBook) {
        // Обновляем существующую книгу
        console.log(`   🔄 Book exists, updating...`)
        const { data, error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', existingBook.id)
          .select()
        
        if (error) {
          console.error(`   ❌ Error updating "${book.title}":`, error)
        } else {
          successCount++
          console.log(`   ✅ Successfully updated "${book.title}" (ID: ${data[0]?.id})`)
          console.log(`   📊 Price: ${bookData.price_uah} ₴, Pages: ${bookData.pages}, Rating: ${bookData.rating}`)
        }
      } else {
        // Создаем новую книгу
        console.log(`   ➕ Book not found, creating new...`)
        const { data, error } = await supabase
          .from('books')
          .insert([bookData])
          .select()
        
        if (error) {
          console.error(`   ❌ Error inserting "${book.title}":`, error)
        } else {
          successCount++
          console.log(`   ✅ Successfully added "${book.title}" (ID: ${data[0]?.id})`)
          console.log(`   📊 Price: ${bookData.price_uah} ₴, Pages: ${bookData.pages}, Rating: ${bookData.rating}`)
        }
      }
    }
    
    console.log(`\n🎉 Seeding completed!`)
    console.log(`📊 Results: ${successCount}/${totalBooks} books successfully loaded`)
    
    if (successCount === totalBooks) {
      console.log(`✨ All catalog books are now in the database!`)
    }
    
  } catch (error) {
    console.error('💥 Script error:', error)
  }
}

// Запускаем скрипт
seedCatalogBooks()