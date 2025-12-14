'use client';

import { useEffect, useState } from 'react';
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  PaperPlaneTilt,
  WarningIcon,
} from '@phosphor-icons/react';
import Header from '@/components/Header';
import { BiChevronDown } from 'react-icons/bi';

interface Resposta {
  id: number
  duvida_id: number
  mensagem: string
  createdAt: string
  updatedAt: string
}

interface FAQ {
  id: number
  mensagem: string
  createdAt: string
  respostas: Resposta[]
}

interface FaqItemProps {
  faq: FAQ
}

function FaqItem({ faq }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    setFeedback(type)
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-2 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <h3 className="text-xs text-gray-900 text-pretty">{faq.mensagem}</h3>
        <BiChevronDown
          // 👇 CORREÇÃO TAILWIND: flex-shrink-0 -> shrink-0
          className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {faq.respostas.map((resposta) => (
            <div key={resposta.id} className="space-y-4">
              <p className="text-gray-900 leading-relaxed text-sm">{resposta.mensagem}</p>

              <div className="flex items-center gap-3 pt-2">
                <div className="grid grid-cols-2 gap-2 justify-items-center w-full">
                  {!feedback && <span className="text-sm text-gray-600 col-span-2">Isso foi útil?</span>}
                  <button
                    onClick={() => handleFeedback("helpful")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm transition-colors ${feedback === "helpful" ? "bg-gray-600/50 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    disabled={feedback !== null}
                  >
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span>Sim</span>
                  </button>
                  <button
                    onClick={() => handleFeedback("not-helpful")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm transition-colors ${feedback === "not-helpful"
                      ? "bg-gray-600/50 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    disabled={feedback !== null}
                  >
                    <ThumbsDownIcon className="w-4 h-4" />
                    <span>Não</span>
                  </button>
                  {feedback && <span className="text-sm text-gray-600 ml-2 col-span-2">Obrigado pelo feedback! 😊</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FaqSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden animate-pulse my-2">
      <div className="w-full px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
        {/* 👇 CORREÇÃO TAILWIND: flex-shrink-0 -> shrink-0 */}
        <div className="w-5 h-5 bg-gray-200 rounded ml-4 shrink-0"></div>
      </div>
    </div>
  )
}

function FaqSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <FaqSkeleton key={index} />
      ))}
    </>
  )
}

export default function PerguntasFrequentesPage() {
  const [newQuestion, setNewQuestion] = useState('');
  const [loadEnviarDuvida, setLoadEnviarDuvida] = useState<boolean>(false); // Use boolean minúsculo
  const [loadDuvidas, setLoadDuvidas] = useState<boolean>(true); // Use boolean minúsculo
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [duvidas, setDuvidas] = useState<any>([]);

  useEffect(() => {
    getDuvidas();
  }, []);

  const getDuvidas = async () => {
    setLoadDuvidas(true)
    try {
      // API Corrigida (Caminho relativo)
      const res = await fetch('/api/duvidas');
      const data = await res.json();
      setDuvidas(data);
    } catch (e) {
      console.error(e)
    } finally {
      setLoadDuvidas(false)
    }
  };


  const postDuvidas = async (duvida: string) => {
    setLoadEnviarDuvida(true)

    // API Corrigida (Caminho relativo)
    const req = await fetch('/api/duvidas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(duvida)
    })

    if (req.ok) {
      setErrorMsg('')
      getDuvidas();
    } else {
      if (req.status == 429) {
        setErrorMsg('Muitas tentativas, tente amanhã.')
      }
      if (req.status == 400) {
        setErrorMsg('Esse tipo de mensagem não é permitida!')
      }
    }

    setLoadEnviarDuvida(false)
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '') return;
    postDuvidas(newQuestion)
    setNewQuestion('');
  };

  return (
    <div>
      <Header title="Perguntas Frequentes" showBackButton={true} />
      <main className="p-2 h-screen bg-gray-50">
        <div className="py-2">
          <header className="mb-2 text-center">
            <p className="text-gray-600 text-xs">Encontre respostas para as dúvidas mais comuns sobre o aplicativo</p>
          </header>
          {loadDuvidas ? <FaqSkeletonList count={6} /> : <div className="max-w-3xl mx-auto">
            <div className="space-y-2">
              {duvidas.map((faq: FAQ) => (
                <FaqItem key={faq.id} faq={faq} />
              ))}
            </div>
          </div>}
        </div>

        {/* Formulário para Nova Pergunta */}
        <div className="bg-white px-2 py-2 text-center rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800 text-md mb-2">Não encontrou sua dúvida?</h2>
            <p className="text-xs text-gray-600">
              Envie sua pergunta para nossa equipe. As mais relevantes serão adicionadas aqui.
            </p>
          </div>
          {errorMsg && (
            <div className="bg-red-50 px-3 py-2 border border-red-200 mb-4 rounded-md flex gap-2 items-start">
              {/* 👇 CORREÇÃO TAILWIND: flex-shrink-0 -> shrink-0 */}
              <WarningIcon className="text-red-600 shrink-0 mt-0.5" size={18} weight="bold" />
              <small className="text-red-600 text-sm">{errorMsg}</small>
            </div>
          )}
          <form onSubmit={handleQuestionSubmit} className="flex items-center gap-2">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              disabled={loadEnviarDuvida == true}
              // 👇 CORREÇÃO TAILWIND: flex-grow -> grow
              className="grow resize-none border border-gray-300 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={1}
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