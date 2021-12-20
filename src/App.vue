<template>
    <header>
      <h1>FOTOFOTO</h1>
    </header>

    <body>
      <p><button id="GetStreamButton">Enable Camera Access</button></p>
      <p><video id="video" autoplay></video></p>
      <p><button id="TakePhotoButton">Take FOTO</button></p>
      <p><img id="imageTag"></p>
      <p><button id="ShareButton">Share FOTO</button></p>
      <p><button id="DownloadButton">Download</button></p>
      <p><button id="addBtn">Home App FOTOFOTO</button></p>
    </body>
</template>


<style>
img{
    max-width: 100%;
}

*{
    box-sizing: border-box;
}


html{
    display: flex;
    background-color: #48586f;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: 'Lato','Open Sans',sans-serif;
    font-size: 100%;
    padding-left: 10%;
    padding-right: 10%;
}

header{
    font-size: 200%;
    font-family: 'Staatliches',sans-serif;
}


body{
    display: flex;
    flex-direction: column;
    align-items: center;
}

video{
    width: 50vw;
    height: 50vh;
}

div{
    display: flex;
    flex-direction: column;
    align-items: center;
}

button{
    margin-top:2%;
    padding:1% ;
    font-family: 'Staatliches',sans-serif;
    font-size: 150%;
    height: 50%;
    width: auto;
    color:#ffffc0;
    transition-duration: 0.4s;
    background-color: #d62e2e;
    text-decoration: none;
    border-radius: 5%;
}
</style>
