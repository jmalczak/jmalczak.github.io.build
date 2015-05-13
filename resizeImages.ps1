Param(
    [string]$folderPath,
    [int]$size
)
pushd
cd $folderPath
Get-ChildItem | ForEach-Object { convert $_.Name -resize $sizex$size "min.$($_.Name)" }
popd
