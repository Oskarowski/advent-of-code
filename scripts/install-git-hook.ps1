$hookContent = @'
#!/bin/sh
# Auto-update progress before commit

# Check if any year README was modified
CHANGED_READMES=$(git diff --cached --name-only | grep -E '^(2022|2023|2024|2025)/README\.md$' || true)

if [ -n "$CHANGED_READMES" ]; then
  echo "Updating progress summary..."
  bun run scripts/generate-progress-summary.ts

  # Stage the updated files
  git add README.md PROGRESS.md 2>/dev/null || true
  echo "Progress summary updated and staged"
fi

exit 0
'@

$hooksDir = ".git/hooks"
$hookPath = "$hooksDir/pre-commit"

if (Test-Path $hooksDir) {
    # Write the hook file
    Set-Content -Path $hookPath -Value $hookContent -Encoding UTF8 -NoNewline

    # On Windows with Git Bash, the hook should work if it has the right line endings
    # Force LF line endings (Unix style) for the hook
    $content = Get-Content -Path $hookPath -Raw
    $content = $content -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($hookPath, $content, [System.Text.UTF8Encoding]::new($false))

    Write-Host "Pre-commit hook installed successfully!" -ForegroundColor Green
    Write-Host "The hook will auto-update progress when you commit year README changes" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Note: If you still have issues, you can skip the hook with:" -ForegroundColor Yellow
    Write-Host "  git commit --no-verify -m 'your message'" -ForegroundColor Yellow
} else {
    Write-Host ".git/hooks directory not found. Are you in a git repository?" -ForegroundColor Red
}
