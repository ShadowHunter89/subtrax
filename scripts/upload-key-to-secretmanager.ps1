<#
Upload a service account JSON to Google Secret Manager and grant access.
Usage:
  .\upload-key-to-secretmanager.ps1 -KeyPath "C:\path\to\subtrax-4964f-b4f3e5805056.json" -Project "subtrax-4964f" -SecretName "subtrax-firebase-key" -Member "serviceAccount:YOUR_RUNTIME_SA@subtrax-4964f.iam.gserviceaccount.com"

This script is a helper you run locally. It requires `gcloud` installed and authenticated.
It will NOT leave the JSON in the repository.
#>

param(
  [string] $KeyPath = "$env:USERPROFILE\.secrets_backup\subtrax-4964f-b4f3e5805056.json",
  [string] $Project = 'subtrax-4964f',
  [string] $SecretName = 'subtrax-firebase-key',
  [string] $Member = ''
)

if (-not (Test-Path $KeyPath)) {
  Write-Error "Key file not found at: $KeyPath"
  exit 1
}

Write-Host "Creating secret '$SecretName' in project $Project (if not exists)..."
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  Write-Error "gcloud CLI not found in PATH. Install and authenticate gcloud locally, or use the GitHub Actions workflow ./github/workflows/auto_upload_firebase_secret.yml"
  exit 2
}

try {
  $null = gcloud secrets describe $SecretName --project=$Project --quiet 2>$null
  Write-Host "Secret already exists."
} catch {
  gcloud secrets create $SecretName --replication-policy="automatic" --project=$Project --quiet
  Write-Host "Secret created."
}

Write-Host "Adding a new secret version from $KeyPath..."
gcloud secrets versions add $SecretName --data-file="$KeyPath" --project=$Project --quiet

if ($Member) {
  Write-Host "Granting secretAccessor to $Member..."
  gcloud secrets add-iam-policy-binding $SecretName --member=$Member --role='roles/secretmanager.secretAccessor' --project=$Project --quiet
}

Write-Host "Done. The secret is stored in Secret Manager as: projects/$Project/secrets/$SecretName"
Write-Host "Remember to remove the local backup if you no longer need it."
