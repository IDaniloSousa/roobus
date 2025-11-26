// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const linhasDeOnibus = [
  { linha: '101', descricao: 'Cidade Alta' },
  { linha: '102', descricao: 'Nossa Senhora do Amparo' },
  { linha: '103', descricao: 'Itapuã/Primavera via Assunção' },
  { linha: '104', descricao: 'Jardim das Flores via Luz D\'Yara' },
  { linha: '105', descricao: 'Vila Mineira' },
  { linha: '107', descricao: 'Vila Mineira via União' },
  { linha: '108', descricao: 'Carlos Bezerra' },
  { linha: '111', descricao: 'Marechal Rondon via Tropical' },
  { linha: '112', descricao: 'Buriti/via Goiânia' },
  { linha: '113', descricao: 'Marechal Rondon via Monte Líbano' },
  { linha: '114', descricao: 'Interbairros' },
  { linha: '115', descricao: 'Paulista' },
  { linha: '116', descricao: 'Globo Recreio' },
  { linha: '201', descricao: 'Vila Rica' },
  { linha: '202', descricao: 'Distrito Industrial I' },
  { linha: '203', descricao: 'Parque Universitário' },
  { linha: '204', descricao: 'Pedra Noventa' },
  { linha: '206', descricao: 'Ana Carla/Acacias' },
  { linha: '207', descricao: 'Verde Teto' },
  { linha: '208', descricao: 'Fazenda Guarita/Bela Vista' },
  { linha: '209', descricao: 'Parque São Jorge' },
  { linha: '211', descricao: 'Atlantico via Cidade de Deus' },
  { linha: '212', descricao: 'Atlantico via Coophalis' },
  { linha: '214', descricao: 'Lucia Maggi' },
  { linha: '216', descricao: 'Residencial Faria' },
  { linha: '218', descricao: 'Alfredo de Castro' },
  { linha: '221', descricao: 'Padre Lothar' },
];

// Seus dados COMPLETOS do GeoJSON (no formato [lng, lat])
const linha108CentroBairro_GeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature", "properties": {}, "geometry": {
        "coordinates": [-54.63716913904763, -16.420371782987687], "type": "Point"
      }, "id": 0
    },
    {
      "type": "Feature", "properties": {}, "geometry": {
        "coordinates": [
          [-54.63716803558313, -16.420369232417556], [-54.63737317595535, -16.420380266441285],
          [-54.63748820793998, -16.420450148574773], [-54.638312597434464, -16.41929341598744],
          [-54.63673890488799, -16.41821690521114], [-54.63574578921859, -16.41961265347709],
          [-54.6356658527377, -16.419570279642727], [-54.635170626226554, -16.427237678296194],
          [-54.638377924553, -16.427436326432954], [-54.63852354852874, -16.425190465848075],
          [-54.63852323907007, -16.425191348304594], [-54.63992685855459, -16.425269149784768],
          [-54.6395322306081, -16.43135914824127], [-54.64035933601669, -16.431417862520917],
          [-54.6401298346437, -16.434123582572354], [-54.639014070539446, -16.43405300447789],
          [-54.638861429324905, -16.436749187203517], [-54.63771860115848, -16.436691971555902],
          [-54.63742124142027, -16.43689310413683], [-54.63697763175554, -16.436871171770406],
          [-54.63688801653932, -16.439032569561675], [-54.63272466315851, -16.438832849896755],
          [-54.63253036072152, -16.440502422457925], [-54.6324187020829, -16.441686407125076],
          [-54.632409398076774, -16.442046360783394], [-54.63218918011289, -16.444051377587414],
          [-54.632179876184566, -16.444241763840836], [-54.63191287828083, -16.446553926960476],
          [-54.631843137834196, -16.447466941339997], [-54.631769910651855, -16.447858231500078],
          [-54.63175596242418, -16.448356540339176], [-54.632528002658006, -16.451736708126433],
          [-54.63266088927561, -16.452450404740233], [-54.632962098942, -16.4536738785405],
          [-54.633024112696475, -16.454090197727027], [-54.63304214063395, -16.45542771836118],
          [-54.63287282226901, -16.455513685892484], [-54.632143013075975, -16.456247347146586],
          [-54.63619029078508, -16.459959425933377], [-54.635623663983125, -16.46020642116609],
          [-54.63547648972684, -16.460396963554615], [-54.63542497873668, -16.46073570511402],
          [-54.63311331170736, -16.46317256417896], [-54.62918551287717, -16.46704250888085],
          [-54.6260672714194, -16.470184655653654], [-54.63005374338158, -16.473834050399134],
          [-54.63452986679417, -16.469381878789136]
        ], "type": "LineString"
      }
    },
    {
      "type": "Feature", "properties": {}, "geometry": {
        "coordinates": [-54.63452700534914, -16.469381878789136], "type": "Point"
      }
    }
  ]
};

// FUNÇÃO DE AJUDA PARA INVERTER COORDENADAS [lng, lat] para [lat, lng]
const invertCoordinates = (coords: number[]): [number, number] => {
  return [coords[1], coords[0]];
};

// FUNÇÃO DE AJUDA PARA INVERTER UMA LISTA DE COORDENADAS
const invertCoordinateList = (coordsList: number[][]): [number, number][] => {
  return coordsList.map(coord => [coord[1], coord[0]]);
};


async function main() {
  console.log('Iniciando o processo de seeding...');
  
  // Limpeza de Relações
  await prisma.routeShape.deleteMany({});
  await prisma.horario.deleteMany({});
  await prisma.linhas_recentes.deleteMany({});
  console.log('Relações (traçados, horários, recentes) limpas.');
  // NOVO: SEED DO USUÁRIO DO SISTEMA (MOTORISTA)
  const user = await prisma.systemBus.upsert({
    where: { login: '108' },
    update: {},
    create: {
      id: 1,
      name: '108 - Carlos Bezerra',
      login: '108',
      password: '108',
      route_number: 108,
    },
  });
  console.log(`Usuário criado/verificado: ${user.name}`);

  const descricoesLinhas = linhasDeOnibus.map(l => l.descricao);

  await prisma.itinerarios.deleteMany({
    where: {
      descricao: {
        notIn: descricoesLinhas
      }
    }
  });
  console.log('Itinerários antigos removidos.');

  // LÓGICA DE UPSERT
  await prisma.$transaction(async (tx) => {
    
    for (const linha of linhasDeOnibus) {
      
      const itinerario = await tx.itinerarios.upsert({
        where: { descricao: linha.descricao },
        update: { linha: linha.linha },
        create: {
          linha: linha.linha,
          descricao: linha.descricao,
        },
      });

      if (linha.linha === '108') {
        console.log(`Fazendo Upsert de horários e traçados para a linha ${linha.linha} (ID: ${itinerario.id})...`);
        
        await tx.horario.deleteMany({ where: { itinerario_id: itinerario.id } });
        await tx.routeShape.deleteMany({ where: { itinerario_id: itinerario.id } });

        await tx.horario.createMany({
          data: [
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Segunda a sábado', partidas: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30', '23:40'], },
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Domingo e feriado', partidas: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30'], },
          ],
        });

        // 👇 CORREÇÃO APLICADA AQUI: Pontos Invertidos
        
        // Ponto de INÍCIO (A) é o FIM do seu desenho (features[2])
        const startPointGeoJson = linha108CentroBairro_GeoJson.features[2].geometry.coordinates as number[];
        // A linha em si
        const lineStringGeoJson = linha108CentroBairro_GeoJson.features[1].geometry.coordinates as number[][];
        // Ponto de FIM (B) é o INÍCIO do seu desenho (features[0])
        const endPointGeoJson = linha108CentroBairro_GeoJson.features[0].geometry.coordinates as number[];

        await tx.routeShape.create({
          data: {
            itinerario_id: itinerario.id,
            sentido: 'CENTRO → BAIRRO',
            coordinates: invertCoordinateList(lineStringGeoJson),
            startPoint: invertCoordinates(startPointGeoJson), // Início (A)
            endPoint: invertCoordinates(endPointGeoJson),     // Fim (B)
          }
        });
      }
    }
  });

  console.log('Seeding finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });