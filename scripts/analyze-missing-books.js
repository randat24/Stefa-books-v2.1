const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

async function analyzeMissingBooks() {
  console.log('🔍 Analyzing missing books in Google Sheets...\n');
  
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
    
    console.log(`📚 Total rows: ${allRows.length}\n`);
    
    // Проблемные строки из лога
    const problemRows = [63, 65, 66, 70, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106];
    
    console.log(`🔍 Analyzing ${problemRows.length} problem rows:\n`);
    
    problemRows.forEach(rowNum => {
      const index = rowNum - 2; // Google Sheets строки начинаются с 2 (1 - заголовки)
      if (index >= 0 && index < allRows.length) {
        const row = allRows[index];
        
        const title = row.get('Назва') || '';
        const author = row.get('Автор') || '';
        const publisher = row.get('Видавництво') || '';
        const category = row.get('Категорія') || '';
        
        console.log(`📖 Row ${rowNum} (index ${index}):`);
        console.log(`   Назва: "${title}"`);
        console.log(`   Автор: "${author}"`);
        console.log(`   Видавництво: "${publisher}"`);
        console.log(`   Категорія: "${category}"`);
        
        // Показываем все столбцы для анализа
        const allData = {};
        booksSheet.headerValues.forEach(header => {
          const value = row.get(header);
          if (value && value.trim()) {
            allData[header] = value;
          }
        });
        
        if (Object.keys(allData).length > 0) {
          console.log(`   📋 Все непустые поля:`, JSON.stringify(allData, null, 2));
        } else {
          console.log(`   ⚠️  Строка полностью пустая`);
        }
        console.log('');
      } else {
        console.log(`❌ Row ${rowNum} is out of range (total rows: ${allRows.length})`);
      }
    });
    
    // Статистика по всем строкам
    let validBooks = 0;
    let partialBooks = 0;
    let emptyRows = 0;
    
    allRows.forEach((row, index) => {
      const title = (row.get('Назва') || '').trim();
      const author = (row.get('Автор') || '').trim();
      
      if (title && author) {
        validBooks++;
      } else if (title || author) {
        partialBooks++;
        console.log(`⚠️  Partial data at row ${index + 2}: title="${title}", author="${author}"`);
      } else {
        emptyRows++;
      }
    });
    
    console.log('\n📊 Statistics:');
    console.log(`   ✅ Valid books (title + author): ${validBooks}`);
    console.log(`   ⚠️  Partial books (title OR author): ${partialBooks}`);
    console.log(`   ❌ Empty rows: ${emptyRows}`);
    console.log(`   📚 Total rows: ${allRows.length}`);
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    process.exit(1);
  }
}

// Запускаем анализ
analyzeMissingBooks();