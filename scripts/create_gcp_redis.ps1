<#
Create a Google Cloud Memorystore Redis instance using gcloud CLI.

Prerequisites:
- gcloud SDK installed and authenticated (gcloud auth login / gcloud auth activate-service-account).
- You have permission to create Memorystore instances in the target project.

Usage:
.
    .\scripts\create_gcp_redis.ps1 -ProjectId my-project -Region us-central1 -InstanceId subtrax-redis -MemoryGb 1

Output: prints host, port and a suggested REDIS_URL value.
#>

param(
  # Default to your Firebase project if you don't pass -ProjectId explicitly
  [Parameter(Mandatory=$false)] [string]$ProjectId = 'subtrax-4964f',
  [Parameter(Mandatory=$false)] [string]$Region = 'us-central1',
  [Parameter(Mandatory=$false)] [string]$InstanceId = 'subtrax-redis',
  [Parameter(Mandatory=$false)] [int]$MemoryGb = 1,
  # Optional VPC network name (useful when default network is restricted)
  [Parameter(Mandatory=$false)] [string]$Network = 'default',
  # If set, push the resulting REDIS_URL to GitHub Secrets using `gh` CLI
  [Parameter(Mandatory=$false)] [switch]$PushToGh,
  # Target repository in owner/repo format for gh (optional; will try env:GITHUB_REPOSITORY)
  [Parameter(Mandatory=$false)] [string]$Repo = '',
  # Do not actually push to gh; show what would be done
  [Parameter(Mandatory=$false)] [switch]$DryRun
)

Write-Host "Using GCP project: $ProjectId"
Write-Host "Creating Redis instance $InstanceId in project $ProjectId region $Region (memory ${MemoryGb}GB)"

# Create instance (STANDARD_HA recommended for production; for dev use BASIC)
# Fail early if the gcloud CLI is not available
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  Write-Error "gcloud CLI not found. Install the Google Cloud SDK (https://cloud.google.com/sdk/docs/install) and restart your shell."
  exit 2
}

# create the instance (include network if provided)
$createCmd = "gcloud redis instances create $InstanceId --project=$ProjectId --region=$Region --size=$MemoryGb --redis-version=redis_6_x --tier=BASIC"
if ($Network -and $Network -ne 'default') {
  $createCmd += " --network=$Network"
}
Write-Host "Running: $createCmd"
# Execute the gcloud command using the call operator (&) and argument array to avoid string parsing
$createArgs = @('redis', 'instances', 'create', $InstanceId, "--project=$ProjectId", "--region=$Region", "--size=$MemoryGb", "--redis-version=redis_6_x", "--tier=BASIC")
if ($Network -and $Network -ne 'default') {
  $createArgs += "--network=$Network"
}

Write-Host "Invoking: gcloud $($createArgs -join ' ')"
& gcloud @createArgs

if ($LASTEXITCODE -ne 0) {
  Write-Error "gcloud redis instances create failed. Check permissions, quotas, and network settings."
  exit 1
}

if ($LASTEXITCODE -ne 0) {
  Write-Error "gcloud redis instances create failed. Check permissions, quotas, and network settings."
  exit 1
}

Write-Host "Waiting for instance to reach READY state (this may take a minute)..."
# Poll for READY status with a timeout
$maxAttempts = 30
$attempt = 0
$descJson = $null
while ($attempt -lt $maxAttempts) {
  $attempt++
  try {
    $descJson = & gcloud redis instances describe $InstanceId --project=$ProjectId --region=$Region --format=json 2>$null
  } catch {
    $descJson = $null
  }
  if ($descJson) {
    try {
      $descObj = $descJson | ConvertFrom-Json
      if ($descObj.state -and $descObj.state -eq 'READY') {
        break
      } else {
        Write-Host "Attempt $attempt/$maxAttempts: Instance state = $($descObj.state)"
      }
    } catch {
      Write-Host "Attempt $attempt/$maxAttempts: describe returned non-JSON or empty; retrying..."
    }
  } else {
    Write-Host "Attempt $attempt/$maxAttempts: describe returned no data; retrying..."
  }
  Start-Sleep -Seconds 5
}

if (-not $descJson) {
  Write-Error "Failed to describe instance after waiting. If creation is still in progress, wait a minute then run: gcloud redis instances describe $InstanceId --project=$ProjectId --region=$Region"
  exit 3
}

try {
  $desc = $descJson | ConvertFrom-Json
} catch {
  Write-Error "Failed to parse describe output as JSON: $_"
  exit 4
}

$redisHost = $desc.host
$redisPort = $desc.port

Write-Host "Redis instance created: host=$redisHost port=$redisPort"
$redisUrl = "redis://$redisHost`:$redisPort"
Write-Host "Suggested REDIS_URL (no auth): $redisUrl"
Write-Host "Set this in your environment or CI secrets as REDIS_URL"

# Optionally push to GitHub Secrets using gh
if ($PushToGh) {
  if ($DryRun) {
    Write-Host "[dry-run] Would push REDIS_URL to GitHub Secrets for repo: $Repo (or GITHUB_REPOSITORY env) with value: $redisUrl"
  } else {
    # determine repo
    $targetRepo = $Repo
    if (-not $targetRepo -and $env:GITHUB_REPOSITORY) { $targetRepo = $env:GITHUB_REPOSITORY }
    if (-not $targetRepo) {
      Write-Error "No target repo provided. Pass -Repo owner/repo or set GITHUB_REPOSITORY environment variable. Aborting push."
      exit 5
    }
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
      Write-Error "GitHub CLI (gh) not found. Install from https://cli.github.com/ and authenticate (gh auth login)."
      exit 6
    }
    Write-Host "Pushing REDIS_URL to GitHub Secrets for $targetRepo"
    # set secret - use gh with arguments to avoid string interpolation issues
    $ghArgs = @('secret', 'set', 'REDIS_URL', '--body', $redisUrl, '--repo', $targetRepo)
    Write-Host "Invoking: gh $($ghArgs -join ' ')"
    & gh @ghArgs
    if ($LASTEXITCODE -ne 0) {
      Write-Error "Failed to set GitHub secret via gh."
      exit 7
    }
    Write-Host "Successfully pushed REDIS_URL to $targetRepo (secret name: REDIS_URL)"
  }
}
