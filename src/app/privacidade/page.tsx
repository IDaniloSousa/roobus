'use client';

import Header from '@/components/Header';
import { ShieldCheck, MapPin, User, Database, GitBranch } from '@phosphor-icons/react';

export default function PrivacidadePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Privacidade e Segurança" showBackButton />

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={32} className="text-blue-600" weight="fill" />
            <h1 className="text-2xl font-bold text-gray-800">Política de Privacidade e Segurança</h1>
          </div>
          
          <p className="text-gray-600 mb-4">Última atualização: 08 de outubro de 2025</p>

          <p className="text-gray-700 mb-6">
            A sua privacidade é fundamental para nós. Este documento explica quais informações coletamos, por que as coletamos e como as utilizamos para melhorar sua experiência com o aplicativo RooBus, desenvolvido pela Universidade Federal de Rondonópolis (UFR).
          </p>

          {/* Seção de Coleta de Dados */}
          <div className="space-y-6">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              <div className="flex items-start gap-4">
                <MapPin size={28} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Permissão de Geolocalização</h2>
                  <p className="text-gray-700 mt-1">
                    Para exibir sua posição no mapa e encontrar as linhas de ônibus mais próximas, o aplicativo solicita acesso à sua geolocalização. Essa informação é usada exclusivamente enquanto o aplicativo está em uso e não é armazenada em nossos servidores. Sua localização nunca é compartilhada com terceiros.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
              <div className="flex items-start gap-4">
                <User size={28} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Identificação Anônima</h2>
                  <p className="text-gray-700 mt-1">
                    Não exigimos login ou cadastro. Para funcionalidades como "Linhas Recentes", geramos um identificador único e anônimo que é salvo apenas no seu dispositivo. Este ID nos permite personalizar sua experiência sem coletar informações pessoais como nome, e-mail ou telefone.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
              <div className="flex items-start gap-4">
                <Database size={28} className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Dados Armazenados</h2>
                  <p className="text-gray-700 mt-1">
                    Os únicos dados que associamos ao seu ID anônimo são suas linhas de ônibus pesquisadas recentemente e as perguntas enviadas através do formulário de contato, para fins de suporte. Esses dados são armazenados de forma segura em nosso banco de dados e são utilizados unicamente para a operação do aplicativo.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
                <div className="flex items-start gap-4">
                    <GitBranch size={28} className="text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Dados de Terceiros</h2>
                        <p className="text-gray-700 mt-1">
                            O aplicativo utiliza o serviço de mapas OpenStreetMap. O uso desta funcionalidade está sujeito aos termos de serviço e políticas de privacidade do OpenStreetMap. Não compartilhamos nenhum dado de usuário com este ou qualquer outro serviço de terceiros.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Seus Direitos</h2>
            <p className="text-gray-700 mb-2">
              Você tem total controle sobre seus dados. A qualquer momento, você pode limpar os dados de navegação do seu navegador para remover seu ID anônimo e todo o histórico associado.
            </p>
            <p className="text-gray-700">
              Para dúvidas ou solicitações relacionadas à sua privacidade, entre em contato conosco através da seção "Contato" do aplicativo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
