// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista de Linhas para cadastrar
const linhasDeOnibus = [
  { linha: '108', descricao: 'Carlos Bezerra' },
  { linha: '115', descricao: 'Paulista' },
  { linha: '203', descricao: 'Parque Universitário' },
  { linha: '209', descricao: 'Parque São Jorge' },
  { linha: '211', descricao: 'Atlântico / Cidade de Deus' },
  { linha: '212', descricao: 'Jardim Atlântico / Coophalis' },
  { linha: '214', descricao: 'Lucia Maggi' },
  { linha: '218', descricao: 'Alfredo de Castro' },
  { linha: '221', descricao: 'Padre Lothar' },
];

// --- GEOJSON DA LINHA 108 (Sintaxe Corrigida) ---
const linha108_GeoJson = {
  "type": "FeatureCollection",
  "features": [
    // Ponto A (Fim)
    { 
      "type": "Feature", "properties": {}, "geometry": { "coordinates": [-54.63716913904763, -16.420371782987687], "type": "Point" }, "id": 0 
    },
    // Traçado (Linha)
    { 
      "type": "Feature", 
      "properties": {}, 
      "geometry": {
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
        ], 
        "type": "LineString"
      }
    }, // <--- O ERRO ESTAVA AQUI (FALTAVA ESSA CHAVE)
    // Ponto B (Início)
    { 
      "type": "Feature", "properties": {}, "geometry": { "coordinates": [-54.63452700534914, -16.469381878789136], "type": "Point" } 
    }
  ]
};

// Funções Auxiliares
const invertCoordinates = (coords: number[]): [number, number] => [coords[1], coords[0]];
const invertCoordinateList = (coordsList: number[][]): [number, number][] => coordsList.map(coord => [coord[1], coord[0]]);
const reversePath = (coordsList: number[][]): [number, number][] => {
  const inverted = coordsList.map(coord => [coord[1], coord[0]] as [number, number]);
  return inverted.reverse();
};

// --- GRADE PADRÃO 1 (LINHAS 209, 218) ---
// Parque São Jorge e Alfredo de Castro (5:25 / 5:55)
const horariosPadraoParque = {
  bairroCentro: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30', '23:40'],
  centroBairro: ['05:55', '06:55', '08:05', '09:15', '10:25', '11:35', '12:45', '13:55', '15:05', '16:15', '17:25', '18:35', '19:45', '20:55', '22:05', '23:05']
};

async function main() {
  console.log('Iniciando o processo de seeding...');

  // Limpeza
  await prisma.routeShape.deleteMany({});
  await prisma.horario.deleteMany({});
  await prisma.linhas_recentes.deleteMany({});
  
  // Cadastrar Motorista Padrão (108)
  await prisma.systemBus.upsert({
    where: { login: '108' },
    update: { route_number: 108, role: 'DRIVER' },
    create: {
      name: '108 - Carlos Bezerra',
      login: '108',
      password: '108',
      route_number: 108,
      role: 'DRIVER',
    },
  });

  // Limpar Itinerários antigos
  const descricoes = linhasDeOnibus.map(l => l.descricao);
  await prisma.itinerarios.deleteMany({ where: { descricao: { notIn: descricoes } } });

  // Transação Principal
  await prisma.$transaction(async (tx) => {
    
    for (const linha of linhasDeOnibus) {
      const itinerario = await tx.itinerarios.upsert({
        where: { descricao: linha.descricao },
        update: { linha: linha.linha },
        create: { linha: linha.linha, descricao: linha.descricao },
      });

      console.log(`Processando Linha ${linha.linha}...`);

      // Limpa dados anteriores desta linha
      await tx.horario.deleteMany({ where: { itinerario_id: itinerario.id } });
      await tx.routeShape.deleteMany({ where: { itinerario_id: itinerario.id } });

      // ==========================================================
      // LINHA 108 - CARLOS BEZERRA
      // ==========================================================
      if (linha.linha === '108') {
        await tx.horario.createMany({
          data: [
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Dias Úteis', partidas: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30', '23:40'] },
            { itinerario_id: itinerario.id, sentido: 'CENTRO → BAIRRO', diaDaSemana: 'Dias Úteis', partidas: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'] },
          ],
        });

        // GeoJSON da 108
        const featureLine = linha108_GeoJson.features[1]; 
        const featureStart = linha108_GeoJson.features[2];
        const featureEnd = linha108_GeoJson.features[0];
        const lineString = featureLine.geometry.coordinates as number[][];
        const startPoint = featureStart.geometry.coordinates as number[];
        const endPoint = featureEnd.geometry.coordinates as number[];

        await tx.routeShape.create({
          data: {
            itinerario_id: itinerario.id,
            sentido: 'CENTRO → BAIRRO',
            coordinates: invertCoordinateList(lineString),
            startPoint: invertCoordinates(startPoint),
            endPoint: invertCoordinates(endPoint),
          }
        });

        await tx.routeShape.create({
          data: {
            itinerario_id: itinerario.id,
            sentido: 'BAIRRO → CENTRO',
            coordinates: reversePath(lineString),
            startPoint: invertCoordinates(endPoint),
            endPoint: invertCoordinates(startPoint),
          }
        });
      }

      // ==========================================================
      // LINHAS 209 e 218 (Mesma Grade)
      // ==========================================================
      else if (['209', '218'].includes(linha.linha)) {
        await tx.horario.createMany({
          data: [
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Dias Úteis', partidas: horariosPadraoParque.bairroCentro },
            { itinerario_id: itinerario.id, sentido: 'CENTRO → BAIRRO', diaDaSemana: 'Dias Úteis', partidas: horariosPadraoParque.centroBairro },
          ],
        });
      }

      // ==========================================================
      // LINHA 203 - PARQUE UNIVERSITÁRIO
      // ==========================================================
      else if (linha.linha === '203') {
        await tx.horario.createMany({
          data: [
            { 
              itinerario_id: itinerario.id, 
              sentido: 'BAIRRO → CENTRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['05:20', '06:40', '08:00', '09:20', '10:40', '12:00', '13:20', '14:40', '16:00', '17:20', '18:40', '20:00', '21:20'] 
            },
            { 
              itinerario_id: itinerario.id, 
              sentido: 'CENTRO → BAIRRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['06:00', '07:20', '08:40', '10:00', '11:20', '12:40', '14:00', '15:20', '16:40', '18:00', '19:20', '20:40', '22:00'] 
            },
          ],
        });
      }

      // ==========================================================
      // LINHA 212 - JARDIM ATLÂNTICO
      // ==========================================================
      else if (linha.linha === '212') {
        await tx.horario.createMany({
          data: [
            { 
              itinerario_id: itinerario.id, 
              sentido: 'BAIRRO → CENTRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['05:40', '07:00', '08:20', '09:40', '11:00', '12:20', '13:40', '15:00', '16:20', '17:40'] 
            },
            { 
              itinerario_id: itinerario.id, 
              sentido: 'CENTRO → BAIRRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['06:20', '07:40', '09:00', '10:20', '11:40', '13:00', '14:20', '15:40', '17:00', '18:20'] 
            },
          ],
        });
      }

      // ==========================================================
      // LINHA 214 - LUCIA MAGGI
      // ==========================================================
      else if (linha.linha === '214') {
        await tx.horario.createMany({
          data: [
            { 
              itinerario_id: itinerario.id, 
              sentido: 'BAIRRO → CENTRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['05:25', '06:45', '08:05', '10:40', '12:00', '13:20', '16:55'] 
            },
            { 
              itinerario_id: itinerario.id, 
              sentido: 'CENTRO → BAIRRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['06:05', '07:25', '08:45', '11:20', '12:40', '14:00', '17:35'] 
            },
          ],
        });
      }

      // ==========================================================
      // LINHA 221 - PADRE LOTHAR
      // ==========================================================
      else if (linha.linha === '221') {
        await tx.horario.createMany({
          data: [
            { 
              itinerario_id: itinerario.id, 
              sentido: 'BAIRRO → CENTRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['04:50', '06:05', '07:25', '08:45', '10:05', '11:25', '12:45'] 
            },
            { 
              itinerario_id: itinerario.id, 
              sentido: 'CENTRO → BAIRRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['05:30', '06:50', '08:10', '09:30', '10:50', '12:10', '13:30'] 
            },
          ],
        });
      }

      // ==========================================================
      // LINHA 211 - ATLÂNTICO
      // ==========================================================
      else if (linha.linha === '211') {
        await tx.horario.createMany({
          data: [
            { 
              itinerario_id: itinerario.id, 
              sentido: 'BAIRRO → CENTRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['06:00', '07:20', '08:00', '09:20', '11:20', '12:40', '14:00', '15:20', '16:40', '18:00', '19:20', '20:40', '22:10'] 
            },
            { 
              itinerario_id: itinerario.id, 
              sentido: 'CENTRO → BAIRRO', 
              diaDaSemana: 'Dias Úteis', 
              partidas: ['05:20', '06:40', '08:40', '10:00', '10:40', '12:00', '13:20', '14:40', '16:00', '17:20', '18:40', '20:00', '21:30', '22:50'] 
            },
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Domingo/Feriado', partidas: ['05:55', '06:55', '07:30', '08:40', '10:25', '11:35', '12:45', '13:20', '15:05'] }
          ],
        });
      }

      // ==========================================================
      // LINHA 115 - PAULISTA
      // ==========================================================
      else if (linha.linha === '115') {
        await tx.horario.createMany({
          data: [
            { itinerario_id: itinerario.id, sentido: 'BAIRRO → CENTRO', diaDaSemana: 'Dias Úteis', partidas: ['06:00', '07:40', '09:45', '10:15', '11:00', '13:00', '14:20'] },
            { itinerario_id: itinerario.id, sentido: 'CENTRO → BAIRRO', diaDaSemana: 'Dias Úteis', partidas: ['07:00', '08:20', '09:00', '10:15', '11:40', '12:20', '13:30', '15:00'] },
          ],
        });
      }

    } // Fim do loop for
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