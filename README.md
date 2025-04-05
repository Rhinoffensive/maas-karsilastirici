## 🎓 Devlet ve Vakıf Üniversitesi Maaş Karşılaştırıcı

Bu proje, **2020 Mayıs** ayından itibaren Türkiye’deki **vakıf üniversitelerinde** çalışan akademisyenlerin maaşlarını, **devlet üniversiteleriyle** karşılaştırmak amacıyla geliştirilmiştir.

---

### 🔍 Amaç

2020 Nisan ayında devlet tarafından vakıf ve devlet üniversitelerinde çalışan öğretim görevlileri için **maaş eşitlemesi** yapılması planlanmıştı. Ancak vakıf üniversitelerinde bu uygulama **gecikmeli** olarak hayata geçti. Bu durum, vakıf üniversitelerinde çalışan akademisyenler için **hak kayıplarına** neden oldu.

Bu araç, kullanıcıların kendi maaş verilerini girerek oluşan farkı:

- **Türk Lirası (TL)**
- **Amerikan Doları (USD)**
- **Gram Altın (XAU)**

cinsinden görmelerini sağlar.

---

### 📁 Veriler

Kullanılan tüm resmi maaş ve piyasa verileri `src/data/` klasöründe yer almaktadır:

- [`maaslar.json`](https://github.com/Rhinoffensive/maas-karsilastirici/blob/main/src/data/maaslar.json) → Devlet üniversitelerindeki akademik pozisyonlara göre aylık maaşlar.
- [`endeks.json`](https://github.com/Rhinoffensive/maas-karsilastirici/blob/main/src/data/endeks.json) → 2020–2025 arası aylık USD/TRY ve Gram Altın/TRY döviz kuru verileri.

Veriler gerçek döviz/altın verileriyle hazırlanmış olup, gerekli olduğu takdirde manuel olarak güncellenebilir.

---

### 🧲 Nasıl Kullanılır?

1. Sayfadan **akademik unvanınızı** seçin.
2. Her ay için **gerçek maaşınızı** girin.
3. TL, USD ve Altın bazında oluşan farkları üst kısımda görebilirsiniz.
4. Hesaplamaları **CSV olarak dışa aktarabilir** ya da sıfırlayabilirsiniz.

---

### 🚀 Yayın

Proje GitHub Pages üzerinden canlı olarak yayınlanabilir:\
📈 [https://rhinoffensive.github.io/maas-karsilastirici](https://rhinoffensive.github.io/maas-karsilastirici)

> Not: Linkin çalışması için `vite.config.js` dosyasındaki `base` ayarı doğru yapılandırılmış olmalıdır.

