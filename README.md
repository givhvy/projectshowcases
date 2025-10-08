# Projects Showcase Museum

A modern, responsive portfolio website for showcasing projects with CRUD functionality. Built with vanilla JavaScript, HTML, and CSS, inspired by Framer design aesthetics.

## Features

- ✨ **Modern Design** - Clean, dark-themed UI with smooth animations
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ✏️ **CRUD Operations** - Add, Edit, Delete projects with ease
- 💾 **Local Storage** - Projects are saved in browser's localStorage
- 🎨 **Category Filtering** - Filter projects by category
- 🔍 **Search Ready** - Prepared for search functionality
- ⚡ **Parallax Effects** - Smooth scrolling animations

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Google Fonts (Inter, Bebas Neue)

## Project Structure

```
├── index.html          # Main HTML file
├── style.css           # All styles and responsive design
├── script.js           # JavaScript for CRUD operations
├── projects-museum.html # Original single-file version
├── example-website/    # Example Framer website reference
│   └── page.html
└── README.md           # Documentation
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/givhvy/projectshowcases.git
   cd projectshowcases
   ```

2. **Open the website**
   - Simply open `index.html` in your browser
   - No build process or dependencies required!

3. **Start adding projects**
   - Click the "Add Project" button in the navigation
   - Fill in the project details
   - Click "Save Project"

## Features Overview

### Add New Projects
- Click "Add Project" button
- Fill in project title, category, description, and image URL
- Projects are automatically saved to localStorage

### Edit Projects
- Hover over any project card
- Click the "Edit" button
- Update project details and save

### Delete Projects
- Hover over any project card
- Click the "Delete" button
- Confirm deletion

### Filter by Category
- Use category pills to filter projects
- Categories: Web Design, Mobile Apps, Branding, UI/UX, Experimental, 3D & Animation

## Customization

### Colors
Edit CSS custom properties in `style.css`:
```css
:root {
    --color-black: rgb(0, 0, 0);
    --color-yellow: rgb(255, 204, 110);
    --color-gray: rgb(232, 232, 232);
    /* ... */
}
```

### Default Projects
Edit the default projects in `script.js`:
```javascript
projects = [
    {
        id: generateId(),
        title: 'YOUR PROJECT',
        category: 'web',
        description: 'Your description',
        image: 'https://your-image-url.jpg'
    }
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Design inspiration: Framer
- Images: Unsplash
- Fonts: Google Fonts (Inter, Bebas Neue)

---

**Made with ❤️ by givhvy**
