# Hypertube

Hypertube is a free software for streaming video over the internet via BitTorrent peer-to-peer network protocol 🎬

### How to use it in local ?

1. Clone the project
2. Create a `.env` file in `hypertube/server/` with those properties

```
HOST=localhost
DB_USER=
DB_PASS=
OMDB_KEY=
JWT_KEY=S3cr3tTok3nAcc3ss
PASSPORT_42_CLIENT_ID=
PASSPORT_42_CLIENT_SECRET=
PASSPORT_GOOGLE_CLIENT_ID=
PASSPORT_GOOGLE_CLIENT_SECRET=
PASSPORT_GITHUB_CLIENT_ID=
PASSPORT_GITHUB_CLIENT_SECRET=
SMTP_MAIL_AUTH=
SMTP_MAIL_PASS=
NODE_ENV=prod
PORT_BACK=3000
```

3. Where can I find out my API keys
[OMDB](http://www.omdbapi.com/apikey.aspx),
[42_CLIENT](https://api.intra.42.fr) Only available for 42 Student (OPTIONAL),
[GOOGLE](https://developers.google.com/products/),
[GITHUB](https://github.com/settings/developers),
[SMTP](https://mailtrap.io),

For 42, Google and Github you have to register a new application, fill up 
- `Homepage URL` with `http://localhost:3000`
- `Authorization callback URL` with `http://localhost:3000/api/auth/PLATFORM/callback` where `PLATFORM` is 42, google or github

4. Then run this command into `hypertube/server/` and `hypertube/client/` to install packages and dependencies from package.json, if you encounter any problem with `node-sass` module, run `yarn add node-sass`

```
npm -i 
```

5. Run the server-side (hypertube/server/)

```
npm start
```

6. Create the tables of database

```
curl http://localhost:3000/api/create_base
```

7. Populate the database  

```
curl http://localhost:3000/api/save_movies
```

8. Run `npm run build` into `hypertube/client/` then install serve `npm i -g serve` and finally run `serve -s build`

9. Go to `http://localhost:5000` and chill !

### Running

Create an account, and check your email on [mailtrap](https://mailtrap.io) to activate it.

![hypertube](./assets/hypertube.png)

### Our stack

	* React / React-router / Redux
	* Node.js / Express
	* JavaScript ES6+
	* MYSQL
	* SCSS
 	* OAuth

### Resource
[YTS](https://yts.am/api)
[POPCORNTIME](https://popcorntime.api-docs.io/api/welcome/introduction)

### Author

Written by [nrandria](https://github.com/BABAK0T0), [lezhang](https://github.com/RiiceBall), [bsiguret](https://github.com/bsiguret) and myself.
