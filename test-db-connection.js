const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing database connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Test connection
    console.log('🔄 Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Connection successful');
    
    // Check categories table
    console.log('🔄 Checking categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
      
    if (catError) {
      console.error('❌ Categories error:', catError.message);
    } else {
      console.log(`✅ Found ${categories.length} categories:`, categories.map(c => c.name));
    }
    
    // Check books table
    console.log('🔄 Checking books...');
    const { data: books, error: bookError } = await supabase
      .from('books')
      .select('*')
      .limit(5);
      
    if (bookError) {
      console.error('❌ Books error:', bookError.message);
      console.error('Full error:', bookError);
    } else {
      console.log(`✅ Found ${books.length} books:`, books.map(b => b.title || b.name));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();