import { useState, useEffect } from 'react'
import { useSchedule } from './ScheduleContext'
import { diasSemana } from '../../data/data'
import { ChevronLeft, Check, Plus, Clock, X, ArrowRight } from 'lucide-react'

const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-400 transition-all text-sm"
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"

const STEPS = [
    { id: 1, emoji: '📅', titulo: 'Quando acontece?',        subtitulo: 'Defina o período, dia e horário' },
    { id: 2, emoji: '🏛️', titulo: 'Qual é a sala?',          subtitulo: 'Selecione onde a aula vai acontecer' },
    { id: 3, emoji: '📚', titulo: 'Qual disciplina e curso?', subtitulo: 'Defina o que será ensinado e para quem' },
    { id: 4, emoji: '👨‍🏫', titulo: 'Quem vai dar a aula?',    subtitulo: 'Selecione o professor responsável' },
    { id: 5, emoji: '✅', titulo: 'Tudo certo!',              subtitulo: 'Confirme os dados antes de salvar' },
]

const CreateModal = ({ tipo, onSave, onClose }) => {
    const [data, setData] = useState({})
    const f = (k, v) => setData(d => ({ ...d, [k]: v }))

    const configs = {
        professor:  { title: 'Cadastrar Professor', fields: [
            { key: 'nomeProf',      label: 'Nome completo', type: 'text',  ph: 'Ex: João Silva' },
            { key: 'emailProf',     label: 'E-mail',        type: 'email', ph: 'joao@uepa.br' },
            { key: 'matriculaProf', label: 'Matrícula',     type: 'text',  ph: 'Ex: 123456' },
        ]},
        disciplina: { title: 'Cadastrar Disciplina', fields: [
            { key: 'nomeDisciplina',      label: 'Nome', type: 'text', ph: 'Ex: Cálculo I' },
            { key: 'matriculaDisciplina', label: 'Código', type: 'text', ph: 'Ex: MAT001' },
        ]},
        curso: { title: 'Cadastrar Curso', fields: [
            { key: 'nomeCurso',  label: 'Nome',  type: 'text',  ph: 'Ex: Engenharia de Software' },
            { key: 'siglaCurso', label: 'Sigla', type: 'text',  ph: 'Ex: BES' },
            { key: 'corCurso',   label: 'Cor de identificação', type: 'color' },
        ]},
        sala: { title: 'Cadastrar Sala', fields: [
            { key: 'nomeSala', label: 'Nome da sala', type: 'text', ph: 'Ex: Lab 01' },
            { key: 'tipoSala', label: 'Tipo', type: 'select',
              options: [{ v: 'sala', l: 'Sala de Aula' }, { v: 'laboratorio', l: 'Laboratório' }] },
        ]},
        periodo: { title: 'Cadastrar Período', fields: [
            { key: 'semestre',   label: 'Semestre',   type: 'text', ph: 'Ex: 2025.1' },
            { key: 'descricao',  label: 'Descrição',  type: 'text', ph: 'Ex: Primeiro Semestre 2025' },
            { key: 'dataInicio', label: 'Data início', type: 'date' },
            { key: 'dataFim',    label: 'Data fim',    type: 'date' },
        ]},
    }

    const cfg = configs[tipo]
    if (!cfg) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                style={{ animation: 'fadeInUp 0.2s ease' }}>
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="text-base font-black text-gray-900">{cfg.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Preencha os dados abaixo</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
                        <X size={15} />
                    </button>
                </div>
                <div className="space-y-4">
                    {cfg.fields.map(field => (
                        <div key={field.key}>
                            <label className={labelClass}>{field.label}</label>
                            {field.type === 'select' ? (
                                <select className={inputClass} onChange={e => f(field.key, e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {field.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                                </select>
                            ) : field.type === 'color' ? (
                                <div className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50">
                                    <input type="color" className="h-9 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                                        defaultValue="#3b82f6" onChange={e => f(field.key, e.target.value)} />
                                    <span className="text-sm text-gray-500 font-mono">{data[field.key] || '#3b82f6'}</span>
                                </div>
                            ) : (
                                <input type={field.type} className={inputClass} placeholder={field.ph || ''}
                                    onChange={e => f(field.key, e.target.value)} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancelar</button>
                    <button onClick={() => onSave(data)} className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#1c1aa3,#7c3aed)', boxShadow: '0 4px 14px rgba(28,26,163,0.25)' }}>Salvar</button>
                </div>
            </div>
            <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    )
}

const SelectField = ({ label, field, value, list, nameKey = 'nome', createTipo, onChange, onOpenCreate }) => (
    <div>
        <label className={labelClass}>{label}</label>
        <div className="flex gap-2">
            <select className={inputClass} value={value} onChange={e => onChange(field, e.target.value)}>
                <option value="">Selecione...</option>
                {list.map(i => <option key={i.id} value={i.id}>{i[nameKey]}</option>)}
            </select>
            <button type="button" onClick={() => onOpenCreate(createTipo)}
                className="shrink-0 h-11 px-3 flex items-center gap-1.5 rounded-xl border border-dashed border-blue-300 text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all text-xs font-semibold">
                <Plus size={13} />
                <span>Novo</span>
            </button>
        </div>
    </div>
)

const ScheduleForm = ({ horarioEdit, onSave, onCancel }) => {
    const { cursos, salas, periodos, professores, disciplinas, adicionarPeriodo, adicionarProfessor, adicionarDisciplina, adicionarCurso, adicionarSala } = useSchedule()
    const [step, setStep] = useState(1)
    const [createModal, setCreateModal] = useState(null)
    const [form, setForm] = useState({ periodoId: '', dataInicio: '', dataFim: '', diaSemana: '', horarioInicio: '', horarioFim: '', salaId: '', disciplinaId: '', cursoId: '', professorId: '' })

    useEffect(() => {
        if (horarioEdit) {
            const p = periodos.find(p => p.id === horarioEdit.periodoId)
            setForm({
                periodoId: String(horarioEdit.periodoId || ''), dataInicio: horarioEdit.dataInicio || p?.dataInicio || '',
                dataFim: horarioEdit.dataFim || p?.dataFim || '', diaSemana: horarioEdit.diaSemana || '',
                horarioInicio: horarioEdit.horarioInicio || '', horarioFim: horarioEdit.horarioFim || '',
                salaId: String(horarioEdit.salaId || ''), disciplinaId: String(horarioEdit.disciplinaId || horarioEdit.disciplina?.id || ''),
                cursoId: String(horarioEdit.cursoId || ''), professorId: String(horarioEdit.professorId || horarioEdit.professor?.id || ''),
            })
        }
    }, [horarioEdit, periodos])

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handlePeriodo = (_, id) => {
        const p = periodos.find(p => p.id === parseInt(id))
        setForm(f => ({ ...f, periodoId: id, dataInicio: p?.dataInicio || '', dataFim: p?.dataFim || '' }))
    }

    const handleCreateSave = async (data) => {
        try {
            let newId = null
            if (createModal === 'periodo') { newId = await adicionarPeriodo({ ...data, dataInicio: new Date(data.dataInicio).toISOString(), dataFim: new Date(data.dataFim).toISOString() }); if (newId) handlePeriodo(null, String(newId)) }
            else if (createModal === 'professor') { newId = await adicionarProfessor(data); if (newId) set('professorId', String(newId)) }
            else if (createModal === 'disciplina') { newId = await adicionarDisciplina(data); if (newId) set('disciplinaId', String(newId)) }
            else if (createModal === 'curso') { newId = await adicionarCurso(data); if (newId) set('cursoId', String(newId)) }
            else if (createModal === 'sala') { newId = await adicionarSala(data); if (newId) set('salaId', String(newId)) }
            setCreateModal(null)
        } catch { alert('Erro ao cadastrar. Verifique os dados.') }
    }

    const canNext = () => {
        if (step === 1) return form.periodoId && form.diaSemana && form.horarioInicio && form.horarioFim && form.dataInicio && form.dataFim
        if (step === 2) return form.salaId
        if (step === 3) return form.disciplinaId && form.cursoId
        if (step === 4) return form.professorId
        return true
    }

    const handleSubmit = () => {
        if (form.horarioInicio >= form.horarioFim) { alert('⚠️ Horário de término deve ser maior que o de início.'); return }
        onSave({ cursoId: parseInt(form.cursoId), salaId: parseInt(form.salaId), professorId: parseInt(form.professorId), disciplinaId: parseInt(form.disciplinaId), periodoId: parseInt(form.periodoId), diaSemana: form.diaSemana, horarioInicio: form.horarioInicio, horarioFim: form.horarioFim, dataInicio: new Date(form.dataInicio).toISOString(), dataFim: new Date(form.dataFim).toISOString() })
    }

    const getPeriodo    = () => periodos.find(p => p.id === parseInt(form.periodoId))
    const getSala       = () => salas.find(s => s.id === parseInt(form.salaId))
    const getDisciplina = () => disciplinas.find(d => d.id === parseInt(form.disciplinaId))
    const getCurso      = () => cursos.find(c => c.id === parseInt(form.cursoId))
    const getProfessor  = () => professores.find(p => p.id === parseInt(form.professorId))
    const cur = STEPS[step - 1]

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mb-8">
                {/* Header */}
                <div className="px-7 pt-6 pb-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{cur.emoji}</span>
                            <div>
                                <h3 className="text-lg font-black text-gray-900">{horarioEdit && step === 1 ? 'Editar Horário' : cur.titulo}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{cur.subtitulo}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                {STEPS.map(s => (
                                    <div key={s.id} className="rounded-full transition-all duration-300"
                                        style={{ width: step === s.id ? '18px' : '6px', height: '6px', background: step > s.id ? '#1c1aa3' : step === s.id ? '#7c3aed' : '#e5e7eb' }} />
                                ))}
                            </div>
                            <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 ml-1"><X size={15} /></button>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-100 mx-7 mb-6" />

                {/* Content */}
                <div className="px-7 pb-6 space-y-5">
                    {step === 1 && <>
                        <SelectField label="Período letivo" field="periodoId" value={form.periodoId} list={periodos} nameKey="semestre" createTipo="periodo" onChange={handlePeriodo} onOpenCreate={setCreateModal} />
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Data início</label><input type="date" className={inputClass} value={form.dataInicio} onChange={e => set('dataInicio', e.target.value)} /></div>
                            <div><label className={labelClass}>Data fim</label><input type="date" className={inputClass} value={form.dataFim} onChange={e => set('dataFim', e.target.value)} /></div>
                        </div>
                        <div>
                            <label className={labelClass}>Dia da semana</label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {diasSemana.map(d => (
                                    <button key={d} type="button" onClick={() => set('diaSemana', d)}
                                        className="py-3 rounded-xl text-xs font-bold border-2 transition-all"
                                        style={form.diaSemana === d
                                            ? { background: 'linear-gradient(135deg,#1c1aa3,#7c3aed)', color: 'white', borderColor: 'transparent', boxShadow: '0 4px 12px rgba(28,26,163,0.3)' }
                                            : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                                        {d.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}><Clock size={11} className="inline mr-1"/>Início</label><input type="time" className={inputClass} value={form.horarioInicio} onChange={e => set('horarioInicio', e.target.value)} /></div>
                            <div><label className={labelClass}><Clock size={11} className="inline mr-1"/>Fim</label><input type="time" className={inputClass} value={form.horarioFim} onChange={e => set('horarioFim', e.target.value)} /></div>
                        </div>
                    </>}

                    {step === 2 && <>
                        <SelectField label="Sala / Laboratório" field="salaId" value={form.salaId} list={salas} createTipo="sala" onChange={(_, v) => set('salaId', v)} onOpenCreate={setCreateModal} />
                        {form.salaId && getSala() && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <span className="text-xl">🏛️</span>
                                <div><p className="font-bold text-blue-900 text-sm">{getSala().nome}</p><p className="text-xs text-blue-400 capitalize">{getSala().tipo}</p></div>
                            </div>
                        )}
                    </>}

                    {step === 3 && <>
                        <SelectField label="Disciplina" field="disciplinaId" value={form.disciplinaId} list={disciplinas} createTipo="disciplina" onChange={(_, v) => set('disciplinaId', v)} onOpenCreate={setCreateModal} />
                        <SelectField label="Curso" field="cursoId" value={form.cursoId} list={cursos} createTipo="curso" onChange={(_, v) => set('cursoId', v)} onOpenCreate={setCreateModal} />
                        {form.cursoId && getCurso() && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-4 h-4 rounded-full shrink-0" style={{ background: getCurso().cor }} />
                                <p className="text-sm font-semibold text-gray-700">{getCurso().nome} <span className="text-gray-400 font-normal">({getCurso().sigla})</span></p>
                            </div>
                        )}
                    </>}

                    {step === 4 && <>
                        <SelectField label="Professor" field="professorId" value={form.professorId} list={professores} createTipo="professor" onChange={(_, v) => set('professorId', v)} onOpenCreate={setCreateModal} />
                        {form.professorId && getProfessor() && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <span className="text-xl">👨‍🏫</span>
                                <div><p className="font-bold text-blue-900 text-sm">{getProfessor().nome}</p><p className="text-xs text-blue-400">{getProfessor().email}</p></div>
                            </div>
                        )}
                    </>}

                    {step === 5 && (
                        <div className="space-y-2">
                            {[
                                { e: '📅', l: 'Período',    v: getPeriodo()?.semestre },
                                { e: '🗓️', l: 'Dia/Horário',v: `${form.diaSemana} • ${form.horarioInicio}–${form.horarioFim}` },
                                { e: '🏛️', l: 'Sala',       v: getSala()?.nome },
                                { e: '📚', l: 'Disciplina', v: getDisciplina()?.nome },
                                { e: '🎓', l: 'Curso',      v: `${getCurso()?.nome} (${getCurso()?.sigla})` },
                                { e: '👨‍🏫', l: 'Professor',  v: getProfessor()?.nome },
                            ].map(({ e, l, v }) => (
                                <div key={l} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                                    <span className="text-base w-6 text-center">{e}</span>
                                    <span className="text-xs text-gray-400 w-20 shrink-0">{l}</span>
                                    <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{v || '—'}</span>
                                    <Check size={13} className="text-green-500 shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <button type="button" onClick={() => step > 1 ? setStep(s => s - 1) : onCancel()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 text-sm font-semibold hover:bg-gray-200 transition-colors">
                        <ChevronLeft size={15} />{step === 1 ? 'Cancelar' : 'Voltar'}
                    </button>
                    {step < 5
                        ? <button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#1c1aa3,#7c3aed)', boxShadow: '0 4px 14px rgba(28,26,163,0.2)' }}>
                            Continuar <ArrowRight size={15} />
                          </button>
                        : <button type="button" onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 14px rgba(22,163,74,0.2)' }}>
                            <Check size={15} />{horarioEdit ? 'Atualizar' : 'Salvar Horário'}
                          </button>
                    }
                </div>
            </div>

            {createModal && <CreateModal tipo={createModal} onSave={handleCreateSave} onClose={() => setCreateModal(null)} />}
        </>
    )
}

export default ScheduleForm