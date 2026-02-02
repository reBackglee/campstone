# 📚 Kütüphane Yönetim Sistemi

Modern ve kullanıcı dostu bir kütüphane yönetim sistemi. React + Tailwind CSS + Supabase ile geliştirilmiştir.

## 🌐 Canlı Demo

**[Canlı Uygulamayı Görüntüle](https://wondrous-lebkuchen-615036.netlify.app

)**

## 🚀 Özellikler

### 📖 Ana Sayfa
- Kütüphane istatistiklerinin görüntülenmesi
- Son eklenen kitapların listelenmesi
- Modern dashboard tasarımı

### 📚 Yönetim Modülleri

- **Yayıncı Yönetimi**: Yayıncıları ekleyin, düzenleyin ve silin
- **Kategori Yönetimi**: Kitap kategorilerini organize edin
- **Yazar Yönetimi**: Yazarları kaydedin ve takip edin
- **Kitap Yönetimi**: Kütüphane koleksiyonunuzu yönetin
- **Ödünç İşlemleri**: Kitap ödünç alma ve iade işlemleri

### ✅ CRUD Operasyonları

Her modülde tam CRUD desteği:
- ✅ **Create (Oluştur)**: Yeni kayıt ekleme
- ✅ **Read (Listele)**: Kayıtları tablo formatında listeleme
- ✅ **Update (Güncelle)**: Kayıt düzenleme
- ✅ **Delete (Sil)**: Onay dialogu ile güvenli silme

## 🛠️ Teknolojiler

### Frontend
- **React 18** - Modern UI Framework
- **React Router 6** - Client-side Routing
- **Tailwind CSS 3** - Utility-First CSS Framework
- **Vite 5** - Build Tool
- **React Toastify** - Bildirimler

### Backend
- **Supabase** - Backend as a Service (BaaS)
- **PostgreSQL** - Veritabanı

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build
```

## 🔧 Ortam Değişkenleri

`.env` dosyası:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Proje Yapısı

```
src/
├── components/         # Ortak bileşenler
│   ├── Layout.jsx     # Ana layout
│   ├── Modal.jsx      # Modal bileşeni
│   ├── ConfirmDialog.jsx
│   └── LoadingSpinner.jsx
├── pages/             # Sayfa bileşenleri
│   ├── HomePage.jsx
│   ├── PublishersPage.jsx
│   ├── CategoriesPage.jsx
│   ├── AuthorsPage.jsx
│   ├── BooksPage.jsx
│   └── BorrowsPage.jsx
├── lib/
│   └── supabase.js    # Supabase client
├── App.jsx            # Router yapılandırması
├── main.jsx           # Entry point
└── index.css          # Global stiller
```

## 🗄️ Veritabanı Şeması

### Publishers (Yayıncılar)
- `id` (Serial, Primary Key)
- `name` (String)
- `establishment_year` (Integer)
- `address` (Text)

### Categories (Kategoriler)
- `id` (Serial, Primary Key)
- `name` (String)
- `description` (Text)

### Authors (Yazarlar)
- `id` (Serial, Primary Key)
- `name` (String)
- `birth_date` (Date)
- `country` (String)

### Books (Kitaplar)
- `id` (Serial, Primary Key)
- `title` (String)
- `publication_year` (Integer)
- `stock` (Integer)
- `author_id` (FK → Authors)
- `publisher_id` (FK → Publishers)
- `category_id` (FK → Categories)

### Borrows (Ödünç İşlemleri)
- `id` (Serial, Primary Key)
- `borrower_name` (String)
- `borrow_date` (Date)
- `return_date` (Date)
- `book_id` (FK → Books)

## 🎨 UI/UX Özellikleri

- ✨ Modern ve temiz arayüz tasarımı
- 🎨 Tailwind CSS ile şık ve tutarlı stil
- 🔔 Toast bildirimleri (window.alert kullanılmaz)
- 🪟 Modal formlar ile kullanıcı dostu veri girişi
- ⚠️ Silme onay dialogları ile veri güvenliği
- ⏳ Loading spinner'lar

---

**Patika.dev Capstone Projesi** - 2026
