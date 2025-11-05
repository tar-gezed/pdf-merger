# Offline PDF Merger

A secure, fast, and easy-to-use web application to merge multiple PDF files directly in your browser. This tool is built with privacy as a top priority—your files are never uploaded to any server. All processing happens entirely on your computer (client-side).

**👉 Live Demo: [https://tar-gezed.github.io/pdf-merger/](https://tar-gezed.github.io/pdf-merger/)**

---

## ✨ Features

- **100% Client-Side:** Files are processed locally in your browser. No data ever leaves your machine.
- **Privacy Focused:** No server uploads, no tracking, no logging.
- **Works Offline:** Once the page is loaded, the application works completely without an internet connection.
- **Drag & Drop Interface:** Easily add and reorder files with a simple drag-and-drop mechanism.
- **Multiple File Selection:** Select multiple PDF files at once from your computer.
- **Fast & Efficient:** Merges files quickly using the power of modern web technologies.
- **Responsive Design:** A clean and modern UI that works on both desktop and mobile devices.

## 🛠️ Technology Stack

- **Framework:** [Angular](https://angular.io/) (v20+)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **PDF Manipulation:** [pdf-lib](https://pdf-lib.js.org/)
- **Deployment:** [GitHub Pages](https://pages.github.com/) with automated deployment via [GitHub Actions](https://github.com/features/actions).

## 🚀 How It Works

This application leverages a powerful JavaScript library called `pdf-lib` to perform PDF manipulation tasks. Here’s the process:

1.  **File Selection:** You select your PDF files using the file input or by dragging them onto the drop zone.
2.  **In-Memory Processing:** The application reads the contents of your selected files into your computer's memory (RAM).
3.  **Merging:** `pdf-lib` creates a new, blank PDF document in memory. It then iterates through your files in the specified order, copying the pages from each and appending them to the new document.
4.  **Download:** Once the merging is complete, the application generates a downloadable link (`blob URL`) for the newly created PDF. Clicking the "Merge & Download" button saves the final file to your computer.

At no point in this process are your files sent over the network.

## 📦 Getting Started (Local Development)

To run this project on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tar-gezed/pdf-merger.git
    cd pdf-merger
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## (Deployment)

This project is configured for automated deployment to GitHub Pages. A push to the `main` branch will trigger the GitHub Actions workflow defined in `.github/workflows/deploy.yml`. This workflow will:
1.  Check out the code.
2.  Install dependencies.
3.  Build the Angular application for production with the correct `baseHref`.
4.  Deploy the contents of the `dist/` folder to the `gh-pages` branch, making it live.
