/**
 * BlockEditor.tsx
 *
 * Editor de blocos usando BlockNote (Mantine).
 * Inclui botões de atalho para inserir blocos customizados (Expert Score, Features).
 */

import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useEffect, useRef, useState } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

// Template HTML para o bloco de Expert Score / Resenha
function getExpertScoreTemplate() {
    return `<div class="expert-score-container" style="margin:32px 0;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);display:flex;gap:32px;font-family:sans-serif;"><div style="min-width:200px;display:flex;flex-direction:column;align-items:center;"><img src="/images/produto.png" alt="Produto" style="width:180px;object-fit:contain;margin-bottom:16px;" /><div style="display:flex;flex-direction:column;gap:8px;width:100%;"><a href="https://seulink.com" target="_blank" rel="nofollow noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;background:#FF9900;border-radius:8px;color:#111;font-weight:700;text-decoration:none;font-size:14px;"><span>&#x1F6CD;</span> Ver Preço na Amazon</a><a href="https://seulink.com" target="_blank" rel="nofollow noopener" style="display:block;width:100%;text-align:center;padding:10px;border:1px solid #d1d5db;border-radius:8px;color:#374151;font-weight:600;text-decoration:none;font-size:13px;">Ver Melhor Preço</a></div></div><div style="flex:1;"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;"><h3 style="font-size:22px;font-weight:700;color:#111;margin:0;">Nome do Produto</h3><div style="background:#2563eb;color:#fff;padding:10px 14px;border-radius:10px;text-align:center;min-width:60px;"><div style="font-size:28px;font-weight:900;line-height:1;">9.5</div><div style="font-size:10px;text-transform:uppercase;font-weight:700;opacity:0.9;margin-top:2px;">Score</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;"><ul style="list-style:none;padding:0;margin:0;"><li style="display:flex;gap:8px;margin-bottom:10px;font-size:14px;color:#374151;">✅ Vantagem 1</li><li style="display:flex;gap:8px;margin-bottom:10px;font-size:14px;color:#374151;">✅ Vantagem 2</li><li style="display:flex;gap:8px;margin-bottom:10px;font-size:14px;color:#374151;">✅ Vantagem 3</li></ul><ul style="list-style:none;padding:0;margin:0;"><li style="display:flex;gap:8px;margin-bottom:10px;font-size:14px;color:#374151;">❌ Desvantagem 1</li><li style="display:flex;gap:8px;margin-bottom:10px;font-size:14px;color:#374151;">❌ Desvantagem 2</li></ul></div></div></div>`;
}

// Template HTML para o bloco de Features / Benefícios
function getFeaturesTemplate() {
    return `<div class="features-block" style="margin:24px 0;background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:24px;font-family:sans-serif;"><h4 style="font-size:16px;font-weight:700;color:#15803d;margin:0 0 16px 0;">✅ Principais Benefícios</h4><ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:10px;"><li style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:#166534;"><span style="color:#16a34a;font-weight:700;">✓</span> Benefício 1</li><li style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:#166534;"><span style="color:#16a34a;font-weight:700;">✓</span> Benefício 2</li><li style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:#166534;"><span style="color:#16a34a;font-weight:700;">✓</span> Benefício 3</li><li style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:#166534;"><span style="color:#16a34a;font-weight:700;">✓</span> Benefício 4</li></ul></div>`;
}

export default function BlockEditor({ value, onChange }: Props) {
    const initialContentRef = useRef(value);
    const [isReady, setIsReady] = useState(false);

    const editor = useCreateBlockNote();

    // Carregar conteúdo inicial
    useEffect(() => {
        if (!editor) return;

        const loadContent = async () => {
            try {
                if (initialContentRef.current) {
                    const blocks = await editor.tryParseHTMLToBlocks(initialContentRef.current);
                    if (blocks && blocks.length > 0) {
                        editor.replaceBlocks(editor.document, blocks);
                    }
                }
            } catch {
                // ignorar
            }
            setIsReady(true);
        };

        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Sincronizar mudanças com o pai
    useEffect(() => {
        if (!editor) return;

        const unsubscribe = editor.onChange(async () => {
            try {
                const html = await editor.blocksToHTMLLossy(editor.document);
                onChange(html);
            } catch {
                // ignorar
            }
        });

        return unsubscribe;
    }, [editor, onChange]);

    // Inserir template HTML no editor
    const insertTemplate = async (htmlTemplate: string) => {
        if (!editor) return;
        try {
            const blocks = await editor.tryParseHTMLToBlocks(htmlTemplate);
            if (blocks && blocks.length > 0) {
                const currentBlock = editor.getTextCursorPosition().block;
                editor.insertBlocks(blocks, currentBlock, 'after');
            }
        } catch (err) {
            console.error('Erro ao inserir template:', err);
        }
    };

    const btnBase: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        transition: 'opacity 0.15s',
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Barra de atalhos de blocos customizados */}
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 12px',
                background: '#111',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexWrap: 'wrap',
                alignItems: 'center',
            }}>
                <span style={{ fontSize: '11px', color: '#666', marginRight: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Plugins:
                </span>
                <button
                    onClick={() => insertTemplate(getExpertScoreTemplate())}
                    title="Inserir bloco de Resenha com nota, prós, contras e botão Amazon"
                    style={{ ...btnBase, background: 'rgba(234, 179, 8, 0.12)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)' }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    ⭐ Resenha / Expert Score
                </button>
                <button
                    onClick={() => insertTemplate(getFeaturesTemplate())}
                    title="Inserir caixa de benefícios/características"
                    style={{ ...btnBase, background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                    onMouseOver={e => { e.currentTarget.style.opacity = '0.8'; }}
                    onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                >
                    ✅ Caixa de Benefícios
                </button>
            </div>

            {/* Editor BlockNote */}
            <div style={{
                flex: 1,
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                overflow: 'auto',
                minHeight: 0,
            }}>
                {isReady !== undefined && (
                    <BlockNoteView
                        editor={editor}
                        theme="dark"
                    />
                )}
            </div>
        </div>
    );
}
