$p = "c:\Users\mabel\Documents\GreenNote-UI\FrontEnd\src\pages\HospitalDashboard.jsx"
$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)

# The file was saved with wrong encoding - each UTF-8 multibyte sequence was
# interpreted as individual Latin-1 chars. We replace each garbled sequence.
$c = $c -replace 'Rajan Kumar â€" KL-07-AB-1234 âœ…', 'Rajan Kumar — KL-07-AB-1234 ✅'
$c = $c -replace 'Suresh Nair â€" KL-07-CD-5678 âœ…', 'Suresh Nair — KL-07-CD-5678 ✅'
$c = $c -replace 'Anil Thomas â€" KL-07-EF-9012 âŒ', 'Anil Thomas — KL-07-EF-9012 ❌'
$c = $c -replace 'ðŸŸ¢ Stable', '🟢 Stable'
$c = $c -replace 'ðŸŸ¡ Critical', '🟡 Critical'
$c = $c -replace 'ðŸ"´ Very Critical', '🔴 Very Critical'
$c = $c -replace '>ðŸ¥</div>', '>🏥</div>'
$c = $c -replace '>âœ…</div>', '>✅</div>'
$c = $c -replace 'â³ Status:', '⏳ Status:'
$c = $c -replace 'ðŸš¨ Create Green', '🚨 Create Green'
$c = $c -replace 'ðŸš¨"', '🚨"'
$c = $c -replace '"â³"', '"⏳"'
$c = $c -replace '"âœ…"', '"✅"'
$c = $c -replace '"âš¡"', '"⚡"'
$c = $c -replace ">âž•</div>", '>➕</div>'
$c = $c -replace "preferencesâ€¦", 'preferences…'
$c = $c -replace "Submittingâ€¦", 'Submitting…'
$c = $c -replace "\{' '\}ðŸ¥", "{' '}🏥"
$c = $c -replace '&nbsp;Â·&nbsp;', '&nbsp;·&nbsp;'
$c = $c -replace "'ðŸŸ¢'", "'🟢'"
$c = $c -replace "'ðŸŸ¡'", "'🟡'"
$c = $c -replace "'ðŸ`"´'", "'🔴'"
$c = $c -replace 'â"€â"€ Create form view â"€+', '── Create form view ─────────────────────────────────────────────────────'
$c = $c -replace 'â"€â"€ Dashboard view â"€+', '── Dashboard view ────────────────────────────────────────────────────────'

# Section card titles with garbled emojis
$c = $c -replace 'title="ðŸ. Route Details"', 'title="📍 Route Details"'
$c = $c -replace 'title="ðŸ«€ Organ Details"', 'title="🫀 Organ Details"'
$c = $c -replace 'title="ðŸš'' + "' + ' Ambulance Assignment"', 'title="🚑 Ambulance Assignment"'
$c = $c -replace 'title="ðŸ''¨.*Doctor In Charge"', 'title="👨‍⚕️ Doctor In Charge"'

[System.IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Fixed and saved as UTF-8."
