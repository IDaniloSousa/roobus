// src/app/perguntas-frequentes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  CaretDown,
  ThumbsUp,
  ThumbsDown,
  PaperPlaneTilt,
} from '@phosphor-icons/react';
import Header from '@/components/Header'; // Importando nosso Header reutilizável

// Dados das perguntas e respostas (mantidos como antes)
const faqData = [
  {
    question: 'Como posso encontrar a rota de ônibus mais rápida?',
    answer: 'Utilize a função "Buscar Rota" na tela de Busca. Insira seu ponto de partida e destino, e nosso algoritmo calculará a melhor opção, considerando o trânsito em tempo real e os horários programados.',
  },
  {
    question: 'O aplicativo mostra o horário real dos ônibus?',
    answer: 'Sim, para linhas equipadas com GPS, exibimos a localização e a estimativa de chegada em tempo real. Para as demais, mostramos o horário programado.',
  },
  {
    question: 'Posso salvar minhas rotas favoritas no aplicativo?',
    answer: 'Atualmente, esta funcionalidade está em desenvolvimento. Em breve, você poderá salvar suas rotas e linhas mais utilizadas para acesso rápido na tela inicial.',
  },
  {
    question: 'Como posso saber se houve mudanças nas rotas ou horários?',
    answer: 'Recomendamos ativar as notificações do aplicativo. Enviaremos alertas sobre mudanças significativas nas linhas que você mais utiliza. Todas as informações no app são sempre as mais recentes fornecidas pelas operadoras.',
  },
  {
    question: 'O aplicativo é gratuito?',
    answer: 'Sim, o download e o uso de todas as funcionalidades de busca e acompanhamento de rotas são totalmente gratuitos. O aplicativo é mantido por meio de parcerias e publicidade não invasiva.',
  },
  {
    question: 'Posso pagar minha passagem de ônibus pelo aplicativo?',
    answer: 'A funcionalidade de compra de passagens e recarga de bilhete único está disponível em cidades parceiras. Verifique na seção "Carteira" do menu se sua cidade já é compatível.',
  },
  {
    question: 'O que faço se o meu ônibus não aparecer na hora prevista?',
    answer: 'Atrasos podem ocorrer devido a trânsito ou outros imprevistos. Se o ônibus estiver com GPS, você pode acompanhar sua localização real no mapa. Caso contrário, recomendamos aguardar alguns minutos adicionais ou planejar uma rota alternativa.',
  },
  {
    question: 'Preciso de internet para usar o aplicativo?',
    answer: 'Sim, uma conexão com a internet é necessária para buscar rotas, ver horários e acompanhar a localização dos ônibus em tempo real, pois os dados são constantemente atualizados.',
  },
];

// Componente FaqItem (mantido exatamente como antes, com o texto justificado)
function FaqItem({ item, isOpen, onToggle }: { item: typeof faqData[0]; isOpen: boolean; onToggle: () => void; }) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
        <span className="font-medium text-gray-800">{item.question}</span>
        <CaretDown size={20} className={`transform text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4 pt-0">
          <p className="text-gray-600 mb-4 text-justify">{item.answer}</p>
          {!feedbackSent ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">Isso foi útil?</p>
              <button onClick={() => setFeedbackSent(true)} className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-green-50 hover:border-green-400">
                <ThumbsUp size={16} /> Sim
              </button>
              <button onClick={() => setFeedbackSent(true)} className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-red-50 hover:border-red-400">
                <ThumbsDown size={16} /> Não
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-green-600">Obrigado pelo feedback!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PerguntasFrequentesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loadEnviarDuvida, setLoadEnviarDuvida] = useState<Boolean>(false);

  // useEffect(() => {
  //   postDuvidas
  // }, [newQuestion])

  const postDuvidas = async (duvida: string) => {
    setLoadEnviarDuvida(true)
    try {
      const response = await fetch('http://localhost:3000/api/duvidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(duvida)
      })
    } catch {
      alert(`Ops! houve algum erro`);
    }
    setLoadEnviarDuvida(false)
  };

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '') return;
    postDuvidas(newQuestion)
    //alert(`Pergunta enviada para análise:\n"${newQuestion}"`);
    setNewQuestion('');
  };

  return (
    <div>
      {/* MUDANÇA: Substituímos o <header> estático pelo nosso componente Header dinâmico */}
      <Header title="Perguntas Frequentes" showBackButton={true} />

      <main className="p-4 bg-gray-50">
        {/* Lista de Perguntas */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Formulário para Nova Pergunta */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Não encontrou sua dúvida?</h2>
          <p className="text-sm text-gray-600 mb-4">Envie sua pergunta para nossa equipe. As mais relevantes serão adicionadas aqui.</p>
          <form onSubmit={handleQuestionSubmit} className="flex items-start gap-2">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              // MUDANÇA APLICADA AQUI
              disabled={loadEnviarDuvida == true}
              className="flex-grow resize-none border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <button
              type="submit"
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-300"
              disabled={!newQuestion.trim() || loadEnviarDuvida == true}
              aria-label="Enviar pergunta"
            >
              <PaperPlaneTilt size={24} weight="fill" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
