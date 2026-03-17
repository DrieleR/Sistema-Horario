import { useState } from 'react'
import { useSchedule } from '../Schedule/ScheduleContext'
import { Edit2, Trash2, X, Plus, Check, BookOpen, Users, Building2, GraduationCap, Calendar } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:3000'
const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-400 transition-all text-sm"
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"

// ─── Config de cada entidade ──────────────────────────────────────────
const CONFIG = {
    professores: {
        title: 'Professores', endpoint: 'professor', labelKey: 'nome',
        icon: Users, color: '#1d4ed8', colorBg: '#dbeafe',
        fields: [
            { front: 'nome',      back: 'nomeProf',      label: 'Nome completo', type: 'text',  ph: 'Ex: João Silva' },
            { front: 'email',     back: 'emailProf',     label: 'E-mail',        type: 'email', ph: 'joao@uepa.br' },
            { front: 'matricula', back: 'matriculaProf', label: 'Matrícula',     type: 'text',  ph: 'Ex: 123456' },
        ],
    },
    disciplinas: {
        title: 'Disciplinas', endpoint: 'disciplina', labelKey: 'nome',
        icon: BookOpen, color: '#7c3aed', colorBg: '#ede9fe',
        fields: [
            { front: 'nome',      back: 'nomeDisciplina',      label: 'Nome da disciplina', type: 'text', ph: 'Ex: Cálculo I' },
            { front: 'matricula', back: 'matriculaDisciplina', label: 'Código/Sigla',        type: 'text', ph: 'Ex: MAT001' },
        ],
    },
    cursos: {
        title: 'Cursos', endpoint: 'curso', labelKey: 'nome',
        icon: GraduationCap, color: '#0891b2', colorBg: '#cffafe',
        fields: [
            { front: 'nome',  back: 'nomeCurso',  label: 'Nome do curso', type: 'text',  ph: 'Ex: Engenharia de Software' },
            { front: 'sigla', back: 'siglaCurso', label: 'Sigla',         type: 'text',  ph: 'Ex: BES' },
            { front: 'cor',   back: 'corCurso',   label: 'Cor',           type: 'color' },
        ],
    },
    salas: {
        title: 'Salas', endpoint: 'sala', labelKey: 'nome',
        icon: Building2, color: '#059669', colorBg: '#d1fae5',
        fields: [
            { front: 'nome', back: 'nomeSala', label: 'Nome da sala', type: 'text',   ph: 'Ex: Lab 01' },
            { front: 'tipo', back: 'tipoSala', label: 'Tipo',         type: 'select',
              options: [{ v: 'sala', l: 'Sala de Aula' }, { v: 'laboratorio', l: 'Laboratório' }] },
        ],
    },
    periodos: {
        title: 'Períodos', endpoint: 'periodo', labelKey: 'semestre',
        icon: Calendar, color: '#d97706', colorBg: '#fef3c7',
        fields: [
            { front: 'semestre',   back: 'semestre',   label: 'Semestre',    type: 'text', ph: 'Ex: 2025.1' },
            { front: 'descricao',  back: 'descricao',  label: 'Descrição',   type: 'text', ph: 'Ex: Primeiro Semestre' },
            { front: 'dataInicio', back: 'dataInicio', label: 'Data início', type: 'date' },
            { front: 'dataFim',    back: 'dataFim',    label: 'Data fim',    type: 'date' },
        ],
    },
}

// ─── Modal de criar/editar ────────────────────────────────────────────
const ItemModal = ({ tipo, item, onSave, onClose }) => {
    const cfg = CONFIG[tipo]
    const isEdit = !!item

    const initial = {}
    cfg.fields.forEach(f => { initial[f.front] = item?.[f.front] || '' })
    const [data, setData] = useState(initial)
    const set = (k, v) => setData(d => ({ ...d, [k]: v }))

    const handleSubmit = () => {
        const payload = {}
        cfg.fields.forEach(f => {
            if (data[f.front] !== undefined && data[f.front] !== '') {
                payload[f.back] = data[f.front]
            }
        })
        if (isEdit) payload.id = item.id
        onSave(payload)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                style={{ animation: 'fadeInUp 0.2s ease' }}>
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-base font-black text-gray-900">
                            {isEdit ? `Editar ${cfg.title.slice(0, -1)}` : `Novo(a) ${cfg.title.slice(0, -1)}`}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEdit ? 'Atualize os dados abaixo' : 'Preencha os dados abaixo'}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={15} />
                    </button>
                </div>

                <div className="space-y-4">
                    {cfg.fields.map(field => (
                        <div key={field.front}>
                            <label className={labelClass}>{field.label}</label>
                            {field.type === 'select' ? (
                                <select className={inputClass} value={data[field.front]}
                                    onChange={e => set(field.front, e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {field.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                </select>
                            ) : field.type === 'color' ? (
                                <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50">
                                    <input type="color" className="h-9 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                                        value={data[field.front] || '#3b82f6'}
                                        onChange={e => set(field.front, e.target.value)} />
                                    <span className="text-sm text-gray-500 font-mono">{data[field.front] || '#3b82f6'}</span>
                                </div>
                            ) : (
                                <input type={field.type} className={inputClass}
                                    placeholder={field.ph || ''}
                                    value={data[field.front]}
                                    onChange={e => set(field.front, e.target.value)} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit}
                        className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(135deg, ${CONFIG[tipo].color}, ${CONFIG[tipo].color}cc)`, boxShadow: `0 4px 14px ${CONFIG[tipo].color}40` }}>
                        <Check size={14} />
                        {isEdit ? 'Atualizar' : 'Cadastrar'}
                    </button>
                </div>
            </div>
            <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}

// ─── Componente principal ─────────────────────────────────────────────
const DataManager = () => {
    const { professores, disciplinas, cursos, salas, periodos, recarregarDados } = useSchedule()
    const [activeTab, setActiveTab] = useState('professores')
    const [modal, setModal] = useState(null) // { tipo, item? }

    const lists = { professores, disciplinas, cursos, salas, periodos }
    const cfg = CONFIG[activeTab]
    const list = lists[activeTab]
    const TabIcon = cfg.icon

    const handleSave = async (payload) => {
        try {
            if (payload.id) {
                await axios.put(`${API_URL}/${cfg.endpoint}/update`, payload)
            } else {
                await axios.post(`${API_URL}/${cfg.endpoint}/create`, payload)
            }
            setModal(null)
            recarregarDados()
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao salvar. Verifique os dados.')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir?')) return
        try {
            await axios.delete(`${API_URL}/${cfg.endpoint}/delete`, { data: { id } })
            recarregarDados()
        } catch {
            alert('Erro ao excluir. Este item pode estar sendo usado em um horário.')
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* ── Cabeçalho ── */}
            <div className="px-6 py-5 border-b border-gray-100"
                style={{ background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-black text-gray-900">Gerenciar Cadastros</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Adicione, edite ou remova dados do sistema</p>
                    </div>
                    <button
                        onClick={() => setModal({ tipo: activeTab, item: null })}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all hover:-translate-y-0.5"
                        style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, boxShadow: `0 4px 14px ${cfg.color}35` }}>
                        <Plus size={15} />
                        Novo(a) {cfg.title.slice(0, -1)}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto">
                    {Object.entries(CONFIG).map(([key, c]) => {
                        const Icon = c.icon
                        const isActive = activeTab === key
                        return (
                            <button key={key} onClick={() => setActiveTab(key)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                                style={isActive
                                    ? { background: c.colorBg, color: c.color, boxShadow: `0 2px 8px ${c.color}25` }
                                    : { color: '#9ca3af', background: 'transparent' }
                                }>
                                <Icon size={13} />
                                {c.title}
                                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black"
                                    style={{ background: isActive ? c.color + '20' : '#f3f4f6', color: isActive ? c.color : '#9ca3af' }}>
                                    {lists[key].length}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Lista ── */}
            <div className="p-4">
                {list.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                            style={{ background: cfg.colorBg }}>
                            <TabIcon size={22} style={{ color: cfg.color }} />
                        </div>
                        <p className="text-sm font-bold text-gray-500">Nenhum(a) {cfg.title.slice(0, -1).toLowerCase()} cadastrado(a)</p>
                        <p className="text-xs text-gray-400 mt-1">Clique em "Novo(a)" para adicionar</p>
                        <button onClick={() => setModal({ tipo: activeTab, item: null })}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all"
                            style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}>
                            <Plus size={13} /> Adicionar agora
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {list.map(item => (
                            <div key={item.id}
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all group">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Bolinha de cor para cursos */}
                                    {item.cor && (
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.cor }} />
                                    )}
                                    {/* Ícone padrão */}
                                    {!item.cor && (
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: cfg.colorBg }}>
                                            <TabIcon size={13} style={{ color: cfg.color }} />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {item[cfg.labelKey] || item.semestre || 'Sem nome'}
                                        </p>
                                        {/* Subtítulo contextual */}
                                        {item.email && <p className="text-xs text-gray-400 truncate">{item.email}</p>}
                                        {item.sigla && <p className="text-xs text-gray-400">{item.sigla}</p>}
                                        {item.tipo  && <p className="text-xs text-gray-400 capitalize">{item.tipo}</p>}
                                        {item.descricao && activeTab === 'periodos' && <p className="text-xs text-gray-400 truncate">{item.descricao}</p>}
                                    </div>
                                </div>

                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button
                                        onClick={() => setModal({ tipo: activeTab, item })}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                                        style={{ background: '#dbeafe', color: '#1d4ed8' }}
                                        title="Editar">
                                        <Edit2 size={13} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
                                        style={{ background: '#fee2e2', color: '#dc2626' }}
                                        title="Excluir">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <ItemModal
                    tipo={modal.tipo}
                    item={modal.item}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    )
}

export default DataManager