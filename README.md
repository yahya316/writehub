# WriteHub

WriteHub is a full-stack content management platform designed for content writers to create, manage, and share their work. It allows users to register, log in, and access personalized dashboards where they can handle their content, comments, and favorites. Admins have additional privileges to manage categories, content, and user profiles. Public content is visible to logged-in users, while private content remains restricted.The site is partially mobile-responsive.
---

## Features

### Authentication
- User registration & login (via NextAuth).
- Limited access for non-logged-in users (can only view **Home, About, Contact**).
- Logged-in users gain access to full features and dashboards.

### User Dashboard
- Update profile & password.
- View and manage:
  - Content
  - Comments
  - Favorites
- Universal search across content.
- Filter content by category.
- Responsive (partially optimized for mobile).

### Admin Dashboard
- Manage categories.
- Add & manage content.
- View all user content.
- Profile management.
- Universal search in dashboard.

### Public Site
- Public content is visible to all users.
- Category-based filtering.
- Contact page with form.
- About & Terms pages.
- Homepage with featured stories.

---

## Tech Stack

- **Frontend:** React, Next.js (App Router)
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas (Mongoose models)
- **Authentication:** NextAuth
- **Styling:** Tailwind CSS (responsive design)
- **Other:** ESLint, PostCSS

---

## Project Structure

```
writehub/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin route group
│   ├── (main)/            # Main route group
│   └── (user)/            # User route group
├── components/            # Reusable React components
├── lib/                   # Utility libraries
├── models/                # MongoDB/Mongoose models
├── public/                # Static assets
└── Configuration files

(full structure is at bottom)
```

---

## Installation & Setup

1. **Clone the repo**
   ```
   git clone https://github.com/yahya316/writehub.git
   cd writehub
   ```
2. **Install dependencies**
    ```
    npm install

    ```
3. **Setup environment variables**
Create .env.local in the root directory and add:
```
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```
4. **Run the development server**
```
npm run dev

```

5. **Open in browser**

```
http://localhost:3000
```



## Contributing
Contributions are welcome! If you'd like to improve the project:
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Commit your changes (git commit -m 'Add feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.


## Full Structure
```
writehub/
├── app/
│   ├── (admin)/
│   │   ├── category/
│   │   │   └── page.js
│   │   ├── content/
│   │   │   └── page.js
│   │   ├── users/
│   │   │   └── page.js
│   │   └── layout.js
│   │
│   ├── (main)/
│   │   ├── about/
│   │   │   └── page.js
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── _nextauth_/
│   │   │   │   │   └── route.js
│   │   │   │   └── register/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   └── [id]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── comments/
│   │   │   │   └── [commentid]/
│   │   │   │       └── route.js
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── content/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── likes/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── status/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   ├── stories/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.js
│   │   │   │   ├── all/
│   │   │   │   │   └── route.js
│   │   │   │   └── category/
│   │   │   │       └── [id]/
│   │   │   │           └── route.js
│   │   │   │
│   │   │   ├── topcard/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   └── user/
│   │   │       └── [id]/
│   │   │           └── route.js
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.js
│   │   │   └── register/
│   │   │       └── page.js
│   │   │
│   │   ├── categories/
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   │
│   │   ├── contact/
│   │   │   └── page.js
│   │   │
│   │   ├── contents/
│   │   │   └── page.js
│   │   │
│   │   ├── sitemap.xml/
│   │   │
│   │   ├── route.js
│   │   ├── terms/
│   │   │   └── page.js
│   │   ├── page.js
│   │   └── layout.js
│
├── (user)/
│   ├── comments/
│   │   └── page.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── favorites/
│   │   └── page.js
│   │
│   ├── profile/
│   │   └── page.js
│   │
│   ├── story/
│   │   └── [id]/
│   │       ├── page.js
│   │       ├── page.js
│   │       └── layout.js
│   │
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.js
│
├── components/
│   ├── AuthProvider.js
│   ├── CommentsSection.js
│   ├── DashboardComponent.js
│   ├── DashboardLayout.js
│   ├── FavoriteButton.js
│   ├── FeaturedStoryCard.js
│   ├── Footer.js
│   ├── LikeButton.js
│   ├── MyCommentsList.js
│   ├── Navbar.js
│   ├── RichTextEditor.js
│   ├── SearchBar.js
│   ├── StoryCard.js
│   └── TopCard.js
│
├── lib/
│   └── dbConnect.js
│
├── models/
│   ├── Category.js
│   ├── Comment.js
│   ├── Content.js
│   ├── Message.js
│   └── User.js
│
├── node_modules/
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── img.jpg
│   ├── img1.jpg
│   ├── img3.jpg
│   ├── img4.jpg
│   ├── img5.jpg
│   ├── img9.jpg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local
├── .gitignore
├── .eslintrc.cjs
├── jsconfig.json
├── middleware.js
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```