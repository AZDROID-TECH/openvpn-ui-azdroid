# AI Coding Standards (OpenVPN UI)

Bu sənəd OpenVPN UI layihəsində AI və developer üçün əsas kod standartlarını müəyyən edir.

## 1) Dil və yazım qaydaları

- Kod identifikatorları həmişə ingilis dilində olmalıdır.
- Kod daxili şərhlər və TODO/FIXME qeydləri azərbaycan dilində yazılmalıdır.
- UI mətni hardcode edilməməlidir, `react-i18next` ilə lokallaşdırılmalıdır.

## 2) Texnologiya stack-i

Layihədə aşağıdakı əsas texnologiyalar istifadə olunur:

- Frontend: `React 18`, `TypeScript`, `TailwindCSS`
- State: `Redux Toolkit`
- Desktop: `Electron`
- Build: `Vite` + `vite-plugin-electron`
- Form/Validation: `react-hook-form` + `zod`
- Test: `Vitest` + `@testing-library/react`

Qeyd:

- Verilənlər bazası və Supabase bu layihədə istifadə edilmir.
- Lazımsız yeni dependency əlavə etmək qadağandır; yalnız açıq ehtiyac olduqda və əsaslandırma ilə əlavə edilə bilər.

## 3) Layihə strukturu

Standart qovluq yanaşması:

- `electron/`
  - `main.ts`: Electron main process
  - `preload.ts`: təhlükəsiz, tipli IPC bridge
- `src/`
  - `components/`: UI və feature komponentləri
  - `features/`: Redux slice-lar
  - `pages/`: səhifə səviyyəli komponentlər
  - `services/`: business/domain servislər (OpenVPN proses idarəsi və s.)
  - `store/`: Redux store
  - `types/`: paylaşılmış tiplər
  - `locales/`: `az` və `en` lokallaşdırma faylları
  - `hooks/`: custom hook-lar

## 4) TypeScript qaydaları

- `strict` rejim pozulmamalıdır.
- `any` istifadəsi qadağandır.
- Hər public API (function, props, service output) tipli olmalıdır.
- IPC sorğuları və cavabları üçün açıq type contract olmalıdır.

## 5) IPC və Electron təhlükəsizlik qaydaları

- `contextIsolation: true`, `nodeIntegration: false` mütləqdir.
- `preload` qatında yalnız whitelist edilmiş kanallar expose edilməlidir.
- Renderer-dan gələn məlumatlar main process-də yoxlanmalıdır.
- Shell command icrası zamanı input-lar sanitizasiya edilməlidir, command injection riskinə yol verilməməlidir.
- Həssas məlumatlar log-lara (xüsusilə şifrə) yazılmamalıdır.

## 6) OpenVPN inteqrasiyası qaydaları

- OpenVPN əməliyyatları ayrıca service qatında cəmlənməlidir.
- Process lifecycle (start/stop/status/error) deterministik idarə olunmalıdır.
- Tətbiq yalnız öz başladığı VPN proseslərini idarə etməlidir.
- Credential faylları müvəqqəti yaradıldıqda təhlükəsiz permission (`0600`) ilə yazılmalı və iş bitəndə silinməlidir.
- Mümkün olduqda daha az imtiyaz prinsipi qorunmalıdır.

## 7) UI/UX standartları

- Mövcud vizual dizayn qorunmalıdır.
- `az` default, `en` ikinci dil kimi dəstək olmalıdır.
- Light/Dark mode dəstəyi olmalıdır.
- Dil və tema dəyişdiricisi UI-da görünən və işlək olmalıdır.
- Accessibility:
  - Interaktiv elementlər klaviatura ilə əlçatan olmalıdır.
  - Görünən focus state olmalıdır.

## 8) State idarəsi

- Redux slice-lar feature əsaslı təşkil olunmalıdır.
- Async axınlar üçün `createAsyncThunk` və ya uyğun typed abstraction istifadə olunmalıdır.
- UI state və domain state mümkün qədər ayrılmalıdır.

## 9) Test və keyfiyyət

- Ən azı aşağıdakılar üçün test yazılmalıdır:
  - əsas səhifə render axını
  - kritik UI davranışları (modal, status, tema)
  - reducer və əsas thunk davranışları
  - təhlükəsizlik-kritik utility funksiyaları
- Lint, typecheck, test və build CI axınına uyğun olmalıdır.

## 10) Lint/format və script-lər

- Layihədə ESLint və Prettier konfiqurasiyası olmalıdır.
- `package.json` scripts minimum aşağıdakıları ehtiva etməlidir:
  - `dev`
  - `build`
  - `lint`
  - `format`
  - `test`

## 11) Əməliyyat prinsipləri

- Əvvəlcə təhlükəsizlik, sonra doğruluq, sonra performans.
- Refactor zamanı davranış regressiyası yaratmamaq əsas şərtdir.
- Böyük dəyişikliklər addım-addım edilməli, hər addımdan sonra işləkliyi yoxlanmalıdır.

---

Bu sənəd layihənin yaşayan standartıdır; arxitektura dəyişdikcə yenilənməlidir.
