import { createReactBlockSpec } from "@blocknote/react";
import { defaultProps } from "@blocknote/core";

export const FeaturesBlock = createReactBlockSpec(
    {
        type: "features",
        propSchema: {
            textAlignment: defaultProps.textAlignment,
            textColor: defaultProps.textColor,
            title: { default: "Características Principais", type: "string" },
            features: { default: "Funciona em todos os dispositivos\nAcesso imediato e vitalício\nSuporte premium incluso\nGarantia de 7 dias", type: "string" },
        },
        content: "none",
    },
    {
        render: (props) => {
            const updateProp = (key: string, value: string) => {
                props.editor.updateBlock(props.block, {
                    type: "features",
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
                            <span className="text-green-500 text-lg">✓</span> Bloco de Características / Benefícios
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">TÍTULO DA LISTA</label>
                            <input
                                className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-green-500/50 transition-colors"
                                value={props.block.props.title}
                                onChange={(e) => updateProp("title", e.target.value)}
                                placeholder="Ex: O que você vai receber"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">ITENS DA LISTA (Um por linha)</label>
                            <textarea
                                className="w-full bg-[#1a1a1a] text-sm text-white border border-[#333] rounded-lg px-3 py-2.5 outline-none focus:border-green-500/50 transition-colors min-h-[120px] resize-none"
                                value={props.block.props.features}
                                onChange={(e) => updateProp("features", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        toExternalHTML: (props) => {
            const featuresList = props.block.props.features.split('\n').filter(Boolean);

            return (
                <div className="features-card my-8 bg-[#f9fafb] border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm font-sans">
                    {props.block.props.title && (
                        <h3 className="text-xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-3">
                            {props.block.props.title}
                        </h3>
                    )}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 m-0 p-0 list-none">
                        {featuresList.map(feat => (
                            <li className="flex items-start text-base text-gray-700 leading-relaxed">
                                <svg className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
);
