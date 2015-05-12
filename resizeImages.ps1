Param(
    [string]$folderPath
)
pushd
cd $folderPath
Get-ChildItem | ForEach-Object { convert $_.Name -resize 1000x1000 "min.$($_.Name)" }
popd
