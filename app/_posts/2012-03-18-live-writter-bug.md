---
layout: post
title: "Wordpress 3.2.1 and Windows Live Writter bug."
description: "Wordpress 3.2.1 and Windows Live Writter bug."
category: posting
tags: [post, live writter, bug, posting]
comments: true
share: true
---

Lately I was trying to configure Wordpress 3.2.1 to work with Windows Live Writer. 
If you don’t know Windows Live Writer yet, it is a part of Windows Live Essentials pack and it allow you to publish blog posts using Plain Old Desktop Application (I love acronyms! and PODA sounds quite cool). 

### Problem

I have noticed that apparently something has been changed in either Wordpress or Live Writer since the standard way of adding new blog didn’t work. I was receiving following error:

“Invalid server response – The response to the blogger.getUserBlogs method received from the blog server was invalid”

### Resolution

I have been searching for a solution for a long time. I have seen so many different answers to that problem that it was actually difficult to try them all. 
Finally I have managed to find a solution to my problems. At a first sight it didn’t look as it should fix the problem, but it did. 
For some reason Wordpress sends incorrect response length during invocation of getUserBlogs method. The way to fix it is to edit class-IXR.php file, located under wp-includes. 
You have to locate following line:

{% highlight html %} header(<span class="str">'Content-Length: '</span>.$length); {% endhighlight %}
and replace it with:
{% highlight html %} header(<span class="str">'Content-Length: '</span>.$length + 2); {% endhighlight %}

This small change fix the problem and let you use Windows Live Writer to publish your posts.