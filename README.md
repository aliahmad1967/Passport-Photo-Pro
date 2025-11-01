
# Passport Photo Pro 📸

An AI-powered application that transforms your photos into professional, compliant passport images. Built with React, Tailwind CSS, and the Google Gemini API, this tool makes it easy to get a perfect passport photo from the comfort of your home.

## ✨ Key Features

- **AI-Powered Transformation**: Leverages the Gemini API to automatically replace the background with a neutral, off-white color, center the subject, and correct lighting.
- **Dual Input Methods**:
    - **Upload**: Upload an existing photo (JPG, PNG, WEBP).
    - **Selfie Mode**: Use your device's camera to take a new photo with a helpful face-positioning overlay.
- **Print-Ready Layout**: Automatically arrange six 2"x2" passport photos onto a standard 4"x6" photo sheet.
- **Easy Export**:
    - **Download**: Save the high-quality generated photo directly to your device.
    - **Print & PDF**: Print the 4"x6" sheet or save it as a PDF to use in Word documents or print later.
- **Responsive Design**: A clean, modern, and fully responsive interface that works on all devices.
- **Helpful Tips**: Provides users with next steps and best practices for printing and using their new photo.

---

## 🚀 How to Use the Application

Getting your passport photo is a simple, four-step process.

### Step 1: Provide Your Photo

You have two easy options to start:

1.  **Upload a File**: Click the upload area to select a photo from your device, or simply drag and drop a file into the box.
2.  **Take a Selfie**: Click the "Take a Selfie" button to open your camera. Position your face inside the dashed oval guide and click "Snap Photo".

 <!-- Placeholder for an actual screenshot -->

### Step 2: Generate Your Passport Photo

Once your image is loaded, you'll see a preview. Click the **"Generate Passport Photo"** button. Our AI will process the image, which usually takes just a few seconds.

 <!-- Placeholder for an actual screenshot -->

### Step 3: Download or Prepare for Printing

After processing, your professional passport photo will appear.

-   Click **"Download Photo"** to save the individual image file.
-   Click **"Prepare for Printing"** to move to the next step for a print-friendly layout.

 <!-- Placeholder for an actual screenshot -->

### Step 4: Print or Save as PDF

In the Print Preview, you will see six copies of your photo arranged on a 4"x6" sheet.

-   Click the **"Print"** button.
-   In your browser's print dialog:
    -   Set the **Paper Size** to "4x6 in".
    -   Ensure the **Scale** is set to "100%" or "Actual Size".
    -   To save the file, change the printer destination to **"Save as PDF"**.

 <!-- Placeholder for an actual screenshot -->

---

## 🛠️ For Developers: Setup and Local Installation

Want to run the project locally? Follow these steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/passport-photo-pro.git
cd passport-photo-pro
```

### 2. Install Dependencies

Install the required packages using your preferred package manager.

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires a Google Gemini API key to function.

1.  Create a new file named `.env` in the root of the project.
2.  Add your API key to this file:

    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

    You can get your key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Server

Start the application in development mode.

```bash
npm run dev
```

The application should now be running on `http://localhost:3000`.

---

## 💻 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Build Tool**: Vite (Assumed, as it is a modern standard)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the Passport Photo Pro, please feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
