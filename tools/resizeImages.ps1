Param(
    [string]$folderPath,
    [int]$size
)
pushd
cd $folderPath
Get-ChildItem | Where-Object { $_.Name -NotLike "min*" } | ForEach-Object { convert $_.Name -resize $sizex$size^> "min.$($_.Name)" }
popd
