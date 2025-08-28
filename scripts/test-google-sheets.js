const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

async function testGoogleSheets() {
  console.log('🔍 Testing Google Sheets connection...\n');
  
  // Проверяем переменные окружения
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  
  console.log('📋 Environment variables:');
  console.log(`Client Email: ${clientEmail || 'NOT SET'}`);
  console.log(`Private Key: ${privateKey ? 'SET (length: ' + privateKey.length + ')' : 'NOT SET'}`);
  console.log(`Spreadsheet ID: ${spreadsheetId || 'NOT SET'}\n`);
  
  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.log('❌ Missing required environment variables');
    return;
  }
  
  try {
    // Создаем аутентификацию
    console.log('🔐 Creating JWT authentication...');
    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('📄 Connecting to Google Spreadsheet...');
    const doc = new GoogleSpreadsheet(spreadsheetId, auth);
    
    // Загружаем информацию о документе
    await doc.loadInfo();
    
    console.log('✅ Successfully connected to Google Sheets!');
    console.log(`📊 Document title: "${doc.title}"`);
    console.log(`📋 Number of sheets: ${doc.sheetCount}\n`);
    
    console.log('📑 Available sheets:');
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`  ${index + 1}. "${sheet.title}" (${sheet.rowCount} rows, ${sheet.columnCount} columns)`);
    });
    
    // Проверяем наличие листа Books или "Каталог книг"
    let booksSheet = doc.sheetsByTitle['Books'] || doc.sheetsByTitle['Каталог книг'];
    
    if (booksSheet) {
      console.log(`\n✅ Found "${booksSheet.title}" sheet!`);
      console.log(`📏 Dimensions: ${booksSheet.rowCount} rows × ${booksSheet.columnCount} columns`);
      
      // Загружаем данные листа
      await booksSheet.loadHeaderRow();
      console.log('\n📝 Available columns:');
      const headers = booksSheet.headerValues;
      headers.forEach((header, index) => {
        console.log(`  ${index + 1}. ${header}`);
      });
      
      // Получаем образцы данных
      const allRows = await booksSheet.getRows({ limit: 5 });
      console.log(`\n📚 First 5 books from sheet:`);
      
      allRows.forEach((row, index) => {
        console.log(`\n📖 Book ${index + 1}:`);
        console.log(`  Название: ${row.get('Название книги') || row.get('title') || row.get('Назва') || '(empty)'}`);
        console.log(`  Автор: ${row.get('Автор') || row.get('author') || row.get('Письменник') || '(empty)'}`);
        console.log(`  Год: ${row.get('Рік випуску') || row.get('year') || row.get('Год') || '(empty)'}`);
        console.log(`  Издательство: ${row.get('Видавництво') || row.get('publisher') || row.get('Издательство') || '(empty)'}`);
        console.log(`  Ссылка на обложку: ${row.get('Посилання на обкладинку') || row.get('cover_url') || row.get('Обложка') || '(empty)'}`);
      });
      
      // Подсчитаем общее количество строк с данными
      const totalRows = await booksSheet.getRows();
      console.log(`\n📊 Total rows with data: ${totalRows.length}`);
    } else {
      console.log('\n⚠️  No "Books" or "Каталог книг" sheet found. Available sheets:', doc.sheetsByIndex.map(s => s.title).join(', '));
    }
    
  } catch (error) {
    console.log('\n❌ Error connecting to Google Sheets:');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    
    if (error.message.includes('403') || error.message.includes('permission')) {
      console.log('\n💡 Solution: Make sure to share the spreadsheet with the service account:');
      console.log(`   ${clientEmail}`);
      console.log('   Give it "Editor" permissions.');
    }
    
    if (error.message.includes('private_key')) {
      console.log('\n💡 Solution: Check the GOOGLE_SHEETS_PRIVATE_KEY format.');
      console.log('   Make sure it includes \\n characters and is properly quoted.');
    }
  }
}

testGoogleSheets().catch(console.error);