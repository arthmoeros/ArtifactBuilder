+++
date = "2017-04-25T16:36:48-03:00"
draft = false
title = "Front-End generation done"

+++

Whew, dev update. It was hard, but I finally made it, from a single XML file and lots of TypeScript, an Angular app is born, including routing configuration and an index. This was very interesting to pull off because I had to deal with a lot of string management, considering I come from Java's StringBuilder, I needed something like that here in JS/TS. But for my surprise, there's nothing of the sort (Well, I did find an "C#" like API for TS, but at least it didn't work quite well for me), so I had to manage with a **String Container**, which only serves the purpose of containing a string instance and manipulating it directly, like a mutable string (which I also found a npm package for, but didn't meet my requirements). Internally just manages a "contained string", the Container only serves as a "reference" purpose, to keep my code a bit cleaner. Speaking of that, I've got lots of refactoring to do, it is quite a mess learning a "new" syntax and structure, the main script goes over 500 lines and a lot of methods, I think there could be at least 3 coupled classes inside, so it's decoupling time.