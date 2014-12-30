---
layout: post
title: "AttachToW3WP improvement."
description: Small improvement to AttachToW3WP project
headline: 
modified: 2014-11-12 07:24:34 +0100
tags: ['w3wp', 'iis', '.net']
category: programming
comments: true
featured: false
---
There is very cool Visual Studio extension available in Visual Studio Gallery. It's called AttachToW3WP, you can grab it [here](https://visualstudiogallery.msdn.microsoft.com/14b2a959-446f-406c-bcf0-abe87fc529e7). What it does is, it allows you to attach visual studio debugger process to IIS worker process for debugging purposes. You can do all those steps manually, by using Debug -> Attach To menu, but it's just much more convenient to have just one button to do that. You can also assign keyboard shortcut for Attach To action. One minor drawback is that it opens up default browser, just after it attach to w3wp process. This is not something I have wanted, since I usually work with browser already open. I have pulled code from GitHub repo, and made small change to do not pop up browser after it is attached. If you prefer this behavior, you can find my code here 

>[AttachToW3WP on GitHub](https://github.com/jmalczak/AttachToW3WP). 

Already compiled binnary is also available here 

>[AttachToW3WP.vsix](https://github.com/jmalczak/AttachToW3WP/raw/master/Binnaries/AttachToW3WP.vsix).