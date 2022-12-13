
# Incedo Coding Challenge

## Last.fm Artist Search

---

## Get Started

Install npm packages

```
npm i
```

Copy `.env` to `development.env` for development environment or `production.env` for production.

```
cp .env development.env
```

Get an API Key for [Last.fm](https://www.last.fm/api/account/create) and update the `LAST_FM_API_KEY` environment variable in the `development.env` file.

---

## Development

### Start the server for development

```
npm run dev
```

### Run tests

```
npm test
```

---

## Production

Build the server.

```
npm run build
```

Run the server with `NODE_ENV` set to `production`.

```
NODE_ENV=production node dist/index.js
```

---

## APIs

### Interfaces

```ts
interface Artist
{
	name: string;
	mbid: string;
	url: string;
	image_small: string;
	image: string;
}
```

### `GET /artists/search/:artistName`

Gets and returns a list of artists. Returns random artists if the search result was empty.

| Type          | Name                    | Description                                                                                    |
| :------------ | :---------------------- | :--------------------------------------------------------------------------------------------- |
| Param         | `artistName`            | The name of the artist you want to search                                                      |
| *Querystring* | `randomFallbackAmount`  | Amount of random artists returned when search result was empty. Min. 1. Max. 3. Defaults to 1. |
| Response      | `{ artists: Artist[] }` | Array of artists                                                                               |

### `POST /artists/search/:artistName/csv/write-file`

Gets a list of artists and save them as a CSV file with the given filename. Stores random artists if search result was empty. Returns success message.

| Type          | Name                   | Description                                                                                    |
| :------------ | :--------------------- | :--------------------------------------------------------------------------------------------- |
| Param         | `artistName`           | The name of the artist you want to search                                                      |
| Querystring   | `csvFileName`          | Name of the CSV file without file extension.                                                   |
| *Querystring* | `randomFallbackAmount` | Amount of random artists returned when search result was empty. Min. 1. Max. 3. Defaults to 1. |
| Response      | `{ message: string }`  | Success message                                                                                |

### `GET /artists/search/:artistName/csv/get-as-file`

Gets a list of artists and returns it as a CSV file. Uses the `artistName` param for the file name by default.

| Type          | Name                   | Description                                                                                    |
| :------------ | :--------------------- | :--------------------------------------------------------------------------------------------- |
| Param         | `artistName`           | The name of the artist you want to search                                                      |
| *Querystring* | `csvFileName`          | Name of the CSV file without file extension. Defaults to a sanitized version of `artistName`.  |
| *Querystring* | `randomFallbackAmount` | Amount of random artists returned when search result was empty. Min. 1. Max. 3. Defaults to 1. |
| Response      | string                 | CSV File                                                                                       |

### `GET /csv/:fileName`

Gets a stored CSV file.

| Type     | Name       | Description                              |
| :------- | :--------- | :--------------------------------------- |
| Param    | `fileName` | The name of the CSV you want to download |
| Response | string     | CSV File                                 |

--- 

## Explanation

### Framework Choice

I used the `fastify` framework for several reasons. First is that i am familiar with it. Second is that it is a great piece of software with an awesome ecosystem. Plugins like `@fastify/autoload` make it easy to build a system that can be scaled up and developed further.

The whole thing could have been one JavaScript file with a simple HTTP Server, but with the current project structure its no problem to extend it. Just add a new service to `src/services/` and it will be loaded automatically when starting the server.

### TypeScript

While it may seem overkill for such a small coding challenge it is in my opinion the right choice for any new professional project.

### DRY and Testing

I put some functions into `src/utils/` instead of including it directly into the services so they can be tested individually and to adhere to the DRY principle.

I used the `ava` package for testing since its a developer friendly and fast alternative to `jest` etc. It allows for fast parallel testing. Tools like `nyc` can be used to get the code coverage.

### Dotenv Files

The use of the `.env` files has multiple advantages. Instead of adding the API key to code directly, which would be a security nightmare, you add them to the `development.env` or `production.env` file and they will not be committed. The example `.env` file makes it clear which environment variables are needed to get the server running.