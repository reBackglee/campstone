import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

function PublishersPage() {
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPublisher, setSelectedPublisher] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    establishment_year: '',
    address: ''
  })

  useEffect(() => {
    fetchPublishers()
  }, [])

  const fetchPublishers = async () => {
    try {
      const { data, error } = await supabase
        .from('publishers')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setPublishers(data || [])
    } catch (error) {
      toast.error('Yayıncılar yüklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (selectedPublisher) {
        // Update
        const { error } = await supabase
          .from('publishers')
          .update({
            name: formData.name,
            establishment_year: formData.establishment_year ? parseInt(formData.establishment_year) : null,
            address: formData.address || null
          })
          .eq('id', selectedPublisher.id)

        if (error) throw error
        toast.success('Yayıncı başarıyla güncellendi!')
      } else {
        // Create
        const { error } = await supabase
          .from('publishers')
          .insert([{
            name: formData.name,
            establishment_year: formData.establishment_year ? parseInt(formData.establishment_year) : null,
            address: formData.address || null
          }])

        if (error) throw error
        toast.success('Yayıncı başarıyla eklendi!')
      }

      setIsModalOpen(false)
      resetForm()
      fetchPublishers()
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu!')
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('publishers')
        .delete()
        .eq('id', selectedPublisher.id)

      if (error) throw error
      toast.success('Yayıncı başarıyla silindi!')
      fetchPublishers()
    } catch (error) {
      toast.error('Silme işlemi sırasında hata oluştu!')
    }
  }

  const openEditModal = (publisher) => {
    setSelectedPublisher(publisher)
    setFormData({
      name: publisher.name,
      establishment_year: publisher.establishment_year || '',
      address: publisher.address || ''
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (publisher) => {
    setSelectedPublisher(publisher)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setSelectedPublisher(null)
    setFormData({ name: '', establishment_year: '', address: '' })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🏢</span> Yayıncılar
          </h1>
          <p className="text-slate-400 mt-1">Yayıncıları ekleyin, düzenleyin ve silin</p>
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
          Yeni Yayıncı
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/30">
              <th className="text-left text-slate-300 font-medium px-6 py-4">ID</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Yayıncı Adı</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Kuruluş Yılı</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Adres</th>
              <th className="text-right text-slate-300 font-medium px-6 py-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((publisher, index) => (
              <tr 
                key={publisher.id} 
                className={`border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                  index % 2 === 0 ? 'bg-slate-800/20' : ''
                }`}
              >
                <td className="px-6 py-4 text-slate-400">{publisher.id}</td>
                <td className="px-6 py-4 text-white font-medium">{publisher.name}</td>
                <td className="px-6 py-4 text-slate-300">{publisher.establishment_year || '-'}</td>
                <td className="px-6 py-4 text-slate-300">{publisher.address || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(publisher)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteDialog(publisher)}
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

        {publishers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Henüz yayıncı eklenmemiş.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPublisher ? 'Yayıncı Düzenle' : 'Yeni Yayıncı Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Yayıncı Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Yayıncı adını girin"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Kuruluş Yılı
            </label>
            <input
              type="number"
              value={formData.establishment_year}
              onChange={(e) => setFormData({ ...formData, establishment_year: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Örn: 1990"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Adres
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Adres bilgisi girin"
              rows={3}
            />
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
              {selectedPublisher ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Yayıncıyı Sil"
        message={`"${selectedPublisher?.name}" yayıncısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </div>
  )
}

export default PublishersPage
