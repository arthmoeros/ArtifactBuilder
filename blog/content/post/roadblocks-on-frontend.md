+++
date = "2017-04-17T11:50:17-03:00"
draft = false
title = "Roadblocks on Front-end"

+++

Hi!, dev update, originally in the JSP version of ArtifactBuilder, the "Form" part of the application was rendered in runtime using a XML configuration file for each "Customer", this process was done via a JSP file rendering a HTML, once this was done the HTML was stored in memory so any subsequent requests would only display the already rendered HTML.

So, I wanted to do the same in the Angular version of the Front, and then I got my first roadblock, I asked myself, How can I achieve the same thing I did with JSP but without breaking Angular and taking advantage of its features?, it was a challenge, because the JSP version was plain old HTML with a bit of JS and CSS, here I wanted it to be a full fledged Angular Front-end,

I searched thoroughly with an answer to my predicament, but I found nothing, there was no example of an Angular "meta"-template, I needed to dynamically render Angular templates and components, but there was no way, besides Reflection looked too troublesome for what I wanted to achieve.

So my solution for this situation, was to make a pre-build on compilation time, using a TypeScript "script" (heh), which makes use of an upgraded XML configuration to build all Forms before compiling TS into JS. This script would take all XML configs and render their respective Angular Templates and Components, it was a very interesting experience, I could get a better grasp at how TypeScript works.