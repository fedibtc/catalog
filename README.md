# Fedi Mini Apps Catalog

Catalog of webLn and Nostr sites that works well with Fedi as Fedi Mini Apps

# Contributing

To make contributions to the Fedi Mods Catalog, open a pull request adding either a section or a specific mod to the `mods` directory.

## Adding a section 

Section are groupings of mods on a specific topic, a directory under the `mods` directory. The section must have a `meta.json` structure like this:

```
{
  "title": "Your section title",
  "order": 4 #the vertical ordering of the section must increase by 1 for each section
}
```

## Adding a mod

Mods are data about the site, the mod must be in a section directory in the `mods` directory. The mod must have a `meta.json` structure like this

```
{
  "name": "Name of the mod",
  "id": "randomID", //normally lowercase one word of the site
  "url": "https://example.com", //link to site
  "iconUrl": "http://example.com/favicon.ico", // normally /favicon.ico or a square png/jpeg
  "description": "Short description of the mod."
}
```

## Creating a PR

Fork this repo on replit or clone it locally with: 

```
git clone https://github.com/yourgithubusername/catalog
```

Enter the directory and create a branch 

```
git checkout - b mod-or-section-name
```

Create the mod or section directory with the meta.json or edit the meta.json for the mod or section you are updating 

commit your changes 
```
git add . 
git commit -m "feat: added the your-mod mod"
```

Push your changes 
```
git push 
```

Open a PR to the upstream repo
