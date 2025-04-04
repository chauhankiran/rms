# RMS (Lightweight CRM)

**Currently under heavy development. Far from an alpha release.**

RMS is a Record Management System as a CRM system for the small and medium sized businesses. The application is created using traditional and proven MVC architecture. Following are list of major technologies used while creating this application.

1. Node
2. Express
3. Postgres
4. Redis
5. Pug

## Getting Started

1. Clone the repo.

```
https://github.com/chauhankiran/rms.git
```

2. cd into it.

```
cd rms
```

3. Install the dependencies.

```
npm i
```

4. Copy the `.env.example` and make the `.env` file.

```
cp .env.example .env
```

5. Adjust the environment variables within created `.env` file.
6. Create a database with name `rms` or whatever you define in `.env` file.
7. Run migrations.

```
npm run migrate
```

8. Run seeders.

```
npm run seed
```

9. Run the application.

```
npm run dev
```

10. Open http://localhost:3000 and have fun!
