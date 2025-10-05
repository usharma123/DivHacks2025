# Everafter Logos

Everafter Logos is a web application that allows users to create personalized wedding logos and monograms. It provides a simple and intuitive interface for designing beautiful logos for your special day.

## About the Project

This project is a Next.js application built with TypeScript. It uses a variety of modern web technologies to provide a rich user experience. The application is designed to be a single-page marketing and application experience. The main page is composed of several sections that introduce the product, showcase its features, and provide a way for users to create their own logos.

### Architecture

The application follows a component-based architecture. The UI is broken down into smaller, reusable components that are composed to create the final user interface. This makes the codebase more modular, easier to maintain, and scalable.

### Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
*   **AI:** [OpenAI API](https://openai.com/docs)
*   **Deployment:** Vercel

## Project Structure

The project is organized into the following directories:

```
/everafter-logos
├───app
│   └───api
├───components
│   ├───ai-elements
│   └───ui
├───echo
├───hooks
├───lib
├───public
├───src
│   └───echo
├───styles
└───types
```

*   **app:** Contains the main application code, including the pages and API routes.
*   **components:** Contains the reusable React components used throughout the application.
*   **echo:** Contains the Echo SDK for real-time features.
*   **hooks:** Contains custom React hooks.
*   **lib:** Contains utility functions and type definitions.
*   **public:** Contains static assets such as images and fonts.
*   **src:** Contains the source code for the Echo SDK.
*   **styles:** Contains global styles and CSS modules.
*   **types:** Contains global TypeScript type definitions.

## Components

The application is built using a variety of components, each with a specific purpose. Here is a breakdown of the main components:

*   **Header:** The header component is responsible for displaying the navigation links and the sign-in button.
*   **Hero:** The hero component is the first thing users see when they visit the page. It contains a headline, a brief description of the product, and a call-to-action button.
*   **Features:** The features component highlights the key features of the product.
*   **CustomizationPreview:** This is the main interactive component of the application. It allows users to customize their logos by entering their initials, wedding date, and venue. It also provides options for choosing a style and color palette. The component uses the OpenAI API to generate the logos in real-time.
*   **Gallery:** The gallery component showcases a collection of pre-designed logo templates that users can choose from as a starting point.
*   **Testimonials:** The testimonials component displays quotes from satisfied customers.
*   **Pricing:** The pricing component outlines the different pricing plans available to users.
*   **FinalCTA:** The final call-to-action component encourages users to create their own logo.
*   **Footer:** The footer component contains links to the product's social media pages and other relevant information.
*   **ThemeProvider:** A component that provides the theme (dark or light mode) to the application.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and pnpm installed on your machine.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/DivHacks2025.git
    ```
2.  Navigate to the project directory
    ```sh
    cd DivHacks2025/everafter-logos
    ```
3.  Install NPM packages
    ```sh
    pnpm install
    ```
4.  Start the development server
    ```sh
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.