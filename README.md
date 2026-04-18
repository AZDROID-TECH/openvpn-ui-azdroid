# OpenVPN UI

Electron + React tabanlı, Linux için modern OpenVPN masaüstü arayüzü.

## Özellikler

- `.ovpn` dosyası içe aktarma
- Güvenli credential saklama (`keytar`)
- Bağlan / bağlantıyı kes akışı
- Kimlik doğrulama hatasında şifre yenileyip yeniden deneme
- Çok dil desteği (`az` varsayılan, `en` ikinci dil)
- Light/Dark tema desteği
- Pencere `X` butonunda uygulamayı kapatmak yerine sistem tepsisine küçültme

## Gereksinimler

- Node.js 20+
- npm 10+
- Linux masaüstü ortamı
- OpenVPN istemcisi (`openvpn` komutu sistemde olmalı)
- Yetki yükseltme aracı: `pkexec` (tercih edilen) veya `sudo`

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Kalite Kontrolleri

```bash
npm run lint
npm run test
```

## Paketleme

```bash
npm run build
```

Build çıktıları:

- `dist/OpenVPN UI-2.0.0.AppImage`
- `dist/openvpn-ui-azdroid_2.0.0_amd64.deb`

## Tepsi Davranışı

- Sağ üstteki `X` butonu uygulamayı kapatmaz, tepsiye gizler.
- Tepsi menüsünden:
  - `Open OpenVPN UI`: pencereyi geri açar
  - `Quit`: uygulamayı tamamen kapatır

## Güvenlik Notları

- Renderer katmanına yalnızca whitelist edilmiş, tipli IPC API açılır.
- `contextIsolation: true` ve `nodeIntegration: false` aktiftir.
- Şifreler loglanmaz.
- Geçici credential dosyaları `0600` izinleriyle yazılır ve bağlantı sonrası temizlenir.
