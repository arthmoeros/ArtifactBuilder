+++
date = "2017-04-26T18:22:34-03:00"
draft = false
title = "Tidy and clean refactoring"

+++

Well, today has been a productive day, I managed to decouple the main process in 4 files/classes, and even reorganized the source files into folders, I think I've got a bit of OCD with code, renamed a few files and classes there, I'm not 100% agreed with Typescript naming conventions, but I think the result was quite tidy anyways.

In this work I took the oportunity to write my own "syntax rules" for the Artifacter's templates, I have yet to implement the parser and processor, but I wanted to have an idea about what is going to be with these templates, so, the templates on which the generation forms are based on were written thinking on this syntax.

I wanted some coloring on these templates, which I named with the "abtmpl" extension, so I did some research on how to implement custom syntax coloring for a file extension on Visual Studio Code and managed to pull it off. I came with a lot of regex which will prove useful when I implement the parser and processor, but for the time being, the "vscode extension" is available on the same repo, it recognizes "abtmpl" files and it colourizes strings, "Sub-template sections" and "Mapped Expressions". It looks very nice.