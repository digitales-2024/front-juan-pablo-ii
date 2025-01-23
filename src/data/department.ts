interface State {
    id: number;
    name: string;
    state_code: string;
    cities: City[];
}

interface City {
    id: number;
    name: string;
}

export const departments: State[] = [
    {
        id: 0,
        name: "Amazonas",
        state_code: "Ama",
        cities: [
            {
                id: 1,
                name: "Chachapoyas",
            },
            {
                id: 2,
                name: "Bagua",
            },
            {
                id: 3,
                name: "Bongara",
            },
            {
                id: 4,
                name: "Condorcanqui",
            },
            {
                id: 5,
                name: "Luya",
            },
            {
                id: 6,
                name: "Rodriguez De Mendoza",
            },
            {
                id: 7,
                name: "Utcubamba",
            },
        ],
    },
    {
        id: 8,
        name: "Áncash",
        state_code: "Ánc",
        cities: [
            {
                id: 9,
                name: "Huaraz",
            },
            {
                id: 10,
                name: "Aija",
            },
            {
                id: 11,
                name: "Antonio Raymondi",
            },
            {
                id: 12,
                name: "Asunción",
            },
            {
                id: 13,
                name: "Bolognesi",
            },
            {
                id: 14,
                name: "Carhuaz",
            },
            {
                id: 15,
                name: "Carlos F. Fitzcarrald",
            },
            {
                id: 16,
                name: "Casma",
            },
            {
                id: 17,
                name: "Corongo",
            },
            {
                id: 18,
                name: "Huari",
            },
            {
                id: 19,
                name: "Huarmey",
            },
            {
                id: 20,
                name: "Huaylas",
            },
            {
                id: 21,
                name: "Mariscal Luzuriaga",
            },
            {
                id: 22,
                name: "Ocros",
            },
            {
                id: 23,
                name: "Pallasca",
            },
            {
                id: 24,
                name: "Pomabamba",
            },
            {
                id: 25,
                name: "Recuay",
            },
            {
                id: 26,
                name: "Santa",
            },
            {
                id: 27,
                name: "Sihuas",
            },
            {
                id: 28,
                name: "Yungay",
            },
        ],
    },
    {
        id: 29,
        name: "Apurímac",
        state_code: "Apu",
        cities: [
            {
                id: 30,
                name: "Abancay",
            },
            {
                id: 31,
                name: "Andahuaylas",
            },
            {
                id: 32,
                name: "Antabamba",
            },
            {
                id: 33,
                name: "Aymaraes",
            },
            {
                id: 34,
                name: "Cotabambas",
            },
            {
                id: 35,
                name: "Chincheros",
            },
            {
                id: 36,
                name: "Grau",
            },
        ],
    },
    {
        id: 37,
        name: "Arequipa",
        state_code: "Are",
        cities: [
            {
                id: 38,
                name: "Arequipa",
            },
            {
                id: 39,
                name: "Camana",
            },
            {
                id: 40,
                name: "Caraveli",
            },
            {
                id: 41,
                name: "Castilla",
            },
            {
                id: 42,
                name: "Caylloma",
            },
            {
                id: 43,
                name: "Condesuyos",
            },
            {
                id: 44,
                name: "Islay",
            },
            {
                id: 45,
                name: "La Unión",
            },
        ],
    },
    {
        id: 46,
        name: "Ayacucho",
        state_code: "Aya",
        cities: [
            {
                id: 47,
                name: "Huamanga",
            },
            {
                id: 48,
                name: "Cangallo",
            },
            {
                id: 49,
                name: "Huanca Sancos",
            },
            {
                id: 50,
                name: "Huanta",
            },
            {
                id: 51,
                name: "La Mar",
            },
            {
                id: 52,
                name: "Lucanas",
            },
            {
                id: 53,
                name: "Parinacochas",
            },
            {
                id: 54,
                name: "Paucar Del Sara Sara",
            },
            {
                id: 55,
                name: "Sucre",
            },
            {
                id: 56,
                name: "Victor Fajardo",
            },
            {
                id: 57,
                name: "Vilcas Huaman",
            },
        ],
    },
    {
        id: 58,
        name: "Cajamarca",
        state_code: "Caj",
        cities: [
            {
                id: 59,
                name: "Cajamarca",
            },
            {
                id: 60,
                name: "Cajabamba",
            },
            {
                id: 61,
                name: "Celendin",
            },
            {
                id: 62,
                name: "Chota",
            },
            {
                id: 63,
                name: "Contumaza",
            },
            {
                id: 64,
                name: "Cutervo",
            },
            {
                id: 65,
                name: "Hualgayoc",
            },
            {
                id: 66,
                name: "Jaen",
            },
            {
                id: 67,
                name: "San Ignacio",
            },
            {
                id: 68,
                name: "San Marcos",
            },
            {
                id: 69,
                name: "San Miguel",
            },
            {
                id: 70,
                name: "San Pablo",
            },
            {
                id: 71,
                name: "Santa Cruz",
            },
        ],
    },
    {
        id: 72,
        name: "Callao",
        state_code: "Cal",
        cities: [
            {
                id: 73,
                name: "Callao",
            },
        ],
    },
    {
        id: 74,
        name: "Cusco",
        state_code: "Cus",
        cities: [
            {
                id: 75,
                name: "Cusco",
            },
            {
                id: 76,
                name: "Acomayo",
            },
            {
                id: 77,
                name: "Anta",
            },
            {
                id: 78,
                name: "Calca",
            },
            {
                id: 79,
                name: "Canas",
            },
            {
                id: 80,
                name: "Canchis",
            },
            {
                id: 81,
                name: "Chumbivilcas",
            },
            {
                id: 82,
                name: "Espinar",
            },
            {
                id: 83,
                name: "La Convención",
            },
            {
                id: 84,
                name: "Paruro",
            },
            {
                id: 85,
                name: "Paucartambo",
            },
            {
                id: 86,
                name: "Quispicanchi",
            },
            {
                id: 87,
                name: "Urubamba",
            },
        ],
    },
    {
        id: 88,
        name: "Huancavelica",
        state_code: "Hua",
        cities: [
            {
                id: 89,
                name: "Huancavelica",
            },
            {
                id: 90,
                name: "Acobamba",
            },
            {
                id: 91,
                name: "Angaraes",
            },
            {
                id: 92,
                name: "Castrovirreyna",
            },
            {
                id: 93,
                name: "Churcampa",
            },
            {
                id: 94,
                name: "Huaytara",
            },
            {
                id: 95,
                name: "Tayacaja",
            },
        ],
    },
    {
        id: 96,
        name: "Huánuco",
        state_code: "Huá",
        cities: [
            {
                id: 97,
                name: "Huánuco",
            },
            {
                id: 98,
                name: "Ambo",
            },
            {
                id: 99,
                name: "Dos De Mayo",
            },
            {
                id: 100,
                name: "Huacaybamba",
            },
            {
                id: 101,
                name: "Huamalies",
            },
            {
                id: 102,
                name: "Leoncio Prado",
            },
            {
                id: 103,
                name: "Marañón",
            },
            {
                id: 104,
                name: "Pachitea",
            },
            {
                id: 105,
                name: "Puerto Inca",
            },
            {
                id: 106,
                name: "Lauricocha",
            },
            {
                id: 107,
                name: "Yarowilca",
            },
        ],
    },
    {
        id: 108,
        name: "Ica",
        state_code: "Ica",
        cities: [
            {
                id: 109,
                name: "Ica",
            },
            {
                id: 110,
                name: "Chincha",
            },
            {
                id: 111,
                name: "Nasca",
            },
            {
                id: 112,
                name: "Palpa",
            },
            {
                id: 113,
                name: "Pisco",
            },
        ],
    },
    {
        id: 114,
        name: "Junín",
        state_code: "Jun",
        cities: [
            {
                id: 115,
                name: "Huancayo",
            },
            {
                id: 116,
                name: "Concepción",
            },
            {
                id: 117,
                name: "Chanchamayo",
            },
            {
                id: 118,
                name: "Jauja",
            },
            {
                id: 119,
                name: "Junín",
            },
            {
                id: 120,
                name: "Satipo",
            },
            {
                id: 121,
                name: "Tarma",
            },
            {
                id: 122,
                name: "Yauli",
            },
            {
                id: 123,
                name: "Chupaca",
            },
        ],
    },
    {
        id: 124,
        name: "La Libertad",
        state_code: "La ",
        cities: [
            {
                id: 125,
                name: "Trujillo",
            },
            {
                id: 126,
                name: "Ascope",
            },
            {
                id: 127,
                name: "Bolivar",
            },
            {
                id: 128,
                name: "Chepen",
            },
            {
                id: 129,
                name: "Julcan",
            },
            {
                id: 130,
                name: "Otuzco",
            },
            {
                id: 131,
                name: "Pacasmayo",
            },
            {
                id: 132,
                name: "Pataz",
            },
            {
                id: 133,
                name: "Sanchez Carrion",
            },
            {
                id: 134,
                name: "Santiago De Chuco",
            },
            {
                id: 135,
                name: "Gran Chimu",
            },
            {
                id: 136,
                name: "Viru",
            },
        ],
    },
    {
        id: 137,
        name: "Lambayeque",
        state_code: "Lam",
        cities: [
            {
                id: 138,
                name: "Chiclayo",
            },
            {
                id: 139,
                name: "Ferreñafe",
            },
            {
                id: 140,
                name: "Lambayeque",
            },
        ],
    },
    {
        id: 141,
        name: "Lima",
        state_code: "Lim",
        cities: [
            {
                id: 142,
                name: "Lima",
            },
            {
                id: 143,
                name: "Barranca",
            },
            {
                id: 144,
                name: "Cajatambo",
            },
            {
                id: 145,
                name: "Canta",
            },
            {
                id: 146,
                name: "Cañete",
            },
            {
                id: 147,
                name: "Huaral",
            },
            {
                id: 148,
                name: "Huarochiri",
            },
            {
                id: 149,
                name: "Huaura",
            },
            {
                id: 150,
                name: "Oyon",
            },
            {
                id: 151,
                name: "Yauyos",
            },
        ],
    },
    {
        id: 152,
        name: "Loreto",
        state_code: "Lor",
        cities: [
            {
                id: 153,
                name: "Maynas",
            },
            {
                id: 154,
                name: "Alto Amazonas",
            },
            {
                id: 155,
                name: "Loreto",
            },
            {
                id: 156,
                name: "Mariscal Ramon Castilla",
            },
            {
                id: 157,
                name: "Requena",
            },
            {
                id: 158,
                name: "Ucayali",
            },
            {
                id: 159,
                name: "Datem Del Marañon",
            },
            {
                id: 160,
                name: "Putumayo",
            },
        ],
    },
    {
        id: 161,
        name: "Madre De Dios",
        state_code: "Mad",
        cities: [
            {
                id: 162,
                name: "Tambopata",
            },
            {
                id: 163,
                name: "Manu",
            },
            {
                id: 164,
                name: "Tahuamanu",
            },
        ],
    },
    {
        id: 165,
        name: "Moquegua",
        state_code: "Moq",
        cities: [
            {
                id: 166,
                name: "Mariscal Nieto",
            },
            {
                id: 167,
                name: "General Sanchez Cerro",
            },
            {
                id: 168,
                name: "Ilo",
            },
        ],
    },
    {
        id: 169,
        name: "Pasco",
        state_code: "Pas",
        cities: [
            {
                id: 170,
                name: "Pasco",
            },
            {
                id: 171,
                name: "Daniel Alcides Carrión",
            },
            {
                id: 172,
                name: "Oxapampa",
            },
        ],
    },
    {
        id: 173,
        name: "Piura",
        state_code: "Piu",
        cities: [
            {
                id: 174,
                name: "Piura",
            },
            {
                id: 175,
                name: "Ayabaca",
            },
            {
                id: 176,
                name: "Huancabamba",
            },
            {
                id: 177,
                name: "Morropon",
            },
            {
                id: 178,
                name: "Paita",
            },
            {
                id: 179,
                name: "Sullana",
            },
            {
                id: 180,
                name: "Talara",
            },
            {
                id: 181,
                name: "Sechura",
            },
        ],
    },
    {
        id: 182,
        name: "Puno",
        state_code: "Pun",
        cities: [
            {
                id: 183,
                name: "Puno",
            },
            {
                id: 184,
                name: "Azangaro",
            },
            {
                id: 185,
                name: "Carabaya",
            },
            {
                id: 186,
                name: "Chucuito",
            },
            {
                id: 187,
                name: "El Collao",
            },
            {
                id: 188,
                name: "Huancane",
            },
            {
                id: 189,
                name: "Lampa",
            },
            {
                id: 190,
                name: "Melgar",
            },
            {
                id: 191,
                name: "Moho",
            },
            {
                id: 192,
                name: "San Antonio De Putina",
            },
            {
                id: 193,
                name: "San Roman",
            },
            {
                id: 194,
                name: "Sandia",
            },
            {
                id: 195,
                name: "Yunguyo",
            },
        ],
    },
    {
        id: 196,
        name: "San Martín",
        state_code: "San",
        cities: [
            {
                id: 197,
                name: "Moyobamba",
            },
            {
                id: 198,
                name: "Bellavista",
            },
            {
                id: 199,
                name: "El Dorado",
            },
            {
                id: 200,
                name: "Huallaga",
            },
            {
                id: 201,
                name: "Lamas",
            },
            {
                id: 202,
                name: "Mariscal Caceres",
            },
            {
                id: 203,
                name: "Picota",
            },
            {
                id: 204,
                name: "Rioja",
            },
            {
                id: 205,
                name: "San Martin",
            },
            {
                id: 206,
                name: "Tocache",
            },
        ],
    },
    {
        id: 207,
        name: "Tacna",
        state_code: "Tac",
        cities: [
            {
                id: 208,
                name: "Tacna",
            },
            {
                id: 209,
                name: "Candarave",
            },
            {
                id: 210,
                name: "Jorge Basadre",
            },
            {
                id: 211,
                name: "Tarata",
            },
        ],
    },
    {
        id: 212,
        name: "Tumbes",
        state_code: "Tum",
        cities: [
            {
                id: 213,
                name: "Tumbes",
            },
            {
                id: 214,
                name: "Contralmirante Villar",
            },
            {
                id: 215,
                name: "Zarumilla",
            },
        ],
    },
];
