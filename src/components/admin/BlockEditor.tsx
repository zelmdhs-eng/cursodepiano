/**
 * BlockEditor.tsx
 * 
 * Componente React para editor de blocos estilo Gutenberg usando BlockNote.
 * Fornece interface visual moderna com blocos arrastáveis, similar ao WordPress Gutenberg e Notion.
 */

import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { BlockNoteViewRaw, useCreateBlockNote, useBlockNoteEditor, SuggestionMenuController, getDefaultReactSlashMenuItems } from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import { useEffect, useState } from 'react';
import { ExpertScoreBlock } from './blocks/ExpertScoreBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';

const filterSuggestionItems = (items: any[], query: string) => {
    return items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.aliases && item.aliases.some((a: string) => a.toLowerCase().includes(query.toLowerCase())))
    );
};

// 1. Criar Schema Estendido com Blocos Customizados
const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        expertScore: ExpertScoreBlock(),
        features: FeaturesBlock(),
    },
});

// 2. Criar Menus Customizados (Plugins WP-like) para o Slash Menu
const insertExpertScore = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Resenha c/ Review (Expert Score)",
    onItemClick: () => {
        editor.insertBlocks(
            [
                {
                    type: "expertScore",
                },
            ],
            editor.getTextCursorPosition().block,
            "after"
        );
    },
    aliases: ["score", "resenha", "review", "produto", "afiliado", "avaliacao"],
    group: "Plugins Customizados",
    icon: <span className="text-xl">⭐</span>,
});

const insertFeatures = (editor: typeof schema.BlockNoteEditor) => ({
    title: "Caixa de Prós/Benefícios",
    onItemClick: () => {
        editor.insertBlocks(
            [
                {
                    type: "features",
                },
            ],
            editor.getTextCursorPosition().block,
            "after"
        );
    },
    aliases: ["pros", "features", "caracteristicas", "beneficios", "lista"],
    group: "Plugins Customizados",
    icon: <span className="text-xl">✅</span>,
});

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function BlockEditor({ value, onChange, placeholder = 'Comece a escrever...' }: Props) {
    // Usar o hook oficial do BlockNote para React
    const editor = useCreateBlockNote({
        schema,
    });

    const [isMounted, setIsMounted] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Evitar hidratacao errada do Astro
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Atualizar conteúdo inicial quando carregar
    useEffect(() => {
        if (editor && value && isMounted && !initialLoaded) {
            setInitialLoaded(true);
            try {
                const blocks = editor.tryParseHTMLToBlocks(value);
                if (blocks && blocks.length > 0) {
                    editor.replaceBlocks(editor.document, blocks);
                }
            } catch (err) {
                // ignorar silently
            }
        }
    }, [value, editor, isMounted, initialLoaded]);

    // Converter blocos para HTML quando mudar
    useEffect(() => {
        if (!editor || !isMounted || !initialLoaded) return;

        const handleUpdate = async () => {
            try {
                const html = await editor.blocksToHTMLLossy(editor.document);
                if (html !== value) {
                    onChange(html);
                }
            } catch (error) {
                console.error('Erro ao converter blocos para HTML:', error);
            }
        };

        const unsubscribe = editor.onChange(() => {
            handleUpdate();
        });

        return () => {
            unsubscribe();
        };
    }, [editor, isMounted, initialLoaded, value, onChange]);

    if (!editor || !isMounted) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg">
                <p className="text-[#a3a3a3]">Carregando editor...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden relative pb-[150px]">
            <BlockNoteViewRaw
                editor={editor}
                theme="dark"
                slashMenu={false}
            >
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) => {
                        const standardItems = getDefaultReactSlashMenuItems(editor);
                        const customItems = [insertExpertScore(editor), insertFeatures(editor)];
                        // Filtrar itens baseados na busca
                        return filterSuggestionItems([...customItems, ...standardItems], query);
                    }}
                />
            </BlockNoteViewRaw>
        </div>
    );
}
