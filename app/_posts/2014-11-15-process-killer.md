---
layout: post
title: "Process killer."
description: "Small application which kills background processes"
modified: 2014-11-15 10:24:30 +0100
category: programming
comments: true
featured: false
---
I had some issues with my Elan Microelectronics notebook touchpad after upgrade to Windows 8. I have downloaded drivers for my old Samsung QX-410 notebook from original Samsung homepage. Unfortunately last supported operating system is Windows 7, so I had not much choice but use those drivers. Apparently they work fine for most of the time, bu sometimes ETDCtrl process show new unclickable, hidden window which is visible on taskbar. One way to get rid of it, is to kill ETDCtrl process. I have created small application to monitor list of processes and when specific process will be fired, application will kill it instantly. You can find source code and binaries on GitHub : 

>[Process Killer](https://github.com/jmalczak/ProcessKiller)

One way to run it, is from Windows auto start. Just type Win + R and paste following line for Windows 8:

{% highlight powershell %} AppData%\Microsoft\Windows\Start Menu\Programs\Startup {% endhighlight %}

and paste shortcut to Process Killer application. Next open up ProcessList.txt to configure processes to kill. Configuration file consist of list of processes. Each process name is in separate line:

{% highlight ini %}
totalcmd
totalcmd;12
{% endhighlight %}

You can also specify delay in seconds after which Process Killer will start killing certain tasks. To close application itself, double click it's tray icon.