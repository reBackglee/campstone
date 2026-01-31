import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

function HomePage() {
  const [stats, setStats] = useState({
    publishers: 0,
    categories: 0,
    authors: 0,
    books: 0,
    borrows: 0
  })
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch counts
      const [publishers, categories, authors, books, borrows] = await Promise.all([
        supabase.from('publishers').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('authors').select('id', { count: 'exact' }),
        supabase.from('books').select('id', { count: 'exact' }),
        supabase.from('borrows').select('id', { count: 'exact' })
      ])

      setStats({
        publishers: publishers.count || 0,
        categories: categories.count || 0,
        authors: authors.count || 0,
        books: books.count || 0,
        borrows: borrows.count || 0
      })

      // Fetch recent books with relations
      const { data: booksData } = await supabase
        .from('books')
        .select(`
          *,
          authors(name),
          categories(name),
          publishers(name)
        `)
        .order('id', { ascending: false })
        .limit(5)

      setRecentBooks(booksData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const statCards = [
    { label: 'Yayıncılar', value: stats.publishers, icon: '🏢', color: 'from-purple-500 to-purple-700' },
    { label: 'Kategoriler', value: stats.categories, icon: '📂', color: 'from-green-500 to-green-700' },
    { label: 'Yazarlar', value: stats.authors, icon: '✍️', color: 'from-orange-500 to-orange-700' },
    { label: 'Kitaplar', value: stats.books, icon: '📚', color: 'from-blue-500 to-blue-700' },
    { label: 'Ödünç İşlemleri', value: stats.borrows, icon: '📖', color: 'from-pink-500 to-pink-700' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Hoş Geldiniz! 👋
        </h1>
        <p className="text-slate-400">
          Kütüphane Yönetim Sistemi'ne hoş geldiniz. Soldaki menüden işlem yapmak istediğiniz sayfayı seçebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} p-5 rounded-2xl shadow-lg`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-white/80 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Books */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📚</span> Son Eklenen Kitaplar
        </h2>
        
        {recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                <div>
                  <h3 className="text-white font-medium">{book.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {book.authors?.name || 'Bilinmeyen Yazar'} • {book.publication_year || 'Tarih yok'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">
                    {book.categories?.name || 'Kategori yok'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    book.stock > 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    Stok: {book.stock || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">Henüz kitap eklenmemiş.</p>
        )}
      </div>
    </div>
  )
}

export default HomePage
