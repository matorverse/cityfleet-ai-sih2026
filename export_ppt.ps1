param(
    [string]$pptxPath = "c:\Projects\Projects\SIH\SIH2026_CityFleet_Submission.pptx",
    [string]$outputDir = "c:\Projects\Projects\SIH\slide_previews",
    [string]$pdfPath = "c:\Projects\Projects\SIH\SIH2026_CityFleet_Submission.pdf"
)

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$pptApp = New-Object -ComObject PowerPoint.Application

try {
    # Open presentation (WithWindow = msoFalse)
    $presentation = $pptApp.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    # Save as PDF (fixed format 32 = ppSaveAsPDF)
    $presentation.SaveAs($pdfPath, 32)
    Write-Host "Exported PDF to: $pdfPath"
    
    # Export each slide as PNG
    $slideIndex = 1
    foreach ($slide in $presentation.Slides) {
        $pngPath = Join-Path $outputDir "slide_$slideIndex.png"
        $slide.Export($pngPath, "PNG", 1920, 1080)
        Write-Host "Exported Slide $slideIndex to: $pngPath"
        $slideIndex++
    }
    
    $presentation.Close()
}
finally {
    $pptApp.Quit()
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
