# Firebase Service Account Base64 Encoder
# This script converts the Firebase service account JSON to base64 for secure deployment

$serviceAccountPath = "c:\Users\DELL\Downloads\subtrax-4964f-0584aed4d854.json"

if (Test-Path $serviceAccountPath) {
    # Read the service account JSON file
    $serviceAccountJson = Get-Content $serviceAccountPath -Raw
    
    # Convert to base64
    $serviceAccountBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($serviceAccountJson))
    
    # Output the base64 string
    Write-Host "Firebase Service Account Base64 Encoded:" -ForegroundColor Green
    Write-Host ""
    Write-Host $serviceAccountBase64 -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Use this value for the FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable" -ForegroundColor Green
    Write-Host ""
    
    # Also save to a file
    $outputPath = "firebase-service-account-base64.txt"
    $serviceAccountBase64 | Out-File -FilePath $outputPath -Encoding UTF8
    Write-Host "Base64 string also saved to: $outputPath" -ForegroundColor Green
    
    # Show environment variable format
    Write-Host ""
    Write-Host "Environment Variable:" -ForegroundColor Cyan
    Write-Host "FIREBASE_SERVICE_ACCOUNT_BASE64=$serviceAccountBase64" -ForegroundColor White
} else {
    Write-Host "Service account file not found at: $serviceAccountPath" -ForegroundColor Red
    Write-Host "Please make sure the file exists in the correct location." -ForegroundColor Red
}