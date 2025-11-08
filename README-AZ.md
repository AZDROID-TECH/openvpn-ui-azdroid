<div align="center">
  <img src="https://raw.githubusercontent.com/AZDROID-TECH/openvpn-ui-azdroid/main/build/icons/512x512.png" alt="OpenVPN UI AZDROID Logo" width="150">
  <h1 align="center">OpenVPN UI AZDROID</h1>
  <p align="center">
    OpenVPN üçün modern, sadə və zərif kross-platform masaüstü klient.
    <br />
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/releases"><strong>İndi Yüklə »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/issues">Xəta Bildir</a>
    ·
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/issues">Funksiya Təklif Et</a>
  </p>
</div>

---

## Layihə Haqqında

OpenVPN güclü və çevik bir VPN həllidir, lakin onun rəsmi masaüstü klientləri bəzən gündəlik istifadəçilər üçün köhnəlmiş və ya mürəkkəb görünə bilər. **OpenVPN UI AZDROID** OpenVPN serverlərinə qoşulmaq üçün vizual olaraq cəlbedici, istifadəçi dostu və sadə bir təcrübə təqdim etmək üçün yaradılmışdır.

Müasir veb texnologiyaları ilə qurulmuş bu klient sadəliyə fokuslanır: `.ovpn` konfiqurasiya faylınızı idxal edin, istifadəçi məlumatlarınızı daxil edin və bir kliklə qoşulun.

### Əsas Xüsusiyyətlər

-   **Modern və Sadə UI:** React və TailwindCSS ilə qurulmuş təmiz və intuitiv interfeys.
-   **Kross-Platform:** Gələcəkdə Windows və macOS dəstəyi potensialı ilə Linux (AppImage, .deb) üzərində işləyir.
-   **Asan Quraşdırma:** Sadəcə `.ovpn` faylınızı idxal edin və istifadəçi adınızı və şifrənizi bir dəfə daxil edin.
-   **Təhlükəsiz Məlumat Saxlanc:** Şifrəniz şifrələnir və sistemin yerli açar zəncirində (keychain) təhlükəsiz şəkildə saxlanılır.
-   **Qoşulma Statusu:** Aydın vizual göstərici sizin ayrıldığınızı, qoşulduğunuzu və ya qoşulu olduğunuzu göstərir.
-   **Çoxdilli Dəstək:** İngilis və Azərbaycan dillərində mövcuddur.

### İstifadə Olunan Texnologiyalar

*   [Electron](https://www.electronjs.org/)
*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Redux Toolkit](https://redux-toolkit.js.org/)
*   [TailwindCSS](https://tailwindcss.com/)

---

## Başlarken

### İlkin Tələblər

Bu tətbiq AppImage və ya Debian paketlərini (`.deb`) dəstəkləyən Linux distributivləri üçün nəzərdə tutulub.

1.  **OpenVPN Quraşdırılması:**
    Sisteminizdə `openvpn` paketinin quraşdırılmış olması vacibdir.

    *   **Debian/Ubuntu əsaslı sistemlər üçün:**
        ```sh
        sudo apt update && sudo apt install openvpn
        ```
    *   **Arch əsaslı sistemlər üçün:**
        ```sh
        sudo pacman -S openvpn
        ```
    *   **Fedora/CentOS/RHEL əsaslı sistemlər üçün:**
        ```sh
        sudo dnf install openvpn
        ```

2.  **Tətbiqi Əldə Edin:**
    Ən son `AppImage` və ya `.deb` faylını [**Relizlər Səhifəsindən**](https://github.com/AZDROID-TECH/openvpn-ui-azdroid/releases) yükləyin.

### Quraşdırma və İstifadə

#### AppImage İstifadəsi (Tövsiyə Olunur)

1.  AppImage faylını icra edilə bilən edin:
    ```sh
    chmod +x OpenVPN-UI-AZDROID-x86_64.AppImage
    ```
2.  Tətbiqi işə salın:
    ```sh
    ./OpenVPN-UI-AZDROID-x86_64.AppImage
    ```

#### .deb Paketinin İstifadəsi

1.  Paketi seçdiyiniz paket meneceri ilə quraşdırın:
    ```sh
    sudo dpkg -i OpenVPN-UI-AZDROID_amd64.deb
    # Əgər asılılıq problemləri ilə qarşılaşsanız, bu əmri icra edin:
    sudo apt-get install -f
    ```
2.  Tətbiqi sisteminizin tətbiq menyusundan başladın.

### İlk Dəfə Quraşdırma

1.  **Konfiqurasiya Faylını Seçin:** İlk işə salmada sizdən `.ovpn` konfiqurasiya faylınızı seçməyiniz tələb olunacaq.
2.  **İstifadəçi Məlumatlarını Daxil Edin:** Sonra, VPN bağlantınız üçün istifadəçi adını və şifrəni daxil edin.
3.  **Qoşulun:** Konfiqurasiyanız artıq yadda saxlanılıb. Qoşulmaq üçün mərkəzi ikona klikləyin!

---

## Development (Təkmilləşdirmə)

Layihəni development mühitində işə salmaq üçün:

1.  **Repozitoriyanı klonlayın:**
    ```sh
    git clone https://github.com/AZDROID-TECH/openvpn-ui-azdroid.git
    cd openvpn-ui-azdroid
    ```

2.  **Asılılıqları quraşdırın:**
    ```sh
    npm install
    ```

3.  **Development serverini işə salın:**
    ```sh
    npm run dev
    ```

---

## Töhfələr

Töhfələr açıq mənbə cəmiyyətini öyrənmək, ilham vermək və yaratmaq üçün heyrətamiz bir yerə çevirən şeydir. Etdiyiniz hər hansı bir töhfə **böyük məmnuniyyətlə qarşılanır**.

Əgər bunu daha yaxşı edəcək bir təklifiniz varsa, lütfən repozitoriyanı "fork" edin və "pull request" yaradın. Siz həmçinin sadəcə "enhancement" teqi ilə bir "issue" aça bilərsiniz.

1.  Layihəni Fork edin
2.  Öz Funksiya Budağınızı yaradın (`git checkout -b feature/AmazingFeature`)
3.  Dəyişikliklərinizi Commit edin (`git commit -m 'Add some AmazingFeature'`)
4.  Budağa Push edin (`git push origin feature/AmazingFeature`)
5.  Pull Request açın

---

## Lisenziya

MIT Lisenziyası altında yayılır. Daha çox məlumat üçün `LICENSE` faylına baxın.

---

## Əlaqə

AZDROID - [@mirsadiq](https://www.linkedin.com/in/mirsadiq) - azdroid.tech@hotmail.com

Layihə Linki: [https://github.com/AZDROID-TECH/openvpn-ui-azdroid](https://github.com/AZDROID-TECH/openvpn-ui-azdroid)
