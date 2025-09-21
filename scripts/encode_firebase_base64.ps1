param(
  [Parameter(Mandatory=$true)] [string]$FilePath
)

if (-not (Test-Path $FilePath)) {
  Write-Error "File not found: $FilePath"
  exit 1
}

$content = Get-Content -Raw -Path $FilePath
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$b64 = [System.Convert]::ToBase64String($bytes)
Write-Output $b64
