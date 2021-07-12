# 1 - Create the project

## Create the project directory

```shell
node -e "require('fs').mkdirSync('ceb-tutorial')"
```

## Jump into the project directory

```shell
cd ceb-tutorial
```

## Initialize the git repository

```shell
git init
```

## Initialize .gitignore

```shell
node -e "require('fs').writeFileSync('.gitignore', '')"
```

## Initialize the npm project

```shell
npm init --yes
```

## Commit the change

```shell
git add -A && git commit -m "chore: create project"
```
