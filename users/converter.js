const iat = 1726445247;
const exp = 1726448847;

const iatDate = new Date(iat * 1000).toLocaleDateString();
const expDate = new Date(exp * 1000).toLocaleDateString();

console.log(`Data de emissão (iat): ${iatDate} \n Data de expiração (exp): ${expDate}`); 