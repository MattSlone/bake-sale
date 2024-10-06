This was a personal project I worked on a couple years ago. It's a two sided marketplace for home cooks to sell their food.

Front end is React / Material UI. Backend is ExpressJS / Sequelize (mySQL)

# SETUP

1) Install Docker

# Startup

1) "cd server" and copy the .env.example to .env, update the values
2) From the project's root directory run "docker-compose up -d" to run the containers in the background, to run in the foreground remove the -d flag
3) Run "docker exec server yarn create-db" to create the DB, runs migrations, and seed the DB

# Reset DB

1) Run "docker exec server yarn reset-db"

# Working with containers

## Working with MySQL

run "docker exec -it db bash" to get a shell in the MySQL container. From there run "mysql -u root -p" to access the MySQL CLI

## Working with Sequelize

run "docker exec server yarn sequelize db:migrate" to run migrations, likewise you can replace db:migrate with any sequelize command

## Installing Dependencies

### Client side

run "docker exec client yarn add " followed by the name(s) of your dependencies

### Server side

run "docker exec server yarn add " followed by the name(s) of your dependencies

### Stripe CLI
Install it
run "stripe login"
run "sudo docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' server" to get the ip address of the server container
run "stripe listen --forward-to IP_ADDRESS_HERE:4242/webhook"
