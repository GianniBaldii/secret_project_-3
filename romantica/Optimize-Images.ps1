# Derivados livianos para la web; conserva todos los originales.
Add-Type -AssemblyName System.Drawing
$assets = Join-Path $PSScriptRoot 'dist/assets'
$jobs = @(
    @{Source='hero-v3.png'; Target='hero-v3-mobile.jpg'; Width=640},
    @{Source='hero-v3.png'; Target='hero-v3-desktop.jpg'; Width=1100},
    @{Source='flores.jpg'; Target='flores-mobile.jpg'; Width=720},
    @{Source='abrazo.jpg'; Target='abrazo-mobile.jpg'; Width=720}
)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
foreach ($job in $jobs) {
    $source = [System.Drawing.Image]::FromFile((Join-Path $assets $job.Source))
    # Las fotos del teléfono pueden guardar la orientación en EXIF.
    if ($source.PropertyIdList -contains 274) {
        $orientation = [BitConverter]::ToUInt16($source.GetPropertyItem(274).Value, 0)
        switch ($orientation) {
            2 { $source.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
            3 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            4 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
            5 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
            6 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            7 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
            8 { $source.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
        }
    }
    $height = [int][Math]::Round($source.Height * $job.Width / $source.Width)
    $bitmap = [System.Drawing.Bitmap]::new($job.Width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($source, 0, 0, $job.Width, $height)
    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]85)
    $bitmap.Save((Join-Path $assets $job.Target), $codec, $parameters)
    $parameters.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
    $source.Dispose()
}
