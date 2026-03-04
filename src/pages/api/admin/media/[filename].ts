import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isGitHubConfigured, githubDeleteFile } from '../../../../utils/github-api';

/**
 * api/admin/media/[filename].ts
 * 
 * API route para deletar uma imagem específica da biblioteca de mídia.
 */

const BASE_IMAGES_DIR = path.resolve('./public/images');
const MEDIA_TYPES = ['posts', 'authors', 'themes', 'general'] as const;

export const DELETE: APIRoute = async ({ params, url }) => {
    try {
        const { filename } = params;

        if (!filename) {
            return new Response(JSON.stringify({ success: false, error: 'Nome não fornecido' }), {
                status: 400, headers: { 'Content-Type': 'application/json' },
            });
        }

        let decodedFilename: string;
        try { decodedFilename = decodeURIComponent(filename); }
        catch { decodedFilename = filename; }

        const typeFromQuery = url.searchParams.get('type');

        // 1. FLUXO GITHUB (Produção Vercel)
        if (isGitHubConfigured()) {
            let deleted = false;
            let pathsToTry = [];

            if (typeFromQuery && MEDIA_TYPES.includes(typeFromQuery as any)) {
                pathsToTry.push(`public/images/${typeFromQuery}/${decodedFilename}`);
            } else {
                pathsToTry = MEDIA_TYPES.map(t => `public/images/${t}/${decodedFilename}`);
            }

            for (const repoPath of pathsToTry) {
                const succ = await githubDeleteFile(repoPath, `media: delete image "${decodedFilename}"`);
                if (succ) { deleted = true; break; }
            }

            if (!deleted) {
                throw new Error('Falha ao deletar arquivo no repositório GitHub (talvez ele não exista)');
            }

            return new Response(JSON.stringify({ success: true, message: 'Imagem deletada (GitHub)' }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. FLUXO LOCAL FILESYSTEM (Dev)
        let filePath: string | null = null;

        if (typeFromQuery && MEDIA_TYPES.includes(typeFromQuery as any)) {
            const mediaDir = path.join(BASE_IMAGES_DIR, typeFromQuery);
            filePath = path.join(mediaDir, decodedFilename);
            try { await fs.access(filePath); }
            catch { filePath = null; }
        }

        if (!filePath) {
            for (const mediaType of MEDIA_TYPES) {
                const testPath = path.join(BASE_IMAGES_DIR, mediaType, decodedFilename);
                try {
                    await fs.access(testPath);
                    filePath = testPath;
                    break;
                } catch { continue; }
            }
        }

        if (!filePath) {
            return new Response(JSON.stringify({ success: false, error: 'Arquivo não encontrado' }), {
                status: 404, headers: { 'Content-Type': 'application/json' },
            });
        }

        await fs.unlink(filePath);
        return new Response(JSON.stringify({ success: true, message: 'Imagem deletada localmente' }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('❌ Erro ao deletar mídia:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Erro ao deletar imagem',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
