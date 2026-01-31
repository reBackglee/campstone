import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

function BooksPage() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    publication_year: '',
    stock: '',
    author_id: '',
    category_id: '',
    publisher_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes, publishersRes] = await Promise.all([
        supabase.from('books').select(`
          *,
          authors(id, name),
          categories(id, name),
          publishers(id, name)
        `).order('id', { ascending: true }),
        supabase.from('authors').select('id, name').order('name'),
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('publishers').select('id, name').order('name')
      ])

      if (booksRes.error) throw booksRes.error
      setBooks(booksRes.data || [])
      setAuthors(authorsRes.data || [])
      setCategories(categoriesRes.data || [])
      setPublishers(publishersRes.data || [])
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const bookData = {
        title: formData.title,
        publication_year: formData.publication_year ? parseInt(formData.publication_year) : null,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        author_id: formData.author_id ? parseInt(formData.author_id) : null,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        publisher_id: formData.publisher_id ? parseInt(formData.publisher_id) : null
      }

      if (selectedBook) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', selectedBook.id)

        if (error) throw error
        toast.success('Kitap başarıyla güncellendi!')
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData])

        if (error) throw error
        toast.success('Kitap başarıyla eklendi!')
      }

      setIsModalOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu!')
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', selectedBook.id)

      if (error) throw error
      toast.success('Kitap başarıyla silindi!')
      fetchData()
    } catch (error) {
      toast.error('Silme işlemi sırasında hata oluştu!')
    }
  }

  const openEditModal = (book) => {
    setSelectedBook(book)
    setFormData({
      title: book.title,
      publication_year: book.publication_year || '',
      stock: book.stock || '',
      author_id: book.author_id || '',
      category_id: book.category_id || '',
      publisher_id: book.publisher_id || ''
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (book) => {
    setSelectedBook(book)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setSelectedBook(null)
    setFormData({
      title: '',
      publication_year: '',
      stock: '',
      author_id: '',
      category_id: '',
      publisher_id: ''
    })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📚</span> Kitaplar
          </h1>
          <p className="text-slate-400 mt-1">Kitapları ekleyin, düzenleyin ve silin</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kitap
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/30">
              <th className="text-left text-slate-300 font-medium px-6 py-4">ID</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Kitap Adı</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Yazar</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Kategori</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Yayıncı</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Yıl</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Stok</th>
              <th className="text-right text-slate-300 font-medium px-6 py-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr 
                key={book.id} 
                className={`border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                  index % 2 === 0 ? 'bg-slate-800/20' : ''
                }`}
              >
                <td className="px-6 py-4 text-slate-400">{book.id}</td>
                <td className="px-6 py-4 text-white font-medium">{book.title}</td>
                <td className="px-6 py-4 text-slate-300">{book.authors?.name || '-'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                    {book.categories?.name || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{book.publishers?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-300">{book.publication_year || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                    book.stock > 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {book.stock || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(book)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteDialog(book)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Henüz kitap eklenmemiş.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Kitap Adı *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Kitap adını girin"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Yayın Yılı
              </label>
              <input
                type="number"
                value={formData.publication_year}
                onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Örn: 2020"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Stok Adedi
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Örn: 5"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Yazar
            </label>
            <select
              value={formData.author_id}
              onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Yazar Seçin</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Kategori
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Yayıncı
            </label>
            <select
              value={formData.publisher_id}
              onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Yayıncı Seçin</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all font-medium"
            >
              {selectedBook ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Kitabı Sil"
        message={`"${selectedBook?.title}" kitabını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </div>
  )
}

export default BooksPage
