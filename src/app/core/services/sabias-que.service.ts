import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SabiasQueService {
  public datosCuriosos: string[] = [
    "Las orquídeas pueden vivir más de 100 años en condiciones adecuadas.",
    "Algunas especies de orquídeas pueden atraer polinizadores con un aroma parecido a la vainilla.",
    "Las raíces de las orquídeas pueden absorber la humedad del aire.",
    "El nombre 'Phalaenopsis' significa 'parecido a una polilla' en griego.",
    "Las orquídeas se adaptan muy bien a la vida en interiores con la luz adecuada.",
    "Las orquídeas conforman la familia de plantas más grande del mundo (Orchidaceae), con 25,000-30,000 especies naturales.",
    "Existen más de 200,000 híbridos creados por el hombre.",
    "Se encuentran en todos los continentes excepto en la Antártida.",
    "La orquídea más pequeña (Platystele jungermannoides) tiene flores de 2 mm.",
    "La más grande (Grammatophyllum speciosum) puede pesar 2 toneladas y producir racimos de 3 metros.",
    "Los aztecas mezclaban orquídeas con chocolate para crear una bebida afrodisíaca.",
    "En la era victoriana, coleccionar orquídeas era símbolo de riqueza ('Orquidelirium')",
    "La vanilla planifolia es la única orquídea comestible de importancia comercial.",
    "En Singapur, la orquídea Vanda Miss Joaquim es la flor nacional desde 1893.",
    "Los chinos las llaman 'Lan Hua' (flor de la elegancia) y las asocian con la perfección.",
    "Algunas orquídeas imitan a insectos hembra para atraer polinizadores (ej: Ophrys apifera).",
    "La Coryanthes atrapa abejas en un 'balde' de líquido hasta que polinizan.",
    "Las semillas de orquídeas son tan pequeñas como partículas de polvo (1 semilla = 0.002 mg).",
    "Necesitan hongos simbióticos (micorrizas) para germinar en la naturaleza.",
    "Algunas especies (Dendrophylax lindenii) solo crecen en Cuba y Florida.",
    "Pueden vivir hasta 100 años en estado silvestre.",
    "La Orquídea Negra no es realmente negra, sino de un púrpura tan oscuro que parece negro.",
    "Algunas (Chiloglottis) generan calor para evaporar fragancias y atraer polinizadores.",
    "La Cattleya fue descubierta por accidente en 1818, usada como relleno en un envío de plantas.",
    "Las orquídeas zapatilla (Paphiopedilum) tienen un 'labio' en forma de bolsa para atrapar insectos.",
    "La Dendrophylax lindenii (orquídea fantasma) crece sin hojas, solo con raíces fotosintéticas.",
    "Algunas especies australianas (Rhizanthella) viven totalmente bajo tierra.",
    "La Dracula simia en Ecuador huele a naranja madura y parece un mono.",
    "En Borneo, la Bulbophyllum beccarii desprende olor a carne podrida.",
    "La Catasetum dispara polen como un proyectil cuando un insecto la toca.",
    "Producen el mayor número de semillas por cápsula (hasta 4 millones en Cycnoches).",
    "Algunas (Goodyera) son llamadas 'orquídeas joya' por sus hojas aterciopeladas con patrones metálicos.",
    "La Vanilla requiere polinización manual fuera de México (su hábitat natural).",
    "La Orchis italica parece tener 'figuras humanas' en su flor.",
    "Algunas orquídeas (Epipactis helleborine) pueden crecer en sitios contaminados con metales pesados.",
    "La Angraecum sesquipedale de Madagascar tiene un nectario de 30 cm. Darwin predijo su polinizador antes de ser descubierto.",
    "Las orquídeas Bucket (Coryanthes) obligan a las abejas a nadar en su líquido para polinizarlas.",
    "Algunas hormigas protegen orquídeas (Myrmecophila) a cambio de néctar y refugio.",
    "La Ophrys speculum imita el olor y apariencia de una avispa hembra para engañar a los machos.",
    "Los colibríes son los principales polinizadores de orquídeas rojas en América.",
    "Existen orquídeas naturales en todos los colores excepto negro puro y azul verdadero.",
    "La Laelia purpurata cambia de color según la acidez del suelo.",
    "Las orquídeas verde esmeralda (Dendrobium smillieae) son extremadamente raras en la naturaleza.",
    "La Psychopsis parece una mariposa en movimiento con el viento.",
    "Algunas orquídeas (Habenaria radiata) parecen garzas blancas en vuelo.",
    "El azafrán se obtiene de los estigmas de Crocus sativus (a menudo confundido con orquídea).",
    "Una sola planta de Paphiopedilum rothschildianum puede valer $5,000 USD.",
    "Singapur exporta $16 millones anuales en orquídeas cortadas.",
    "La vainilla natural (de orquídea) es el segundo condimento más caro después del azafrán.",
    "En el siglo XIX, cazadores de orquídeas arriesgaban sus vidas en junglas por especies raras.",
    "Las raíces de las Phalaenopsis son verdes porque realizan fotosíntesis.",
    "Regar en exceso mata más orquídeas que la sequía.",
    "Las flores de algunas orquídeas pueden durar hasta 6 meses (Phalaenopsis).",
    "Las orquídeas no crecen en tierra normal; necesitan corteza, musgo o materiales porosos.",
    "Las Cymbidium fueron las primeras orquídeas cultivadas en China (500 a.C.)."
  ];

  getDatoCurioso(): string {
    const indice = Math.floor(Math.random() * this.datosCuriosos.length);
    return this.datosCuriosos[indice];
  }
}