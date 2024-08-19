# Codeial

**Codeial** is a web application built using Node.js, Express, and Mongoose. It serves as a platform for users to post, comment, and interact with content in a social media-like environment.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Built With](#built-with)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Features

- User authentication and authorization using Passport.js
- Create, edit, and delete posts
- Comment on posts
- Like and unlike posts
- Real-time chat feature
- Responsive design

## Installation

1. Clone the repository:
   git clone https://github.com/yourusername/codeial.git

2. Navigate to the project directory:
   `cd codeial`

3. Install dependencies:
`npm install` 

4. Set up your environment variables. Create a .env file in the root directory and add the following:
- PORT=8000
- DB_URI=your_mongodb_uri
- SESSION_SECRET=your_secret_key

5. Run the project:
`npm start`

6. To build assets:
`gulp build`

## Usage
1. Register or log in to your account.
2. Create new posts and interact with other users by liking or commenting on their posts.
3. Use the chat feature to communicate with other users in real-time.

## Project Structure
- codeial/
- │
- ├── assets/
     -  ├── css/
    -  ├── js/
    -  ├── scss/
    -  └── images/
- ├── config/
- ├── controllers/
- ├── node-modules/
- ├── models/
- ├── routes/
- ├── views/
- ├── .gitignore
- ├── gulpfile.mjs
- ├── package.json
- └── README.md

## Built With
- Node.js - JavaScript runtime
- Express - Web framework for Node.js
- Mongoose - MongoDB object modeling for Node.js
- Passport.js - Authentication middleware for Node.js
- Gulp - Task runner for building assets
- Sass - CSS preprocessor

## Contributing
Contributions are welcome! Please fork this repository, make your changes, and submit a pull request.


## Acknowledgments
- Thanks to OpenAI for providing API access.
- Inspiration and resources from FreeCodeCamp.

