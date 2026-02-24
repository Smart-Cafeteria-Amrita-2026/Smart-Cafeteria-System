$baseUrl = "http://localhost:3001"
Write-Host "Sending requests to $baseUrl..."

for ($i = 1; $i -le 20; $i++) {
    # Success request
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/auth/test" -Method Get | Out-Null
        Write-Host "[$i] GET /api/auth/test: Success (200 OK)" -ForegroundColor Green
    }
    catch {
        Write-Host "[$i] GET /api/auth/test: Failed" -ForegroundColor Red
    }

    # Bad request (expecting 400) - Invalid JSON payload
    try {
        $body = @{email = "invalid-email"; password = "short" } | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/api/auth/signIn" -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "[$i] POST /api/auth/signIn: Unexpected Success (Should fail)" -ForegroundColor Yellow
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 400) {
            Write-Host "[$i] POST /api/auth/signIn: Expected Failure (400 Bad Request)" -ForegroundColor Cyan
        }
        else {
            Write-Host "[$i] POST /api/auth/signIn: Failed with $statusCode" -ForegroundColor Red
        }
    }
    
    # 404 Request
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/random-route" -Method Get | Out-Null
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "[$i] GET /api/random-route: Expected Failure (404 Not Found)" -ForegroundColor Magenta
    }

    Start-Sleep -Milliseconds 200
}
Write-Host "Traffic generation complete."
