# solteq-energia
Solteq Utilities Academy preassignment


## Installing and running the project

After cloning install the packages (this will also install http-server for the client)

``` 
npm install 
```

To run the server and client

``` 
npm start
```

- The client should be now running at http://localhost:8080
- The server should now respond at http://localhost:3000

If you do not want to install http-server (if you already have something similar installed)
you can just install and run the server and serve the client ```\web\``` however you want.

``` 
 cd server
 npm install
 npm run start
```

## Kuvaile, miten muuttaisit toteutusta, jos
- päivämääräväliä halutaan muokata:
 - Sisällytin tämän ominaisuuden mukaan toteutukseen, eli käyttöliittymästä on mahdollista valita raportin aikaväli.
Backendissä on tätä varten oma endpoint, jossa käsitellään ko. aikavälin datan haku API:lta.
