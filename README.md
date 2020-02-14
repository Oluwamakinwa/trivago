## Prerequisites
1. [Node js 12](https://nodejs.org/en/download/)
2. [Postman](https://www.getpostman.com/) To test the endpoints
3. Any text Editor
4. [Git](https://git-scm.com/downloads)
5. [Docker](https://docs.docker.com/)
6. [Docker mongo image](https://hub.docker.com/_/mongo)

## Installing

Clone this project, cd into respective service and run:

```shell
//Using yarn
yarn
yarn dev

//Using npm
npm i
npm run dev

//Using docker-compose
docker-compose up --build
```
##.env file sample
```
NODE_ENV=
PORT=
API_VERSION=
ADMIN_API_SECRET=
PUBLIC_API_SECRET=
MONGO_DB_URL=
```

## Test
Test is written for only room category 
```shell
npm run test
```

## Admin Service Features
- Manage hotel account (CRUD)
- Manage room categories (CRUD and Filter)
- Manage room (CRUD and Filter)
- Manage client account (CRUD)
- Increase bonus points 
- Decrease bonus points
- View bonus point transactions
- Make Reservation
- View all reservations
- Checkout from room

## Public Service Features
- Create client account
- View client profile
- List and filter room categories
- List and filter rooms
- Make reservations
- Checkout from room

