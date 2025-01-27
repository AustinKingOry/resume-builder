# Resume Builder

Resume Builder is a web application designed to help users create formatted resumes effortlessly. Users can input details such as education, work experience, skills, and more, to generate a professional PDF resume. The app uses React and Next.js for a dynamic user interface and employs JSPDF for PDF generation.

## Features

- Dynamic Resume Building: Input forms for education, experience, skills, and more.
- PDF Generation: Create a downloadable, professionally formatted resume as a PDF.
- Interactive UI: User-friendly design with advanced components from Radix UI and TailwindCSS.
- Customization: Adjust content and layout as needed.

## Tech Stack

- **Frontend**: React, Next.js
- **UI/UX**: TailwindCSS, Radix UI
- **PDF Generation**: JSPDF
- **State Management**: React Hook Form
- **Linting**: ESLint with Next.js configuration

## Installation

Follow the steps below to run the Resume Builder locally:

1. **Clone the repository:**
   ```bash
   git clone git@github.com:AustinKingOry/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server with TurboPack.
- **`npm run build`**: Builds the app for production.
- **`npm start`**: Starts the production build.
- **`npm run lint`**: Runs linting using ESLint.

## Project Structure

The project structure is organized for maintainability and scalability:

```plaintext
resume-builder/
├── pages/       # Next.js pages for routing
├── components/  # Reusable UI components
├── styles/      # Global and component-specific styles
├── utils/       # Helper functions and utilities
├── public/      # Static assets like images
└── package.json # Dependency and scripts configuration
```

## Dependencies

### Core Dependencies

- `next`: Next.js framework for React.
- `react`: React library for UI.
- `jspdf`: For generating PDFs.
- `react-hook-form`: Efficient and flexible form management.

### UI Enhancements

- `@radix-ui/react-*`: Advanced UI components.
- `tailwindcss`: Utility-first CSS framework.

### Development Tools

- `eslint`: Linting utility to ensure code quality.
- `typescript`: Static typing for safer code.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add a feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Radix UI for interactive and accessible components.
- TailwindCSS for rapid UI development.
- JSPDF for robust PDF generation.

