import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";

export const ExpertScoreBlock = createReactBlockSpec(
    {
        type: "expertScore",
        propSchema: {
            textAlignment: defaultProps.textAlignment,
            textColor: defaultProps.textColor,
            title: { default: "Nome do Produto", type: "string" },
            score: { default: "9.9", type: "string" },
            pros: { default: "Fácil de usar\nÓtimo custo-benefício\nMuito rápido", type: "string" },
            cons: { default: "Preço elevado\nPode ser complexo no início", type: "string" },
            imageUrl: { default: "", type: "string" },
            btnUrl: { default: "https://", type: "string" },
            btnText: { default: "Comprar Agora", type: "string" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const updateProp = (key: string, value: string) => {
                props.editor.updateBlock(props.block, {
                    type: "expertScore",
                    props: { ...props.block.props, [key]: value },
                });
            };

            return (
                <div
                    className="flex flex-col gap-4 p-5 border border-[rgba(255,255,255,0.1)] rounded-xl bg-[#111] my-4 shadow-lg w-full"
                    contentEditable={false}
                >
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#222]">
                        <h3 className="text-white text-sm font-bold flex items-center gap-2">
                            <span className="text-primary text-lg">★</span> Resenha do Especialista (Expert Score)
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">TÍTULO DO PRODUTO</label>
                                <input
                                    className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-primary transition-colors"
                                    value={props.block.props.title}
                                    onChange={(e) => updateProp("title", e.target.value)}
                                    placeholder="Ex: Instant Pot Duo 7-in-1"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">NOTA (ex: 8.8)</label>
                                    <input
                                        className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-primary transition-colors text-center font-bold"
                                        value={props.block.props.score}
                                        onChange={(e) => updateProp("score", e.target.value)}
                                        placeholder="9.5"
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">URL DA IMAGEM</label>
                                    <input
                                        className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-primary transition-colors"
                                        value={props.block.props.imageUrl}
                                        onChange={(e) => updateProp("imageUrl", e.target.value)}
                                        placeholder="/images/posts/panela.png"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">TEXTO BOTÃO (CTA)</label>
                                    <input
                                        className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-primary transition-colors"
                                        value={props.block.props.btnText}
                                        onChange={(e) => updateProp("btnText", e.target.value)}
                                        placeholder="Ex: €99.99 na Amazon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-1">LINK BOTÃO (AFILIADO)</label>
                                    <input
                                        className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-primary transition-colors"
                                        value={props.block.props.btnUrl}
                                        onChange={(e) => updateProp("btnUrl", e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-green-500 mb-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> PRÓS (Um por linha)
                                </label>
                                <textarea
                                    className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-green-500/50 transition-colors min-h-[95px] resize-none"
                                    value={props.block.props.pros}
                                    onChange={(e) => updateProp("pros", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-red-500 mb-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg> CONTRAS (Um por linha)
                                </label>
                                <textarea
                                    className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-red-500/50 transition-colors min-h-[95px] resize-none"
                                    value={props.block.props.cons}
                                    onChange={(e) => updateProp("cons", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
        toExternalHTML: (props) => {
            const prosList = props.block.props.pros.split('\n').filter(Boolean);
            const consList = props.block.props.cons.split('\n').filter(Boolean);

            return (
                <div className="expert-score-container my-10 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 relative font-sans">
                    {/* Imagem e Botões Laterais */}
                    <div className="md:w-[35%] flex flex-col items-center">
                        {props.block.props.imageUrl ? (
                            <img src={props.block.props.imageUrl} alt={props.block.props.title} className="w-full max-w-[280px] object-contain mb-6 mix-blend-multiply" />
                        ) : (
                            <div className="w-full h-[250px] bg-gray-50 rounded-xl mb-6 flex items-center justify-center text-gray-400 border border-gray-100 italic">Sem imagem</div>
                        )}

                        <div className="w-full flex flex-col gap-3 mt-auto">
                            <a href={props.block.props.btnUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-lg transition-colors">
                                {props.block.props.btnText}
                            </a>
                        </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="md:w-[65%] flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 m-0 pr-4 leading-snug">
                                {props.block.props.title}
                            </h3>
                            <div className="flex flex-col items-center bg-blue-600 text-white p-3 rounded-xl ml-4 shrink-0 shadow-md min-w-[70px]">
                                <span className="text-3xl font-black leading-none tracking-tight">{props.block.props.score}</span>
                                <span className="text-[9px] uppercase font-bold tracking-widest mt-1 opacity-90">Score</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            {prosList.length > 0 && (
                                <div className="pros-list">
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        {prosList.map(pro => (
                                            <li className="flex items-start text-sm text-gray-600 leading-relaxed">
                                                <svg className="w-5 h-5 text-green-500 mr-2 shrink-0 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                <span>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {consList.length > 0 && (
                                <div className="cons-list">
                                    <ul className="space-y-3 m-0 p-0 list-none">
                                        {consList.map(con => (
                                            <li className="flex items-start text-sm text-gray-600 leading-relaxed">
                                                <svg className="w-5 h-5 text-red-400 mr-2 shrink-0 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                <span>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }
);
