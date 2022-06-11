# Kurulum
<!-- ## Masaüstü -->
<!-- ### Masaüstü -->
<!-- #### Masaüstü -->
<!-- ##### Masaüstü -->
- Masaüstünde ChainBazaar adlı bir klasör oluşturuldu.
- Bu dizin VS Code ile açıldı.
- npm projesi oluşturmak için aşağıdaki komut çalıştırıldı:
- ```npm init -y```
- tailwindcss kurmak için aşağıdaki komut çalıştırıldı:
- ```npm install -D tailwindcss```
- Tam tailwindcss config dosyasını oluşturmak için aşağıdaki komut çalıştırıldı:
- ```npx tailwindcss init --full```
- ```tailwind.config.js``` dosyası, ```tailwind.config.full.js``` olarak değiştirildi.
- Normal tailwindcss config dosyasını oluşturmak için aşağıdaki komut çalıştırıldı:
- ```npx tailwindcss init```
- ```tailwind.config.js``` dosyası aşağıdaki gibi değiştirildi:
```js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- Projenin ana dizininde ```src``` adlı yeni bir klasör oluşturuldu.
- ```src``` içeridinde ```input.css``` adlı yeni bir dosya oluşturuldu.
- ```input.css``` dosyasına aşağıdaki kodlar eklendi:

<!-- https://github.com/github/linguist -->
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- tailwindcss inşa etmek (build) için aşağıdaki komut çalıştırıldı:
- ```npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch```
- ```src``` içeridinde ```index.html``` adlı yeni bir dosya oluşturuldu.
- ```index.html``` dosyasına aşağıdaki kodlar eklendi:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/dist/output.css" rel="stylesheet">
    <title>Document</title>
</head>

<body>
    <h1 class="text-3xl font-bold underline">
        Hello world!
    </h1>
</body>

</html>
```

- ```Ritwick Dey``` tarafından geliştirilen ```Live Server``` adlı eklenti VS Code'a kuruldu.
- ```index.html``` dosyası içerisinde iken sağ tıklayıp açılan menüden ```Open with Live Server``` seçeneği seçildi.