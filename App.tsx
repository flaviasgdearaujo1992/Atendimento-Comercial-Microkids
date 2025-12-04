
import React, { useState, useEffect } from 'react';
import { 
  Search, Home, FileText, Bell, HelpCircle, Menu, X, 
  Download, ChevronDown, ChevronUp, Plus, Trash2, 
  Settings, ExternalLink, MessageSquare, Users,
  ArrowRight, ShieldCheck, Lock, ArrowLeft, UserPlus, Loader2, Upload
} from 'lucide-react';
import { FAQItem, DocumentItem, Announcement, ViewState, UserLog } from './types';
import { ChatWidget } from './components/ChatWidget';

// --- MOCK DATA ---
const INITIAL_FAQS: FAQItem[] = [
  { id: '1', category: 'Metodologia', question: 'O que é a metodologia Maker?', answer: 'A cultura Maker baseia-se na ideia de que qualquer pessoa pode construir, consertar, modificar e fabricar os mais diversos tipos de objetos e projetos com suas próprias mãos (Do It Yourself).' },
  { id: '2', category: 'Comercial', question: 'Qual o prazo de entrega dos kits?', answer: 'O prazo padrão para capitais é de 5 a 10 dias úteis. Para interior, de 10 a 15 dias úteis, dependendo da transportadora.' },
  { id: '3', category: 'Técnico', question: 'Os robôs precisam de internet?', answer: 'Não necessariamente. A programação pode ser feita offline e enviada via cabo USB ou Bluetooth, dependendo do modelo do controlador.' },
];

const INITIAL_DOCS: DocumentItem[] = [
  { id: '1', title: 'Tabela de Preços 2025', type: 'PDF', category: 'Comercial', size: '2.4 MB', date: '01/01/2025' },
  { id: '2', title: 'Apresentação Institucional', type: 'PPT', category: 'Marketing', size: '15 MB', date: '15/02/2025' },
  { id: '3', title: 'Manual do Professor - Vol 1', type: 'PDF', category: 'Pedagógico', size: '5.1 MB', date: '10/01/2025' },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Reajuste na Tabela de Preços', content: 'A partir de 01/03, os valores dos kits sofrerão um reajuste de 5%. Baixe a nova tabela na área de documentos.', date: '20/02/2025', isUrgent: true },
  { id: '2', title: 'Nova Certificação Comercial', content: 'Treinamento obrigatório para todos os vendedores disponível na plataforma de EAD.', date: '18/02/2025', isUrgent: false },
];

const INITIAL_USER_LOGS: UserLog[] = [
  { email: 'diretoria@microkids.com.br', lastAccess: new Date(Date.now() - 86400000).toLocaleString(), accessCount: 42 },
  { email: 'gerente.sp@microkids.com.br', lastAccess: new Date(Date.now() - 3600000).toLocaleString(), accessCount: 15 },
];

// List of allowed admins
const ALLOWED_ADMINS = [
  { username: 'Microkids', password: '1996' }
];

// --- COMPONENTS ---

// 0. SVG Logos (Adjusted to prevent distortion)
const MicrokidsLogo = () => (
  <svg 
    viewBox="0 0 160 40" 
    className="h-8 md:h-10 w-auto shrink-0" 
    aria-label="Microkids"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    <path fill="#1d4ed8" d="M22.5,38.5h-5.8l-2.6-9.2c-0.6-2.2-1.1-4.8-1.5-7.3h-0.1c-0.4,2.5-1,5.2-1.6,7.3l-2.7,9.2H2.3l4.8-16.1 L2.6,6.3h5.9l2.4,8.8c0.6,2.2,1.1,4.7,1.5,7.1h0.1c0.4-2.4,0.9-4.9,1.5-7.1l2.5-8.8h5.8L22.5,38.5z M26.9,8.5c0-1.6,1.2-2.8,2.9-2.8 c1.7,0,2.9,1.2,2.9,2.8c0,1.7-1.2,2.9-2.9,2.9C28.1,11.3,26.9,10.1,26.9,8.5z M27.1,38.5V13.6h5.4v24.9H27.1z M43.7,39 c-4.6,0-8.1-3.6-8.1-8.5c0-4.9,3.5-8.6,8.2-8.6c2.4,0,4.3,0.9,5.5,2.3l-3.3,3.3c-0.6-0.8-1.4-1.2-2.3-1.2c-1.9,0-3,1.6-3,4.1 c0,2.6,1.2,4.2,3.1,4.2c1,0,1.8-0.4,2.4-1.2l3.3,3.1C48.2,38,46.3,39,43.7,39z M54.6,38.5V13.6h5.4v3.8h0.1c0.7-2.3,2.4-4,4.6-4 v5.2c-0.2,0-0.5-0.1-0.8-0.1c-2.6,0-3.9,1.6-3.9,4.8v15.2H54.6z M76.2,39c-4.9,0-8.5-3.6-8.5-8.6c0-4.9,3.6-8.6,8.5-8.6 c4.9,0,8.5,3.7,8.5,8.6C84.7,35.3,81.1,39,76.2,39z M76.2,34.7c2,0,3.3-1.8,3.3-4.3c0-2.5-1.3-4.3-3.3-4.3c-1.9,0-3.3,1.8-3.3,4.3 C72.9,32.9,74.2,34.7,76.2,34.7z M92.3,38.5V6.3h5.4v18.7l5.2-5.4h6.7l-6.8,6.4l7.2,12.5h-6.4l-4.2-8l-1.7,1.6v6.4H92.3z M112.5,8.5 c0-1.6,1.2-2.8,2.9-2.8c1.7,0,2.9,1.2,2.9,2.8c0,1.7-1.2,2.9-2.9,2.9C113.8,11.3,112.5,10.1,112.5,8.5z M112.7,38.5V13.6h5.4v24.9 H112.7z M131.2,38.5v-3.6h-0.1c-1.1,2.4-3.3,4.1-6,4.1c-4.6,0-7.8-3.7-7.8-8.5c0-4.9,3.3-8.6,7.8-8.6c2.6,0,4.7,1.6,5.8,3.9h0.1V6.3 h5.4v32.2H131.2z M128.4,34.7c1.9,0,3.1-1.6,3.1-4.2c0-2.6-1.2-4.2-3.1-4.2c-2,0-3.2,1.7-3.2,4.2C125.2,33,126.5,34.7,128.4,34.7z M149.2,39c-3.1,0-5.6-1.5-6.6-3.8h-0.1l-1,3.3h-4.9l1.9-6c0.8-2.5,1.7-5,1.7-7.7c0-2.1-1.2-3.3-3.3-3.3h-1.5v-3.7h2.8 c4.5,0,7,2.5,7,6.8c0,2.3-0.7,4.6-1.4,6.7c-0.4,1.4-1,2.9-1.3,4.1c-0.2,0.8-0.1,1.3,0.6,1.3c0.6,0,1.2-0.3,1.8-0.7l1.7,3.5 C155.1,38.6,152.2,39,149.2,39z"/>
  </svg>
);

const MicrokidsIcon = () => (
   <svg 
    viewBox="0 0 50 50" 
    className="h-8 w-8 opacity-40 hover:opacity-100 transition-opacity shrink-0" 
    aria-label="MK"
    preserveAspectRatio="xMidYMid meet"
   >
     <rect width="50" height="50" rx="10" fill="#1d4ed8" />
     <path fill="#ffffff" d="M12,35h-3.8l-1.6-6c-0.4-1.4-0.7-3.1-1-4.7H5.5c-0.2,1.6-0.6,3.4-1,4.7L2.8,35H-1l3.1-10.4 L0.4,14.2h3.8l1.6,5.7c0.4,1.4,0.7,3,1,4.6h0.1c0.2-1.5,0.6-3.1,1-4.6l1.6-5.7h3.7L12,35z M25.7,35V14.2h3.5v12.1l3.4-3.5h4.3 l-4.4,4.1l4.7,8.1h-4.1l-2.7-5.2l-1.1,1v4.2H25.7z"/>
   </svg>
);

// 1. WhatsApp Sticky Button
const WhatsAppButton = () => (
  <a
    href="https://wa.me/5527998487057" 
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-24 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center justify-center"
    title="Falar com Suporte"
  >
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  </a>
);

// 2. Navigation
const Navbar: React.FC<{ 
  currentView: ViewState; 
  setView: (v: ViewState) => void; 
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onAdminClick: () => void;
}> = ({ currentView, setView, toggleMobileMenu, isMobileMenuOpen, onAdminClick }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: <Home size={20} /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
    { id: 'documents', label: 'Documentos', icon: <FileText size={20} /> },
    { id: 'announcements', label: 'Comunicados', icon: <Bell size={20} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
             <div className="flex items-center gap-4">
              <MicrokidsLogo />
              <span className="text-xs text-slate-500 uppercase tracking-widest border-l border-slate-300 pl-4 hidden sm:block font-medium">Portal do Vendedor</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentView === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
             <button
                onClick={onAdminClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'admin' 
                    ? 'bg-slate-100 text-slate-800' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Área Administrativa"
              >
                <Settings size={18} />
              </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
             <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id as ViewState); toggleMobileMenu(); }}
                className={`w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                  currentView === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
                onClick={() => { onAdminClick(); toggleMobileMenu(); }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 text-slate-500 hover:bg-slate-50"
              >
                <Settings size={20} />
                Administração
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// 3. Home View
const HomeView: React.FC<{
  setView: (v: ViewState) => void; 
  onSearch: (q: string) => void;
  announcements: Announcement[];
}> = ({ setView, onSearch, announcements }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setView('faq');
    }
  };

  const urgentNews = announcements.filter(a => a.isUrgent);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-none md:rounded-3xl p-8 md:p-12 shadow-xl mx-0 md:mx-4 mt-0 md:mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.1C93.3,9,81.6,22.4,70.6,33.8C59.6,45.2,49.3,54.6,37.5,62.8C25.7,71.1,12.4,78.2,-1.4,80.6C-15.2,83.1,-29,80.8,-41.2,73.5C-53.4,66.2,-64,53.8,-71.4,40.1C-78.8,26.4,-83,11.3,-81.4,-3.2C-79.9,-17.7,-72.6,-31.7,-63,-43.3C-53.4,-54.9,-41.5,-64.1,-28.9,-72.1C-16.3,-80.1,-3,-86.9,10.6,-86.5C24.2,-86.1,30.5,-101,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Olá, Vendedor</h1>
          <p className="text-blue-100 text-lg mb-8">Bem-vindo(a) ao portal Microkids. Encontre respostas, documentos e suporte para suas vendas.</p>
          
          <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você procura hoje? (ex: prazos, robótica...)"
              className="w-full pl-12 pr-4 py-4 rounded-full text-slate-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Access */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => setView('faq')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full"><HelpCircle size={24}/></div>
            <span className="font-medium text-slate-700">Tira-Dúvidas</span>
          </div>
          <div onClick={() => setView('documents')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full"><FileText size={24}/></div>
            <span className="font-medium text-slate-700">Documentos</span>
          </div>
          <div onClick={() => setView('announcements')} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><Bell size={24}/></div>
            <span className="font-medium text-slate-700">Comunicados</span>
          </div>
          <a href="https://wa.me/5527998487057" target="_blank" rel="noreferrer" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center gap-3">
            <div className="bg-green-100 text-green-600 p-3 rounded-full"><MessageSquare size={24}/></div>
            <span className="font-medium text-slate-700">Falar com Suporte</span>
          </a>
        </div>
      </div>

      {/* Urgent News */}
      {urgentNews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex gap-3">
              <Bell className="text-red-500 shrink-0" />
              <div>
                <h3 className="font-bold text-red-700">Atenção Vendedores</h3>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-red-800 text-sm">
                  {urgentNews.map(news => (
                    <li key={news.id}>{news.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. FAQ View
const FAQView: React.FC<{ items: FAQItem[]; initialSearch: string }> = ({ items, initialSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = ['Todas', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Perguntas Frequentes</h2>
        <p className="text-slate-500">Encontre respostas rápidas para as dúvidas mais comuns.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar nas perguntas..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhuma pergunta encontrada para sua busca.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase tracking-wide">{item.category}</span>
                  <span className="font-medium text-slate-800">{item.question}</span>
                </div>
                {openId === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>
              {openId === item.id && (
                <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100">
                  <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 5. Document View
const DocumentView: React.FC<{ items: DocumentItem[] }> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const categories = ['Todas', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = items.filter(item => 
    selectedCategory === 'Todas' || item.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Biblioteca de Documentos</h2>
          <p className="text-slate-500">Baixe propostas, manuais e apresentações atualizadas.</p>
        </div>
        <div className="flex gap-2">
           {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${
                doc.type === 'PDF' ? 'bg-red-50 text-red-500' :
                doc.type === 'PPT' ? 'bg-orange-50 text-orange-500' :
                'bg-blue-50 text-blue-500'
              }`}>
                <FileText size={24} />
              </div>
              <span className="text-xs text-slate-400">{doc.date}</span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{doc.title}</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{doc.category} &bull; {doc.size}</span>
              <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Announcement View
const AnnouncementView: React.FC<{ items: Announcement[] }> = ({ items }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
       <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Central de Comunicados</h2>
        <p className="text-slate-500">Fique por dentro das novidades da Microkids.</p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
        {items.map(item => (
          <div key={item.id} className="relative pl-8">
             {/* Timeline dot */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              item.isUrgent ? 'bg-red-500' : 'bg-blue-500'
            }`}></div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <div className="flex items-center gap-3">
                  {item.isUrgent && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded uppercase">Urgente</span>
                  )}
                  <span className="text-sm text-slate-400 font-medium">{item.date}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Admin Panel
const AdminPanel: React.FC<{
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  docs: DocumentItem[];
  setDocs: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  news: Announcement[];
  setNews: React.Dispatch<React.SetStateAction<Announcement[]>>;
  userLogs: UserLog[];
}> = ({ faqs, setFaqs, docs, setDocs, news, setNews, userLogs }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'doc' | 'news' | 'users'>('faq');
  
  // States for Forms
  const [faqForm, setFaqForm] = useState<Partial<FAQItem>>({});
  const [docForm, setDocForm] = useState<{title: string, category: string, file: File | null}>({ title: '', category: '', file: null });
  const [newsForm, setNewsForm] = useState<Partial<Announcement>>({ title: '', content: '', isUrgent: false });

  // FAQ Handlers
  const handleAddFAQ = () => {
    if (!faqForm.question || !faqForm.answer) return;
    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: faqForm.question || '',
      answer: faqForm.answer || '',
      category: faqForm.category || 'Geral'
    };
    setFaqs([...faqs, newItem]);
    setFaqForm({});
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  // Document Handlers
  const handleAddDoc = () => {
    if (!docForm.title || !docForm.file) return;

    // Simulate upload processing
    const fileExtension = docForm.file.name.split('.').pop()?.toUpperCase();
    const mockType = ['PDF', 'PPT', 'DOC', 'IMG'].includes(fileExtension || '') ? fileExtension as any : 'PDF';
    const mockSize = (docForm.file.size / 1024 / 1024).toFixed(1) + ' MB';

    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      title: docForm.title,
      category: docForm.category || 'Geral',
      type: mockType,
      size: mockSize,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setDocs([...docs, newDoc]);
    setDocForm({ title: '', category: '', file: null });
    // Reset file input manually if needed, but react state handles the logic
  };

  const handleDeleteDoc = (id: string) => {
    setDocs(docs.filter(d => d.id !== id));
  };

  // News Handlers
  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.content) return;
    const newItem: Announcement = {
      id: Date.now().toString(),
      title: newsForm.title || '',
      content: newsForm.content || '',
      isUrgent: newsForm.isUrgent || false,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setNews([newItem, ...news]); // Add to top
    setNewsForm({ title: '', content: '', isUrgent: false });
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-slate-800 p-3 rounded-lg text-white">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Painel Administrativo</h2>
          <p className="text-slate-500">Gerencie o conteúdo do portal e visualize acessos.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'faq' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Gerenciar FAQ
          </button>
           <button 
            onClick={() => setActiveTab('doc')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'doc' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Gerenciar Documentos
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'news' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Gerenciar Comunicados
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[120px] py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Histórico de Acessos
          </button>
        </div>

        <div className="p-6">
          {/* FAQ MANAGEMENT */}
          {activeTab === 'faq' && (
            <div>
              <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold mb-4 text-slate-700">Adicionar Nova Pergunta</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Pergunta" 
                    onChange={e => setFaqForm({...faqForm, question: e.target.value})}
                    value={faqForm.question || ''}
                  />
                  <input 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Categoria" 
                    onChange={e => setFaqForm({...faqForm, category: e.target.value})}
                    value={faqForm.category || ''}
                  />
                  <textarea 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                    placeholder="Resposta" 
                    onChange={e => setFaqForm({...faqForm, answer: e.target.value})}
                    value={faqForm.answer || ''}
                  />
                  <button onClick={handleAddFAQ} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 font-medium">
                    <Plus size={18} /> Adicionar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {faqs.map(f => (
                  <div key={f.id} className="flex justify-between items-center p-3 border rounded bg-white hover:bg-slate-50 transition-colors">
                    <div>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 mr-2">{f.category}</span>
                      <span className="font-medium">{f.question}</span>
                    </div>
                    <button onClick={() => handleDeleteFAQ(f.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS MANAGEMENT */}
          {activeTab === 'doc' && (
             <div>
              <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold mb-4 text-slate-700">Fazer Upload de Documento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Título do Documento" 
                    onChange={e => setDocForm({...docForm, title: e.target.value})}
                    value={docForm.title || ''}
                  />
                  <input 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Categoria (ex: Comercial)" 
                    onChange={e => setDocForm({...docForm, category: e.target.value})}
                    value={docForm.category || ''}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-500 mb-1">Selecione o arquivo</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="file" 
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 bg-slate-800 rounded border border-slate-700"
                            onChange={e => setDocForm({...docForm, file: e.target.files ? e.target.files[0] : null})}
                        />
                    </div>
                  </div>
                  <button 
                    onClick={handleAddDoc} 
                    disabled={!docForm.file || !docForm.title}
                    className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload size={18} /> Fazer Upload
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {docs.map(d => (
                  <div key={d.id} className="flex justify-between items-center p-3 border rounded bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded ${d.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                           <FileText size={16} />
                       </div>
                       <div>
                           <p className="font-medium text-slate-800">{d.title}</p>
                           <p className="text-xs text-slate-500">{d.category} • {d.size} • {d.date}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDeleteDoc(d.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* ANNOUNCEMENTS MANAGEMENT */}
          {activeTab === 'news' && (
            <div>
              <div className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold mb-4 text-slate-700">Publicar Novo Comunicado</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Título do Comunicado" 
                    onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                    value={newsForm.title || ''}
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="urgent"
                      checked={newsForm.isUrgent}
                      onChange={e => setNewsForm({...newsForm, isUrgent: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="urgent" className="text-sm text-slate-700">Marcar como Urgente (aparecerá no topo)</label>
                  </div>
                  <textarea 
                    className="p-2 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                    placeholder="Conteúdo do comunicado..." 
                    onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                    value={newsForm.content || ''}
                  />
                  <button onClick={handleAddNews} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 font-medium">
                    <Bell size={18} /> Publicar
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {news.map(n => (
                  <div key={n.id} className={`flex justify-between items-start p-4 border rounded bg-white hover:bg-slate-50 transition-colors ${n.isUrgent ? 'border-l-4 border-l-red-500' : ''}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                          {n.isUrgent && <span className="text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">URGENTE</span>}
                          <span className="text-xs text-slate-400">{n.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800">{n.title}</h4>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                    </div>
                    <button onClick={() => handleDeleteNews(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS LOG */}
          {activeTab === 'users' && (
             <div>
                <div className="mb-6 flex justify-between items-end">
                   <h3 className="font-semibold text-lg text-slate-800">Registro de Acessos (Histórico)</h3>
                   <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{userLogs.length} Registros</span>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left text-slate-600">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-3">E-mail</th>
                            <th className="px-6 py-3">Último Acesso</th>
                            <th className="px-6 py-3 text-center">Total de Acessos</th>
                         </tr>
                      </thead>
                      <tbody>
                         {userLogs.sort((a,b) => new Date(b.lastAccess).getTime() - new Date(a.lastAccess).getTime()).map((log) => (
                            <tr key={log.email} className="bg-white border-b hover:bg-slate-50">
                               <td className="px-6 py-4 font-medium text-slate-900">{log.email}</td>
                               <td className="px-6 py-4">{log.lastAccess}</td>
                               <td className="px-6 py-4 text-center">{log.accessCount}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 8. Admin Login Modal
const AdminLoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const adminUser = ALLOWED_ADMINS.find(
      (admin) => admin.username.toLowerCase() === username.trim().toLowerCase() && admin.password === password
    );

    if (adminUser) {
      onLogin();
      setUsername('');
      setPassword('');
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Acesso Administrativo</h2>
          <p className="text-slate-500 text-sm mt-1">Área restrita a colaboradores autorizados.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Microkids"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
             <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all tracking-widest text-center text-lg"
              placeholder="****"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Acessar Painel
          </button>
        </form>
      </div>
    </div>
  );
};


// --- MAIN APP ---

const App: React.FC = () => {
  // App View State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // "Database" State
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [news, setNews] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  // User logs are now static since we removed the login gate
  const [userLogs] = useState<UserLog[]>(INITIAL_USER_LOGS);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onAdminClick={handleAdminClick}
      />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView 
            setView={setCurrentView} 
            onSearch={handleSearch}
            announcements={news}
          />
        )}
        {currentView === 'faq' && <FAQView items={faqs} initialSearch={searchQuery} />}
        {currentView === 'documents' && <DocumentView items={docs} />}
        {currentView === 'announcements' && <AnnouncementView items={news} />}
        {currentView === 'admin' && (
          <AdminPanel 
            faqs={faqs} setFaqs={setFaqs}
            docs={docs} setDocs={setDocs}
            news={news} setNews={setNews}
            userLogs={userLogs}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-4">
          <MicrokidsIcon />
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Microkids Tecnologia Educacional. Uso interno.</p>
        </div>
      </footer>

      <WhatsAppButton />
      <ChatWidget />
      
      <AdminLoginModal 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLoginSuccess}
      />
    </div>
  );
};

export default App;
