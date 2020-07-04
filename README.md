# SETUP

1) run "npm install"
2) run "npm build" (technically unnecessary but just do it for now)

## Until we get vagrant setup
3) Install Visual C++ Redistributables from https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads (vc_redist.x64.exe or x86)
4) Install MySQL Server Community Edition https://dev.mysql.com/downloads/file/?id=495322
5) When prompted to setup root user, set password as "root"
6) Navigate to /server and run the command "npx sequelize db:create".

# START
1) Navigate to /server and run "npx sequelize "
2) Run "node server/app" to start express server
3) Run "npm start" "sequelize db:migrate"
