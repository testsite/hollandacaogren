# 🎸 Online Akort - Guitar Tuner

Modern web teknolojileri kullanılarak geliştirilmiş profesyonel enstrüman akort aracı.

## ✨ Özellikler

- **Gerçek Zamanlı Akort**: Web Audio API kullanarak hassas frekans analizi
- **Çoklu Enstrüman Desteği**: Gitar, Bas, Ukulele, Keman
- **Görsel Feedback**: Meter, LED ışıklar ve renkli göstergeler
- **Özelleştirilebilir Ayarlar**: A4 frekansı ve hassasiyet ayarları
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **PWA Desteği**: Offline kullanım ve ana ekrana ekleme

## 🚀 Kullanım

1. Tarayıcınızda `index.html` dosyasını açın
2. "Akort Başlat" butonuna tıklayın
3. Mikrofon izni verin
4. Enstrümanınızı çalın ve akort yapın

## 🛠️ Teknik Detaylar

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Audio Processing**: Web Audio API
- **Pitch Detection**: Autocorrelation algoritması
- **Compatibility**: Modern tarayıcılar (Chrome, Firefox, Safari, Edge)

## 📱 PWA Özellikleri

- Service Worker ile offline çalışma
- Ana ekrana ekleme desteği
- Hızlı yükleme ve cache

## 🎵 Desteklenen Enstrümanlar

### Gitar (Standart Tuning)
- E2 (82.41 Hz)
- A2 (110.00 Hz) 
- D3 (146.83 Hz)
- G3 (196.00 Hz)
- B3 (246.94 Hz)
- E4 (329.63 Hz)

### Bas Gitar
- E1 (41.20 Hz)
- A1 (55.00 Hz)
- D2 (73.42 Hz)
- G2 (98.00 Hz)

### Ukulele
- G4 (392.00 Hz)
- C4 (261.63 Hz)
- E4 (329.63 Hz)
- A4 (440.00 Hz)

### Keman
- G3 (196.00 Hz)
- D4 (293.66 Hz)
- A4 (440.00 Hz)
- E5 (659.25 Hz)

## 🔧 Hosting

Bu proje herhangi bir web sunucusunda çalışabilir:

1. Tüm dosyaları web sunucunuza yükleyin
2. HTTPS gereklidir (mikrofon erişimi için)
3. Modern tarayıcı gereklidir

## 📄 Lisans

Bu proje MIT lisansı altında yayınlanmıştır.

---

**Not**: Mikrofon erişimi için HTTPS gereklidir. Yerel test için `localhost` kullanabilirsiniz.