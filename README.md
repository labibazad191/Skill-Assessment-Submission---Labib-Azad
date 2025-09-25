# Student Events Management - Angular Application

# Overview

# Features This Angular application is developed to manage student events at Southeast University. It supports CRUD operations, status workflow enforcement, event duplication checks, search functionality, and simulated real-time updates using Angular’s in-memory-web-api.




###### Git isn't pushing from this computer, That's why I'm uploading the file directly
# 
Technical Stack 

- Angular 15+
- TypeScript
- Tailwind CSS
- angular-in-memory-web-api
- RxJS The application is a single-page Angular project using Reactive Forms, TypeScript, and Tailwind CSS for responsive UI design.

  Features

# Create / Update Events

- Reactive Forms with validation (custom and async validators)

- Ensures title uniqueness and proper data formatting

- Read Events

- Displays events in a table with sorting by title, date, and category

- Dynamic filtering and virtualized lazy loading for performance

- Infinite scrolling support

- Delete Events

- Remove events with confirmation dialog

- Simulated Backend

- Uses angular-in-memory-web-api to mock CRUD API calls

- Responsive UI

- Tailwind CSS used for tables, forms, and modals

- Data Model


# Setup Instructions

Clone Repository
git clone cd

Install Dependencies
npm install

Run the Application
ng serve -o

IF successful not install , the application will open then set this:
# PowerShell Execution Policy: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

- Opens in default browser at http://localhost:4200

- Uses in-memory-web-api as a mock backend

# Build for Production
- ng build --prod

# Technical Details

- Framework: Angular 15+

- Language: TypeScript

- State Management: NgRx (optional) / Service-based state

- Styling: Tailwind CSS

- Backend Simulation: angular-in-memory-web-api

# Assumptions

- All data is currently stored in memory (mock API).

- Event duplication is prevented via form validation.

- Real-time updates are simulated; no actual backend server is required.

# File Structure (Key Files)

src/ app/ 
      app.component.ts 
     app.component.html 
  event.service.ts 
  in-memory-data.service.ts 
  event.model.ts 
   styles.css
   
   app.component.spec.ts
   app.module.ts
   app.component.html 
   event.service.ts 
   in-memory-data.service.ts 
   event.model.ts 
   app.component.spec.ts
   app.module.ts
   styles.css 
   angular.json 
   package.json
   db.json
  

This README ensures setup instructions, technical approach, and assumptions are clear for evaluators.
