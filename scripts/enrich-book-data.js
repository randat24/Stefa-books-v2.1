const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

// Функция для создания описания книги на основе названия и автора
function generateBookDescription(title, author, publisher, category) {
  const descriptions = {
    'Психологія': [
      `Глибока та прониклива книга "${title}" від ${author} допоможе вам краще зрозуміти людську психологію та особисте зростання.`,
      `"${title}" - це практичний посібник від ${author}, який розкриває секрети ефективного мислення та поведінки.`,
      `Видатна праця ${author} "${title}" пропонує новий погляд на психологічні аспекти життя та розвитку особистості.`
    ],
    'Саморозвиток': [
      `Натхненна книга "${title}" від ${author} стане вашим провідником у світі особистого розвитку та самовдосконалення.`,
      `"${title}" - це потужний інструмент для тих, хто прагне змін та росту. ${author} ділиться цінними знаннями та досвідом.`,
      `Практичні поради та мудрі настанови ${author} у книзі "${title}" допоможуть вам досягти нових висот у житті.`
    ],
    'Бізнес': [
      `Професійна книга "${title}" від ${author} розкриває секрети успішного ведення бізнесу та ефективного управління.`,
      `"${title}" - це цінний ресурс для підприємців та керівників. ${author} ділиться перевіреними стратегіями успіху.`,
      `Практичні знання та досвід ${author} у книзі "${title}" допоможуть вам побудувати успішний бізнес.`
    ],
    'Дитяча література': [
      `Чудова дитяча книга "${title}" від ${author} захоплює юних читачів цікавою історією та яскравими персонажами.`,
      `"${title}" - це захоплююча пригода для дітей, створена талановитим автором ${author}.`,
      `Книга "${title}" від ${author} розвиває уяву дітей та вчить важливим життєвим урокам через цікаву історію.`
    ],
    'default': [
      `Цікава та змістовна книга "${title}" від талановитого автора ${author} подарує вам незабутні години читання.`,
      `"${title}" - це видатна праця ${author}, яка заслуговує на увагу всіх поціновувачів хорошої літератури.`,
      `Книга "${title}" від ${author} пропонує глибокі роздуми та цікаві ідеї для всіх читачів.`
    ]
  };

  const templates = descriptions[category] || descriptions['default'];
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return randomTemplate;
}

// Функция для создания URL обложки книги
function generateCoverUrl(title, author) {
  // Создаем имя файла на основе названия книги
  const filename = title
    .toLowerCase()
    .replace(/[^а-я\w\s]/gi, '') // Убираем спецсимволы, оставляем кириллицу и латиницу
    .replace(/\s+/g, '-') // Пробелы заменяем на дефисы
    .slice(0, 50); // Ограничиваем длину
  
  return `/images/books/${filename}.jpg`;
}

async function enrichBookData() {
  console.log('🔄 Starting book data enrichment process...\n');
  
  try {
    // Подключаемся к Google Sheets
    const auth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID, auth);
    await doc.loadInfo();
    
    // Получаем лист с книгами
    const booksSheet = doc.sheetsByTitle['Каталог книг'];
    if (!booksSheet) {
      throw new Error('Sheet "Каталог книг" not found');
    }
    
    console.log('📊 Loading book data from Google Sheets...');
    await booksSheet.loadHeaderRow();
    const allRows = await booksSheet.getRows();
    
    console.log(`📚 Found ${allRows.length} books to process\n`);
    
    let processedCount = 0;
    let enrichedCount = 0;
    
    // Обрабатываем каждую книгу
    for (const [index, row] of allRows.entries()) {
      const title = row.get('Назва') || '';
      const author = row.get('Автор') || '';
      const publisher = row.get('Видавництво') || '';
      const category = row.get('Категорія') || '';
      const currentDescription = row.get('Опис') || '';
      const currentCover = row.get('Фото (URL)') || '';
      
      if (!title || !author) {
        console.log(`⚠️  Skipping row ${index + 1}: missing title or author`);
        continue;
      }
      
      let updated = false;
      
      // Добавляем описание, если его нет
      if (!currentDescription || currentDescription.trim() === '') {
        const newDescription = generateBookDescription(title, author, publisher, category);
        row.set('Опис', newDescription);
        updated = true;
        console.log(`📝 Added description for: ${title}`);
      }
      
      // Добавляем URL обложки, если его нет
      if (!currentCover || currentCover.trim() === '') {
        const newCoverUrl = generateCoverUrl(title, author);
        row.set('Фото (URL)', newCoverUrl);
        updated = true;
        console.log(`🖼️  Added cover URL for: ${title}`);
      }
      
      if (updated) {
        await row.save();
        enrichedCount++;
      }
      
      processedCount++;
      
      // Показываем прогресс каждые 10 книг
      if (processedCount % 10 === 0) {
        console.log(`⏳ Processed ${processedCount}/${allRows.length} books (${enrichedCount} enriched)`);
      }
    }
    
    console.log('\n✅ Book data enrichment completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total books processed: ${processedCount}`);
    console.log(`   - Books enriched: ${enrichedCount}`);
    console.log(`   - Books already complete: ${processedCount - enrichedCount}`);
    
  } catch (error) {
    console.error('❌ Error during book enrichment:', error.message);
    process.exit(1);
  }
}

// Запускаем процесс обогащения данных
enrichBookData();