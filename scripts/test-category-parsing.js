// Функция для парсинга сложных категорий из Google Sheets
function parseCategory(categoryString) {
  if (!categoryString) {
    return {
      category: 'Загальна література',
      subcategory: null,
      age_range: null
    };
  }

  // Разделяем категории по запятой
  const parts = categoryString.split(',').map(s => s.trim());
  
  // Возрастные категории
  const ageCategories = ['найменші', 'дошкільний вік', 'молодший вік', 'середній вік', 'старший вік'];
  const foundAges = parts.filter(part => ageCategories.includes(part));
  
  // Основные категории (не возрастные)
  const mainCategories = parts.filter(part => !ageCategories.includes(part));
  
  // Определяем основную категорию
  let category = 'Загальна література';
  let subcategory = null;
  
  if (mainCategories.length > 0) {
    category = mainCategories[0]; // Первая - основная
    if (mainCategories.length > 1) {
      subcategory = mainCategories.slice(1).join(', '); // Остальные - подкатегории
    }
  }
  
  // Определяем возрастной диапазон
  let age_range = null;
  if (foundAges.length > 0) {
    if (foundAges.includes('найменші')) age_range = '0-3';
    else if (foundAges.includes('дошкільний вік')) age_range = '3-6';
    else if (foundAges.includes('молодший вік')) age_range = '6-10';
    else if (foundAges.includes('середній вік')) age_range = '10-14';
    else if (foundAges.includes('старший вік')) age_range = '14+';
  }
  
  return { category, subcategory, age_range };
}

console.log('🧪 Testing category parsing...\n');

const testCategories = [
  'Пригоди, молодший вік',
  'Казки, дошкільний вік, молодший вік',
  'Пізнавальні, дошкільний вік',
  'Психологія',
  'Дитяча література, найменші',
  '',
  'Казки, найменші, дошкільний вік, молодший вік'
];

testCategories.forEach(cat => {
  const result = parseCategory(cat);
  console.log(`📝 Input: "${cat}"`);
  console.log(`   ✅ Category: "${result.category}"`);
  console.log(`   📂 Subcategory: ${result.subcategory || 'null'}`);
  console.log(`   👶 Age Range: ${result.age_range || 'null'}`);
  console.log('');
});

console.log('✅ Category parsing test completed!');