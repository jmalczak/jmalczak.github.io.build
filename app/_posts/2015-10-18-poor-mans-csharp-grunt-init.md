---
layout: post
title: "Poor man's C# grunt-init."
description: "Poor man's C# grunt-init alternative to bootstrap C# WebApi service."
category: [programming, C#]
--- 
### Project Bootstrap Idea
Unfortunately, I couldn't be on DevDay 2015 conference. But I was watching all videos recommended by
other developers. One of the talks I really liked was "From Homogeneous Monolith to Radically 
Heterogeneous Microservices Architecture" by Chad Fowler. If you haven't seen it, you can find
youtube video below.
<div class="embed-responsive embed-responsive-16by9 margin-small">
    <iframe src="https://www.youtube.com/embed/v17DMiFHnB8" 
            allowfullscreen></iframe>
</div>
Chad is talking about move from monolith to microservices architecture they did in Wunderlist. When
defining microservices they put constraint on service size. In Wunderlist size of newly created
service should fit on one screen. This is quite radical, but it works for them based on the Chad's
talk. To be able to bootstrap services quickly they have created microservice template so creating
new service is as easy as clonning it from template and adding some business logic. So I thought
that this is quite useful.

### Microservices in my current project
I use microservices in my current project as well. We don't have any specific constraint on service
size. We just try to be pragmatic and when it grows too large we extract smaller services. Anyway
we end up creating services very often. And since we mostly use the same set of components to build
service we waste a lot of time on task which may be automated in the same way Chad did it.

### Grunt-init approach
There is already a tool for that, that use node.js. It's called [grunt-init](http://gruntjs.com/project-scaffolding).
and you can use it to bootstrap different kinds of projects. This is an example how you use it to
bootstrap C# project: [grunt-init-csharpsolution](https://github.com/nosami/grunt-init-csharpsolution).
Grunt-init just ask you for values needed to bootstrap project and then rename files and replace
values in solution directory. That's easy. But due to the variable replacement format 
{% highlight xml linenos=table %}
{% raw %}
{%= nametoreplace %} 
{% endraw %}
{% endhighlight %}
you cannot open template solution in Visual Studio since replacement value contains some illegal
C# characters. And I have found really convenient to be able to edit template in Visual Studio so yoou
don't have to mess with csproj, sln files.

### Poor man's powershell grunt-init replacement
To be able to open template in Visual Studio. I have used PROJECT_NAME as a variable replacement key 
and in connection with simple PowerShell script you can do the same thing. Below you can see how it 
works in practice.
<img class="img-responsive center-block padding-small" src="/img/poormansgruntinit/powershell-init-csharp-web.gif" alt="Poor man's powershell grunt-init" />
You can check out example source code on [here](https://github.com/jmalczak/powershell-init-csharp-web) 
on github. Feel free to fork and and make your own changes. 
