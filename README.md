<div align="center">
  <img src="https://raw.githubusercontent.com/AZDROID-TECH/openvpn-ui-azdroid/main/build/icons/512x512.png" alt="OpenVPN UI from AZDROID Logo" width="150">
  <h1 align="center">OpenVPN UI from AZDROID</h1>
  <p align="center">
    A modern, simple, and elegant cross-platform desktop client for OpenVPN.
    <br />
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/releases"><strong>Download Now »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/issues">Report Bug</a>
    ·
    <a href="https://github.com/AZDROID-TECH/openvpn-ui-azdroid/issues">Request Feature</a>
  </p>
</div>

---

## About The Project

OpenVPN is a powerful and flexible VPN solution, but its official desktop clients can sometimes feel dated or complex for everyday users. **OpenVPN UI AZDROID** was created to provide a visually appealing, user-friendly, and straightforward experience for connecting to OpenVPN servers.

Built with modern web technologies, this client focuses on simplicity: import your `.ovpn` config file, enter your credentials, and connect with a single click.

### Key Features

-   **Modern & Simple UI:** A clean and intuitive interface built with React and TailwindCSS.
-   **Cross-Platform:** Works on Linux (AppImage, .deb), with potential for future Windows and macOS support.
-   **Easy Setup:** Just import your `.ovpn` file and provide your username and password once.
-   **Secure Credential Storage:** Your password is encrypted and stored securely in the system's native keychain.
-   **Connection Status:** A clear visual indicator shows whether you are disconnected, connecting, or connected.
-   **Multi-language Support:** Available in English and Azerbaijani.

### Built With

*   [Electron](https://www.electronjs.org/)
*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Redux Toolkit](https://redux-toolkit.js.org/)
*   [TailwindCSS](https://tailwindcss.com/)

---

## Getting Started

### Prerequisites

This application is designed for Linux distributions that support AppImage or Debian packages (`.deb`).

1.  **OpenVPN Installation:**
    You must have the `openvpn` package installed on your system.

    *   **For Debian/Ubuntu-based systems:**
        ```sh
        sudo apt update && sudo apt install openvpn
        ```
    *   **For Arch-based systems:**
        ```sh
        sudo pacman -S openvpn
        ```
    *   **For Fedora/CentOS/RHEL systems:**
        ```sh
        sudo dnf install openvpn
        ```

2.  **Get the Application:**
    Download the latest `AppImage` or `.deb` file from the [**Releases Page**](https://github.com/AZDROID-TECH/openvpn-ui-azdroid/releases).

### Installation & Usage

#### Using the AppImage (Recommended)

1.  Make the AppImage executable:
    ```sh
    chmod +x OpenVPN-UI-AZDROID-x86_64.AppImage
    ```
2.  Run the application:
    ```sh
    ./OpenVPN-UI-AZDROID-x86_64.AppImage
    ```

#### Using the .deb Package

1.  Install the package using your preferred package manager:
    ```sh
    sudo dpkg -i OpenVPN-UI-AZDROID_amd64.deb
    # If you encounter dependency issues, run:
    sudo apt-get install -f
    ```
2.  Launch the application from your system's application menu.

### First-Time Setup

1.  **Select Config File:** On the first launch, you will be prompted to select your `.ovpn` configuration file.
2.  **Enter Credentials:** Next, enter the username and password for your VPN connection.
3.  **Connect:** Your configuration is now saved. Click the central icon to connect!

---

## Development

To run the project in a development environment:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/AZDROID-TECH/openvpn-ui-azdroid.git
    cd openvpn-ui-azdroid
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

AZDROID - [@azdroid_tech](https://twitter.com/azdroid_tech) - contact@azdroid.tech

Project Link: [https://github.com/AZDROID-TECH/openvpn-ui-azdroid](https://github.com/AZDROID-TECH/openvpn-ui-azdroid)
