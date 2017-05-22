@echo off
move .gitignore .gitignore_origin
move .gitignore_heroku .gitignore
call npm run ui-builder
call npm run build
echo. >> .\src\app\worker-service.consumer.js
echo deployed = ''; >> .\src\app\worker-service.consumer.js
git --git-dir=.git_heroku add .
git --git-dir=.git_heroku commit -m "heroku deploy"
git --git-dir=.git_heroku push heroku master
move .gitignore .gitignore_heroku
move .gitignore_origin .gitignore