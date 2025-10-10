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

async function main() {
  console.log('Iniciando o processo de seeding...');

  // Limpa as tabelas na ordem correta para evitar erros de chave estrangeira
  await prisma.horario.deleteMany({});
  await prisma.itinerarios.deleteMany({});
  console.log('Tabelas de horários e itinerários limpas.');

  await prisma.$transaction(async (tx) => {
    for (const linha of linhasDeOnibus) {
      const itinerario = await tx.itinerarios.create({
        data: {
          linha: linha.linha,
          descricao: linha.descricao,
        },
      });

      // Se o itinerário for a Linha 108, insere os horários específicos
      if (linha.linha === '108') {
        console.log(`Inserindo horários para a linha ${linha.linha}...`);
        await tx.horario.createMany({
          data: [
            {
              itinerario_id: itinerario.id,
              sentido: 'BAIRRO → CENTRO',
              diaDaSemana: 'Segunda a sábado',
              partidas: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30', '23:40'],
            },
            {
              itinerario_id: itinerario.id,
              sentido: 'BAIRRO → CENTRO',
              diaDaSemana: 'Domingo e feriado',
              partidas: ['05:25', '06:25', '07:30', '08:40', '09:50', '11:00', '12:10', '13:20', '14:30', '15:40', '16:50', '18:00', '19:10', '20:20', '21:30', '22:30'],
            },
            // ↓↓↓ AQUI É ONDE ENTRARIAM OS NOVOS DADOS de Centro para Bairro↓↓↓
            // {
            //   itinerario_id: itinerario.id,
            //   sentido: 'CENTRO → BAIRRO',
            //   diaDaSemana: 'Segunda a sábado',
            //   partidas: ['06:00', '07:00', '...'], // Horários a serem pesquisados
            // },
          ],
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
