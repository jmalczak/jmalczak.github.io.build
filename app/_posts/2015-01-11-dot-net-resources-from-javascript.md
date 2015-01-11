---
layout: post
title: "Use .NET resources from JavaScript."
description: "How to use Microsoft .NET resources in connection with T4 templates to access localized strings from JavaScript."
category: [programming, t4, resources, localization]
--- 
### Problem
It is often the case, that you would like to use the same set of resources from both, server side and client side code. There is a couple of solutions to this problem, which I am going to describe briefly.

### HTTP handler or lightweight service
You can find an example of HTTP handler implementation on Rick Strahl [web page](http://weblog.west-wind.com/posts/2009/Apr/02/A-Localization-Handler-to-serve-ASPNET-Resources-to-JavaScript). It is a simple HTTP handler which returns JavaScript object for either local or global resource set. In order to use it you should add JavaScript script tag with src set to URL of your HTTP handler. Culture is provided via query string and included in the original script URL. Example code:

{% highlight C# %}
<script src='" + 
    Westwind.Globalization.JavaScriptResourceHandler.GetJavaScriptGlobalResourcesUrl("globalRes","Resources") + 
    "' type='text/javascript'>
</script>" 
{% endhighlight %}

And this can embeed following JavaScript in your page:

{% highlight javascript %}
var globalRes = {
    Today: 'Heute',
    Yesterday: 'Gestern'
};
{% endhighlight %}

Lately when Microservices are becoming more and more popular, the same, may be achieved by returning your JavaScript form simple WebApi REST service. This solution will do the work, but it's not the best one you can use. First of all, you can't minimize JavaScript code. You would have to do it on the fly. You also loose intellisense for all of you resources, when you develop JavaScript code. This may sound like a minor issue, but when you have hundreds of resources, it's not helping. One huge advantage of this approach is that you can change your localization texts in runtime, and returned JavaScript will be regenerated again and will reflect your changes.

### Inline localization embedding
This is the easiest method. In your view engine files (.aspx or .cshtml), you can create explicit resource object, and select only those resources which are really needed in JavaScript code. For example, you can create localization object like this:

{% highlight javascript %}
var localization = {
    Today: '@Resources.YourResourceClass.Today',
    Yesterday: '@Resources.YourResourceClass.Yesterday'
};
{% endhighlight %}

This will make sure that your localization object will be rendered correctly in a current culture. Simple and powerful solution, but not without it's own drawbacks. You still can't minify this code. It's also required to put this code in view engine files, since .js files are not processed by ASP.NET pipeline, you can't place code like that where it belongs to. So you can imagine the long listings of those in every view. Depending where you use your localization object, you may have some intellisense support. This solution is also a perfect choice if you will change localization texts after deployment.

### JavaScript resource files generated using T4 templates
Another approach to the problem, may be to generate set of JavaScript files which will hold translated resources in all of available languages. First step would be to create class to get all resources available in our application in the every supported culture. We will use ResourceModel class for this reason:

{% highlight C# %}
public class ResourceModel
{
    public string ResourceFileName { get; set; }

    public string CultureCode { get; set; }

    public string Key { get; set; }

    public string Value { get; set; }
}
{% endhighlight %}

To get list of resources, first we need to get all resource files by using GetManifestResourceNames method on assembly to which resources are compiled into. In my case it's Shared assembly.

{% highlight C# %}
typeof(Shared).Assembly.GetManifestResourceNames()
{% endhighlight %}

Next we parse resource set name and get all resources for every set. Entire ResourceService class is available below. It will be used within T4 template to generate single JavaScript file per culture.

{% highlight C# %}
public class ResourceService
{
    private const string FileNameGroup = "fileName";

    private const string ResourceSetGroup = "resourceSet";

    private const string CultureCodeGroup = "cultureCode";

    private static readonly object Lock = new object();

    private readonly string resourceFolder;

    private string fileNameRegex = string.Format("^.*\\.(?<{0}>.*).resources$", FileNameGroup);

    private string resourceSetRegex = string.Format("^(?<{0}>.*).resources$", ResourceSetGroup);

    private string cultureCodeRegex = string.Format("^.*\\.(?<{0}>.{{2}}-.{{2}}).resx$", CultureCodeGroup);

    public ResourceService(string resourceFolder)
    {
        this.resourceFolder = resourceFolder;
    }

    public List<ResourceModel> GetResources()
    {
        return (from resourceSet in typeof(Shared).Assembly.GetManifestResourceNames()
                let setName = Regex.Match(resourceSet, this.resourceSetRegex).Groups[ResourceSetGroup].Value
                let resourceManager = new ResourceManager(setName, typeof(Shared).Assembly)
                from culture in this.GetAvailableCultures()
                let resource = resourceManager.GetResourceSet(culture, true, true)
                let fileName = Regex.Match(resourceSet, this.fileNameRegex).Groups[FileNameGroup].Value
                from DictionaryEntry singleResource in resource
                select
                    new ResourceModel
                        {
                            ResourceFileName = fileName,
                            Key = (string)singleResource.Key,
                            Value = (string)singleResource.Value,
                            CultureCode = culture.Name
                        }).ToList();
    }

    private List<CultureInfo> GetAvailableCultures()
    {
        var cultures = new List<CultureInfo> { CultureInfo.InvariantCulture };
        cultures.AddRange(
            from file in Directory.GetFiles(this.resourceFolder)
            select Regex.Match(file, this.cultureCodeRegex)
            into match
            where match.Success
            select new CultureInfo(match.Groups[CultureCodeGroup].Value));

        return cultures.Distinct().ToList();
    }
}
{% endhighlight %}

To generate multiple JavaScript files from the T4 template, we need to use [T4Toolbox](https://t4toolbox.codeplex.com/) Visual Studio extension. You can either download it from [Visual Studio Gallery](https://visualstudiogallery.msdn.microsoft.com/7f9bd62f-2505-4aa4-9378-ee7830371684) or using extension manager:

<img class="img-responsive center-block" src="/img/t4toolbox.jpg" alt="T4 Toolbox" />

It is possible to do the same without T4Toolbox, but our template would be much bigger, since we would have to not only create many files, but also use Visual Studio automation to add those files to a current project. By using T4Toolbox, it's no longer a problem, since extension will do the above actions for us. After installation and restart, it's time to add resource.tt template:

{% highlight C# %}
<#@ template language="C#" debug="True" hostspecific="True" #>
<#@ include file="T4Toolbox.tt" #>
<#@ output extension="js" #>
<#@ assembly name="System.Core" #>
<#@ assembly name="$(TargetDir)\WebSiteCore.Common.dll" #>
<#@ assembly name="$(TargetDir)\WebSiteCore.BLL.dll" #>
<#@ import namespace="System.Collections.Generic" #>
<#@ import namespace="System.Linq" #>
<#@ import namespace="WebSiteCore.Common.Models.Infrastructure.Resource" #>
<#@ import namespace="WebSiteCore.Common.Infrastructure.Services" #>
<#
    var resourceService = new ResourceService(Host.ResolvePath(@"..\..\..\..\..\WebSiteCore.Resources"));
    var resources = resourceService.GetResources();

    foreach (var resourceInOneCulture in resources.GroupBy(r => r.CultureCode)) 
    {
        var r = new ResourceTemplate(resourceInOneCulture.Key, resourceInOneCulture.ToList());
        r.Render();   
    }
#>
<#+

public class ResourceTemplate : Template
{
    private readonly string cultureName;

    private readonly List<ResourceModel> resources;

    public ResourceTemplate(string cultureName, List<ResourceModel> resources)
    {
            this.cultureName = cultureName;
            this.resources = resources;

            if(!string.IsNullOrEmpty(cultureName))
            {                   
                this.Output.File = string.Format("resource.{0}.js", this.cultureName);
            }
    }

    public override string TransformText()
    {
#>
webSiteCore.Resource = (function (){

    var resources = {
<#+ foreach (var resourceGroup in this.resources.GroupBy(r => r.ResourceFileName)) 
{
    PopIndent();
    PushIndent("                ");
    WriteLine(resourceGroup.Key + ": {") ;

    foreach (var resource in resourceGroup) 
    {                       
        PushIndent("    ");
        WriteLine(resource.Key + " : '" +  System.Net.WebUtility.HtmlEncode(resource.Value) + "',");
        PopIndent();
    }

    WriteLine("},\n");
    PopIndent();
} #>
    }

    return resources;

})();
<#+
        return this.GenerationEnvironment.ToString();
    }
}
#>
{% endhighlight %}

Now it's time to add something to resource files and test if everything works fine. To run T4, just save template or use transform all templates option in Visual Studio 2013 menu:

<img class="img-responsive center-block" src="/img/transformAllT4Templates.png" alt="Transform All T4 Templates" />

Generated files are named in the same way as the original resources. They have culture name as part of extension, so you can load just specific culture, not all at once. Example file for default culture:

{% highlight javascript %}
webSiteCore.Resource = (function (){
    var resources = {
                Account: {
                    UsernameCannotBeEmpty : 'Username cannot be empty',
                },

                Administrator: {
                    ErrorDetailServerVariablesTitle : 'Server Variables',
                    ErrorDetailServerVariablesValue : 'Value',
                    DashboardStorage : 'Storage',
                    DashboardOperatingSystems : 'Operating Systems',
                },

                Error: {
                    UnauthenticatedTitle : 'Unauthenticated',
                },
    }

    return resources;

})();
{% endhighlight %}

With this approach, you can easily minify and bundle JavaScript files before deployment. It's also possible to use intellisense, since every time you use webSiteCore.Resource object, interpreter knows its definition. If some parts of your application are written purely in JavaScript, you can request dynamic loading of specific languages by using RequireJS. Unfortunately, this solution is not entirely perfect as well. When one of the requirements is to change localized texts after deployment of your application, you will have to regenerate JavaScript files and re upload them to the server. Full example is available on GitHub as a [Gist](https://gist.github.com/jmalczak/2c615c10dadb9836cbc5).