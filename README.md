# ![artifacter-logo](/src/rsz_artifacter-logo.png)@artifacter/ui

### UI generation tool for Artifacter

#### What's this? - Intro
This component consists of two parts, the first being the ui generation tool, "UI-Builder", it makes use of templates based on the Artifacter's Template Engine (it is based because is not using the engine as is and has sub-template functionality), the second part is the base UI components, which are the core NG components not directly dependant on the UI itself.

#### What's the UI-Builder? - UI Generation tool
The UI-Builder is a program that runs in the CLI, it builds all the Angular components necessary for the UI of Artifacter, it makes use of atmpl based files (see [Template Engine](https://github.com/arthmoeros/artifacter-template-engine), although it actually doesn't make use of it yet) and a JSON configuration file to render generation forms, which makes use of Artifacter's Worker module (see [Worker](https://github.com/arthmoeros/artifacter-worker)) to make artifact generation requests. Because of the requirement of the JSON configuration file, this module configuration is tightly coupled with Artifacter's Worker module configuration, making it a requirement to both configurations to be aware of each other.

##### Why is not using @artifacter/template-engine? - Or why @artifacer/template-engine is not this
As some people could guess, the Template Engine module is not powerful enough to handle the UI generation process required, so the engine is implemented here but in a specific way for this tool, so it cannot be used outside of it. It is considered in a future release, discarding this generation process in favor of Express JS templates.

#### What's this base UI? - Static components
This module only uses the UI-Builder to generate the index and generation forms, every other angular component necessary for this to work is already written, also the component which serves the purpose of communicating with Artifacter's Worker module is already written, these component aren't part of the UI generation tool.

#### How does it run?
The UI-builder is incorporated into the package.json file as *npm run ui-builder*, it outputs the generated ui components into the *app/src/* folder.
The *production* mode is run via *npm start* which asumes all ts files have been compiled and the ui generated, development mode is run with *npm run dev*

#### Can I try this? - Live Demo
Yes!, it is available as a Heroku App (please be mindful of your use, it is a free account), go here -> https://artifacter.herokuapp.com/, feel free to report any issues here on github.

#### How does it stands? - Status
This module was made using Angular's quickstart as a basis, so it has a bit of clutter to clean yet, but it does work fine as is. The front is responsive though.

#### What's next? - Planned features for a future release
The first goal is to loosen the coupling of this module with the Worker module, it primarly requires an upgrade of both configurations to move its governance to the Worker module only and making UI a consumer of it, such as a form describing configuration on Worker that may be requested by a rendering UI module such as this or any other. This of course implicates that the UI building process must evolve to an online one, using Express JS could be the option here.
Next would be the upgrade of the Template Engine module to use sub-templates, which would require upgrades here and the Worker module, because it would require it to evolve to a more advanced model, so there is a lot of work on schedule.
