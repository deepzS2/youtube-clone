<br />
<p align="center">
  <a href="https://github.com/deepzS2/youtube-clone">
    <img src="assets/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Youtube Clone</h3>

  <p align="center">
    An youtube clone API (soon the frontend will be added too!)
    <br />
    <a href="https://github.com/deepzS2/youtube-clone"><strong>Explore!</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)



<!-- ABOUT THE PROJECT -->
## About The Project

For every developer, is a great experience trying "clone" some website or API. It's not different here, I tried to create the youtube API and actually working on the frontend as well. You can try to make the frontend. The API have cookie token parser and anti CSRF as well!

### Built With
For this project I used:
* [TypeScript](https://www.typescriptlang.org/)
* [Sequelize](https://sequelize.org/)
* [JSON Web Token](https://jwt.io/)
* [Express](https://expressjs.com/pt-br/)



<!-- GETTING STARTED -->
## Getting Started

Here is the section where you can clone this repository and run on your own machine!

### Prerequisites
* [NodeJS](https://nodejs.org/en/) or  [Yarn](https://yarnpkg.com/)

### Installation

1. Clone the repo
```sh
git clone https://github.com/deepzS2/youtube-clone.git
```
2. Install NPM/yarn packages
```sh
npm install

or

yarn
```
3. Create a `.env` file on the root with your secret token
```
SECRET=mysecretshhh
```
4. Start the API!
```sh
npm run dev

or 

yarn dev
```

<!-- USAGE EXAMPLES -->
## Usage

The docs route will be uploaded ASAP, but every route is documented with JSDoc on the [routes.ts](src/backend/routes.ts)

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.
