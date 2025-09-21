<#
PowerShell helper: This script does NOT perform destructive history rewrites.
It prints the recommended steps to purge a file from git history using git-filter-repo or BFG.
Run these steps ONLY after you have rotated/revoked the leaked key.
#>

Write-Host "Purge secret guide"
Write-Host "1) Rotate/revoke the leaked key in Google Cloud Console NOW."
Write-Host "2) Mirror-clone the repository (example):"
Write-Host "   git clone --mirror https://github.com/<owner>/<repo>.git repo.git"
Write-Host "3) cd repo.git"
Write-Host "4) If you have git-filter-repo installed, run:" 
Write-Host "   git filter-repo --path server/config/firebase.json --invert-paths"
Write-Host "   git push --force"
Write-Host "5) If you prefer BFG, see its docs. After force-push, notify team to reclone."

Write-Host "This script is informational only — it will not run destructive commands."
