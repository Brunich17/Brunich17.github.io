const botones = document.querySelectorAll(".card button");

botones.forEach(boton => {
  boton.addEventListener("click", () => {
    window.open("https://wa.me/51901109032?text=Hola,%20quiero%20consultar%20sobre%20un%20producto", "_blank");
  });
});