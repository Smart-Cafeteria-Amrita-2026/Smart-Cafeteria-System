$baseUrl = "http://localhost:3001"
Write-Host "Starting continuous traffic generation to $baseUrl..."
Write-Host "Press Ctrl+C to stop."

while ($true) {
    $r = Get-Random -Minimum 1 -Maximum 10
    
    # 50% chance of success request
    if ($r -le 5) {
        try {
            Invoke-RestMethod -Uri "$baseUrl/api/auth/test" -Method Get | Out-Null
            Write-Host "$(Get-Date -Format 'HH:mm:ss') GET /api/auth/test: Success" -ForegroundColor Green
        }
        catch { Write-Host "Failed" -ForegroundColor Red }
    } 
    # 30% chance of bad request
    elseif ($r -le 8) {
        try {
            $body = @{email = "bad"; password = "short" } | ConvertTo-Json
            Invoke-RestMethod -Uri "$baseUrl/api/auth/signIn" -Method Post -Body $body -ContentType "application/json" | Out-Null
        }
        catch { 
            Write-Host "$(Get-Date -Format 'HH:mm:ss') POST /api/auth/signIn: 400 Bad Request (Expected)" -ForegroundColor Cyan
        }
    } 
    # 20% chance of 404
    else {
        try {
            Invoke-RestMethod -Uri "$baseUrl/api/random-$(Get-Random)" -Method Get | Out-Null
        }
        catch {
            Write-Host "$(Get-Date -Format 'HH:mm:ss') GET /api/random: 404 Not Found (Expected)" -ForegroundColor Magenta
        }
    }

    # Random sleep between 0.5s and 2s
    Start-Sleep -Milliseconds (Get-Random -Minimum 500 -Maximum 2000)
}
