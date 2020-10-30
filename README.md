# SETUP

1) Install Docker

# Startup

1) "cd server" and copy the .env.example to .env, update the values
2) From the project's root directory run "docker-compose -d up" to run the containers in the background, to run in the foreground remove the -d flag
3) Run "docker exec server yarn create-db" to create the DB, runs migrations, and seed the DB

# Reset DB

1) Run "docker exec server yarn reset-db"

# Working with containers

## Working with MySQL

run "docker exec -it db bash" to get a shell in the MySQL container. From there run "mysql -u root -p root" to access the MySQL CLI

## Installing Dependencies

### Client side

run "docker exec client yarn add " followed by the name(s) of your dependencies

### Server side

run "docker exec server yarn add " followed by the name(s) of your dependencies