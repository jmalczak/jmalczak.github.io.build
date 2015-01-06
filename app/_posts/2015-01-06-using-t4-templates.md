---
layout: post
title: "Using T4 templates to generate C# dictionary from SQL table values."
description: "How to use Microsoft T4 templating engine to generate C# dictionary classes from SQL table values."
category: programming
--- 
When you store your data in SQL relational database. It's always good to have your dictionary entries in database as well. Thanks to that you can keep referential integrity between your data. Let me show you an example. If we would like to model our User table following way:

{% highlight sql %}
CREATE TABLE [dbo].[User] (
    [Id]                   UNIQUEIDENTIFIER NOT NULL,
    [Name]                 NVARCHAR (256)   NULL,
    [StatusId]             UNIQUEIDENTIFIER NOT NULL,
)
{% endhighlight %}

As you can see, we have simple user with Id, Name and user status. Since status is just simple GUID, you can insert there whatever you want, except NULL. You probably have some kind of guard clause in your C# code which prevents you from inserting invalid data. But wouldn't be cool if we could use SQL referential integrity to make sure that data will be consistent, even if you would like to insert row manually? To do that, we can add another table called UserStatus:

{% highlight sql %}
CREATE TABLE [dbo].[UserStatus] (
    [Id]                   UNIQUEIDENTIFIER NOT NULL,
    [Name]                 NVARCHAR (256)   NULL,
)
{% endhighlight %}
 
And now we can add foreign key from User to UserStatus table. This is done by adding following line to User table definition:

{% highlight sql %}
CONSTRAINT [FK_dbo.User_dbo.UserStatus_StatusId] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[UserStatus]([Id])
{% endhighlight %}

If you will try to insert new user with StatusId not in UserStatus table, you will receive error. Now everything is fine, but you have to keep 2 copies of user status, one in your C# code in form of enum or more complex dictionary class, and the second one in your database. It's often the case that those 2 copies are out of sync. To get rid of this problem we will keep only one copy of user statuses and we will generate C# class which will be used in our C# code. T4 template is just a perfect for this kind of a job. First of all, let's make sure that all user statuses are inserted into database table. To do this, we can create SQL post deployment script which will be used to add or edit statuses. Script can look like this:

{% highlight sql %}
DECLARE @Id UNIQUEIDENTIFIER
SET @Id = 'B58100F1-B66B-4FC1-B9AC-37DE29FA3C08'

IF NOT EXISTS (SELECT TOP 1 1 FROM [dbo].[UserStatus] WHERE [Id] = @Id)
BEGIN
    INSERT INTO [dbo].[UserStatus](Id, Name, InsertDate, InsertUser) VALUES (@Id, 'New', GETUTCDATE(), 'malczak.net');
END
{% endhighlight %}

Next step is to create T4 template to generate C# classes based on data in dictionary table. We need a way to tell our template which tables are the dictionary tables and which column will be used as Id and which as Name. Simple XML file can hold that information:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8" ?>
<dictionaries>
  <dictionary table="dbo.UserStatus" idcolumn="Id" namecolumn="Name" dictionaryname="UserStatus" />
</dictionaries>
{% endhighlight %}

Additional dictionaryname attribute will be used to name C# class so it doesn't have to follow the same name as database table. Three more DTO classes are used to hold intermediate values during dictionary generation.

{% highlight csharp %}
public class DictionaryItemDefinition
{
    public string TableName { get; set; }

    public string IdColumn { get; set; }

    public string NameColumn { get; set; }

    public string Name { get; set; }
}
{% endhighlight %}

This is the class which is used to store data from XML file. Each row in XML is parsed and returned as DictionaryItemDefinition object.

{% highlight csharp %}
public class DictionaryTable
{
    public DictionaryTable()
    {
        this.Items = new List<DictionaryItem>();
    }

    public Type IdType { get; set; }

    public List<DictionaryItem> Items { get; set; }
}
{% endhighlight %}

DictionaryTable class represents table with list of dictionary entries. So in our example this is instance holding UserStatus table and New value as DictionaryItem.

{% highlight csharp %}
public class DictionaryItem
{
    public string Name { get; set; }

    public object Id { get; set; }
}
{% endhighlight %}

And last one holds dictionary values, so in our case name New and proper GUID value. All those classes are used in DbDictionaryHelper. Since it's much nicer to write in C# code in C# classes not in T4 templates, most of the code is encapsulated in DbDictionaryHelper. Then GetDictionaryDefinitionItems() helper method is used in T4 template to parse XML file and retrieve dictionary definition:

{% highlight csharp %}
public List<DictionaryItemDefinition> GetDictionaryDefinitionItems()
{
    var document = XDocument.Load(this.configFilePath);

    return Enumerable.ToList<DictionaryItemDefinition>(document.Descendants()
                     .Where(n => n.Name == "dictionary")
                     .Select(n =>
                        new DictionaryItemDefinition
                        {
                            TableName = n.Attribute("table").Value.ToString(CultureInfo.InvariantCulture),
                            IdColumn = n.Attribute("idcolumn").Value.ToString(CultureInfo.InvariantCulture),
                            NameColumn = n.Attribute("namecolumn").Value.ToString(CultureInfo.InvariantCulture),
                            Name = n.Attribute("dictionaryname").Value.ToString(CultureInfo.InvariantCulture)
                        }));
}
{% endhighlight %}

For each entry we will query corresponding table in database and get values for columns specified as Id and Name in GetDictionaryTable() method:

{% highlight csharp %}
public DictionaryTable GetDictionaryTable(DictionaryItemDefinition itemDefinition)
{
    using (var connection = new SqlConnection(this.WebSiteCoreConnectionString))
    {
        using (var command = new SqlCommand(string.Format(CultureInfo.InvariantCulture, "SELECT * FROM {0}", itemDefinition.TableName), connection))
        {
            connection.Open();

            var reader = new SqlDataAdapter(command);
            using (var dataSet = new DataSet())
            {
                reader.Fill(dataSet);

                var dictionaryTable = new DictionaryTable { IdType = dataSet.Tables[0].Rows[0][0].GetType() };
                foreach (DataRow row in dataSet.Tables[0].Rows)
                {
                    dictionaryTable.Items.Add(new DictionaryItem
                    {
                        Id = row[itemDefinition.IdColumn],
                        Name = row[itemDefinition.NameColumn].ToString().Replace(" ", string.Empty)
                    });
                }

                return dictionaryTable;
            }
        }
    }
}
{% endhighlight %}

Having DbDictionaryHelper, we can finally create DbDictionary.tt template which just invoke functionality from helper class and iterate over the results to create code blocks:

{% highlight csharp %}
<#@ template debug="true" hostspecific="true" language="C#" #>
<#@ assembly name="System.Core" #>
<#@ assembly name="System.Data" #>
<#@ assembly name="System.Configuration" #>
<#@ assembly name="System.Xml" #>
<#@ assembly name="$(TargetPath)" #>
<#@ import namespace="WebSiteCore.Common.Models.Domain.EntityDictionary" #>
<#@ output extension=".cs" #>
<#
    var dictionaryItems = new  DbDictionaryHelper(Host, 
                                                  Host.ResolvePath(@".\DbDictionary.xml"), 
                                                  Host.ResolvePath(@"..\..\..\..\WebSiteCore.Web\Web.config"));
#>
namespace WebSiteCore.Common.Models.Domain.EntityDictionary
{
<#
        var tableDefinitions = dictionaryItems.GetDictionaryDefinitionItems();

        foreach (var tableDefinition in tableDefinitions)
        {
            var table = dictionaryItems.GetDictionaryTable(tableDefinition);
#>
    public class <#= tableDefinition.Name #>
    {
<#
            foreach (var item in table.Items)
            {
#>
<#
                if (table.Items.IndexOf(item) != 0)
                {
#>

<#
                }
#>
        public static <#= tableDefinition.Name #> <#= item.Name #> 
        { 
            get 
            { 
                return new <#= tableDefinition.Name #> { Name = "<#= item.Name #>", Id = <#= table.IdType.FullName #>.Parse("<#=item.Id#>") };
            }
        }
<#
        }
#>
    
        public <#= table.IdType.FullName #> Id { get; set; }

        public string Name { get; set; }
    }
<#      if (tableDefinitions.IndexOf(tableDefinition) != tableDefinitions.Count - 1) 
        { 
#>

<#      } #>
<#  } #>
}
{% endhighlight %}

Syntax of T4 is not one of my favorites but you can get used to it if you use good editor with proper code highlighting. Final generated class for our simple example will look like this:

{% highlight csharp %}
namespace WebSiteCore.Common.Models.Domain.EntityDictionary
{
    public class UserStatus
    {
        public static UserStatus New 
        { 
            get 
            { 
                return new UserStatus { Name = "New", Id = System.Guid.Parse("B58100F1-B66B-4FC1-B9AC-37DE29FA3C08") };
            }
        }

        public System.Guid Id { get; set; }

        public string Name { get; set; }
    }
}
{% endhighlight %}

And can be used in C# code in following way:

{% highlight csharp %}
If (status == UserStatus.New.Id) 
{
    //You code
}
{% endhighlight %}

Now every time you add new dictionary, it's enough to add it to XML definition and regenerate T4 by jus saving it again. Also if you insert new values and save T4, values will be updated. Nice way of running all of your templates is to add step in build process to generate those for you, or use BUILD -> Transform All T4 Templates menu option in Visual Studio 2013. Full example is available on GitHub as a [Gist](https://gist.github.com/jmalczak/d2b8971c47909539778b).