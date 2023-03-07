# Node.js API with Express and MongoDB

This is a Node.js API built with Express and MongoDB. It provides three routes to interact with a MongoDB database containing quotes.

## Getting Started

To get started, clone this repository to your local machine and install the dependencies using npm install.

### Prerequisites

You will need Node.js, NPM and MongoDB installed on your machine to run this API (you can use the MongoDB Atlas cloud service if you don't want to install MongoDB locally).

### Installing

    Clone the repository: git clone https://github.com/TiagoRibeiro25/Get-Quotes.git
    Navigate to the project directory: cd Get-Quotes
    Install dependencies: npm install

### Running the API

To run the API, use the following command:

    npm start

This will start the API at <http://localhost:3000> (or the host and port specified in the .env file)

### Routes

The API provides three routes to interact with a MongoDB database containing quotes:

    GET /api/status: Returns the status of the API and the database connection.
    GET /api/quotes: Returns all quotes in the database.
    GET /api/quotes/random: Returns a random quote from the database.

### Environment Variables

The API uses environment variables to store sensitive information such as database credentials. These environment variables are stored in a .env file in the root of the project.

To set up the .env file, copy the contents of the .env-sample file and replace the values with your own.

    NODE_ENV=development
    PORT=3000
    HOSTNAME=localhost
    DB_URI=cluster0.abcde.mongodb.net
    DB_USERNAME=root
    DB_PASSWORD=123456
    DB_NAME=quotes

### Dev Dependencies

This project uses nodemon as a dev dependency. Nodemon is a utility that monitors for changes in your source code and automatically restarts the server. To start the server with nodemon, use the following command:

    npm run dev

## Contributing

Contributions are welcome! To contribute to this project, fork the repository and create a new branch for your feature or bug fix. When you are finished, submit a pull request and we will review your changes.

Please make sure to follow the code style of the project.
