---
layout: post
title: "Setting ASP.NET application auto start from powershell."
description: "How to set ASP.NET application auto start from powershell script which may be used
during deployment"
category: [programming, C#, ASP.NET]
permalink: /:year/:month/:day/:title.html
--- 
### Why it takes so long
We all know the feeling when we load our ASP.NET app for the first time, and it takes much longer
to execute than the following requests. That is caused by all the things we put to Application_Start
in Global.asax. We all know that this method will be called when first request hits our application,
so we use it as a good place to initialize our app. This makes it much slower to access for the first
time. 

### One way of solving the problem
Many people were trying to solve the problem by themselves by scheduling calls to website to invoke
this first request and warm up application. This wasn't the most elegant solution since you have to
take under the consideration your application pool recycle time, also when your app pool crash IIS
it may not be wormed up because your scheduler doesn't know about it. 

### There is a better way in ASP.NET 4
Microsoft team included auto start feature in ASP.NET 4. You can read more about it in this article by
Scott Guthrie [Auto-Start ASP.NET Applications (VS 2010 and .NET 4.0 Series)]
(http://weblogs.asp.net/scottgu/auto-start-asp-net-applications-vs-2010-and-net-4-0-series). You just
need to configure your IIS in specific way and add implementation of IProcessHostPreloadClient interface
which will contain your warm up code. 

### What if you are lazy and you want to use PowerShell to configure your website to auto start
You still need to implement IProcessHostPreloadClient in your application. Then can use following
PowerShell code to configure your website. First you need to change your app pool start mode to
AlwaysRunning.

{% highlight powershell linenos=table %}
# This adds IIS manipulation snap in
Add-PSSnapin WebAdministration -ErrorAction SilentlyContinue
Import-Module WebAdministration -ErrorAction SilentlyContinue

# Setting application pool AlwaysRunning where $appPoolName is name of our app pool
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name startMode -Value AlwaysRunning
{% endhighlight %}

Now our app pool will be always running, but this won't change much in case of our first request
start up time. We have to make sure that after app pool start our warm up code will be invoked. So
we have to add auto start provider as it's explained in Scott article:

{% highlight powershell linenos=table %}
# Adding new auto start provider where $serviceName is unique name of our provider and $serviceType
# is type that implements our provider
Add-WebConfiguration -filter /system.applicationHost/serviceAutoStartProviders -Value @{name=$serviceName; type=$serviceType}
{% endhighlight %}

At the end we have to tell our web application to use configured auto start provider.

{% highlight powershell linenos=table %}
# Set web site auto start enabled where $webSiteName is our web site name
Set-ItemProperty "IIS:\Sites\$webSiteName" -Name applicationDefaults.serviceAutoStartEnabled -Value True
# Set web site auto start provider where $webSiteName is our web site name and $serviceName is name configured
# in previous step
Set-ItemProperty "IIS:\Sites\$webSiteName" -Name applicationDefaults.serviceAutoStartEnabled -Value $serviceName
{% endhighlight %}

Now you can go to your IIS Manager and confirm that all settings have been applied correctly. Now
when your app pool will be recycled, code you put in implementation of IProcessHostPreloadClient will
be executed to warm up your application.

### What if I use Octopus Deployment
If you use Octopus Deployment (and you should, since it's great piece of software) you can import
Octopus Library tasks to your Octopus Deployment installation. To do that, visit [Octopus Library]
(https://github.com/OctopusDeploy/Library/tree/master/step-templates) and download following templates:

* iis-apppool-update-property.json
* iis-website-update-property.json
* iis-autostartprovider-add.json

After importing them you can set web site, app pool and auto start provider settings directly from your
deployment server.

