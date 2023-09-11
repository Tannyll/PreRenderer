[Haro everynyan. How ar yu? Fain, sankyu](https://www.youtube.com/watch?v=nlLhw1mtCFA)

Bu projenin amacı Nuxt, Next kullanamdan (SSR Engine), JS render enginelerinizi render alıp googleye iletmek için vardır. Bu sayede SSR kullanmaktan kurtulursunuz ve boşu boşuna uğraşmazsınız babba.

Çalışma algoritması şu şekildedir.
```
Request => NGINX (BOT+)=> proxy ${prerenderURL}/${appURL}/${requestThings}
           NGINX (BOT-)=> proxy $appURL
           NGINX (FILE+)=> proxy $appURL
```

Referanslar;</br>
https://prerender.io </br>
https://dashboard.prerender.io/integration
