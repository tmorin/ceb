# Tutorial

## Create and configure the npm project

Create the project directory
```shell
node -e "require('fs').mkdirSync('ceb-tutorial')"
```

Jump into the project directory
```shell
cd ceb-tutorial
```

Initialize the npm project
```shell
npm init --yes
```

Add the dependencies
```shell
npm add -D typescript webpack ts-loader ceb karma karma-webpack karma-cli karma-chrome-launcher 
```
