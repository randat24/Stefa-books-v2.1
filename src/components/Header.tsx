export default function Header(){
  return (
    <header className='p-4 border-b backdrop-blur bg-white/70 sticky top-0 z-50'>
      <div className="container-default flex items-center justify-between">
        <div className="font-semibold">Stefa.Books</div>
        <nav className="flex gap-2">
          <a href="/" className="px-3 py-2 rounded-full hover:bg-gray-100 text-sm">Головна</a>
          <a href="/books" className="px-3 py-2 rounded-full hover:bg-gray-100 text-sm">Книги</a>
        </nav>
      </div>
    </header>
  );
}
