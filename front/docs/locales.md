## Before work

#### [Crowdin](https://crowdin.com/) - https://crowdin.com/
Crowdin is a cloud-based solution that streamlines localization management for your team. It's the perfect place to effectively manage all of your multilingual content.


#### Check crowdin API key and your access to crowdin project

#### Be sure that you have default translations in `src/locales/{selectedLanguage}/messages.po`

## Getting started

#### First step is build and starting server.
```
npm run build

npm run start
```

After, you need request get query to /api/locales.
This endpoint will get translations from [Crowdin](https://crowdin.com/) will run

```
npm run compile
```

which will compile .po files to pressed js files and after that, updated locales by path `src/locales/{selectedLanguage}/messages.js`

### Final step

You need restart your Next.js application by command

```
 npm run start
```