function ucitajSliku(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Vraća Base64 JPEG izrezanog dijela, smanjen na max 1200 px
export async function izrezi(src, pixelCrop, rotation = 0, maxDim = 1200) {
    const img = await ucitajSliku(src);
    const rad = (rotation * Math.PI) / 180;

    const bW = Math.abs(Math.cos(rad) * img.width) + Math.abs(Math.sin(rad) * img.height);
    const bH = Math.abs(Math.sin(rad) * img.width) + Math.abs(Math.cos(rad) * img.height);

    // 1. nacrtaj rotiranu sliku
    const canvas = document.createElement("canvas");
    canvas.width = bW;
    canvas.height = bH;
    const ctx = canvas.getContext("2d");
    ctx.translate(bW / 2, bH / 2);
    ctx.rotate(rad);
    ctx.translate(-img.width / 2, -img.height / 2);
    ctx.drawImage(img, 0, 0);

    // 2. izreži i smanji
    const scale = Math.min(1, maxDim / Math.max(pixelCrop.width, pixelCrop.height));
    const out = document.createElement("canvas");
    out.width = Math.round(pixelCrop.width * scale);
    out.height = Math.round(pixelCrop.height * scale);
    const octx = out.getContext("2d");
    octx.fillStyle = "#fff"; // bijela pozadina umjesto crne kod PNG prozirnosti
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(
        canvas,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, out.width, out.height
    );

    return out.toDataURL("image/jpeg", 0.85);
}