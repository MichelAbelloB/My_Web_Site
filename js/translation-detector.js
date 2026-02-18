/**
 * TRANSLATION DETECTOR - Detecta textos que faltan traducir
 * Ejecutar en consola del navegador para ver qué falta traducir
 */

(function() {
    'use strict';
    
    // Configuración
    const MIN_TEXT_LENGTH = 10; // Mínimo de caracteres para considerar
    const SELECTORS_TO_CHECK = [
        '.section-header h2',
        '.section-header p',
        '.banner-text p',
        '.ContDip p',
        '.h_text p',
        '.text-p-end h6'
    ];
    
    window.TranslationDetector = {
        
        // Detectar todos los textos sin traducir
        findUntranslated() {
            const untranslated = [];
            
            SELECTORS_TO_CHECK.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    const text = element.textContent.trim();
                    
                    // Verificar si necesita traducción
                    if (text.length >= MIN_TEXT_LENGTH) {
                        const hasTranslation = element.hasAttribute('data-es') || 
                                             element.hasAttribute('data-i18n');
                        
                        if (!hasTranslation) {
                            untranslated.push({
                                selector: selector,
                                text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                                fullText: text,
                                element: element,
                                location: this.getElementLocation(element)
                            });
                        }
                    }
                });
            });
            
            return untranslated;
        },
        
        // Obtener ubicación del elemento
        getElementLocation(element) {
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                section: this.getNearestSection(element)
            };
        },
        
        // Obtener sección más cercana
        getNearestSection(element) {
            const sections = ['portfolio_start', 'portfolio_end', 'home_Eco_banner'];
            let current = element;
            
            while (current && current !== document.body) {
                for (const section of sections) {
                    if (current.classList && current.classList.contains(section)) {
                        return section;
                    }
                }
                current = current.parentElement;
            }
            
            return 'unknown';
        },
        
        // Mostrar reporte en consola
        report() {
            const untranslated = this.findUntranslated();
            
            console.log('%c🌍 TRANSLATION REPORT', 'background: #985E6D; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
            console.log('');
            
            if (untranslated.length === 0) {
                console.log('%c✅ All texts are translated!', 'color: green; font-size: 14px; font-weight: bold;');
                return;
            }
            
            console.log(`%c⚠️ Found ${untranslated.length} texts without translation`, 'color: orange; font-size: 14px; font-weight: bold;');
            console.log('');
            
            // Agrupar por sección
            const bySection = {};
            untranslated.forEach(item => {
                if (!bySection[item.section]) {
                    bySection[item.section] = [];
                }
                bySection[item.section].push(item);
            });
            
            // Mostrar por sección
            Object.keys(bySection).forEach(section => {
                console.log(`%c📍 Section: ${section}`, 'color: blue; font-weight: bold;');
                console.table(bySection[section].map(item => ({
                    'Selector': item.selector,
                    'Text Preview': item.text,
                    'Length': item.fullText.length
                })));
                console.log('');
            });
            
            console.log('%c💡 TIP: Use data-es and data-en attributes to translate these texts', 'color: #985E6D; font-style: italic;');
            console.log('Example: <p data-es="Texto en español" data-en="Text in English">Texto en español</p>');
            
            return untranslated;
        },
        
        // Generar código HTML con traducciones vacías
        generateTemplate() {
            const untranslated = this.findUntranslated();
            
            console.log('%c📝 HTML TEMPLATE WITH TRANSLATION ATTRIBUTES', 'background: #985E6D; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
            console.log('');
            console.log('Copy and paste this into your HTML file:');
            console.log('');
            
            untranslated.forEach((item, index) => {
                const tagName = item.element.tagName.toLowerCase();
                const text = item.fullText;
                
                console.log(`<!-- ${index + 1}. ${item.selector} -->`);
                console.log(`<${tagName} data-es="${text}" data-en="[TRANSLATE TO ENGLISH]">${text}</${tagName}>`);
                console.log('');
            });
            
            return untranslated;
        },
        
        // Copiar lista de textos para traducir
        copyTextsToTranslate() {
            const untranslated = this.findUntranslated();
            const texts = untranslated.map(item => item.fullText).join('\n\n---\n\n');
            
            // Intentar copiar al portapapeles
            if (navigator.clipboard) {
                navigator.clipboard.writeText(texts).then(() => {
                    console.log('✅ Texts copied to clipboard!');
                    console.log('You can now paste them into a translation tool.');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    console.log('Texts to translate:');
                    console.log(texts);
                });
            } else {
                console.log('Texts to translate:');
                console.log(texts);
            }
            
            return texts;
        },
        
        // Resaltar elementos sin traducir en la página
        highlight() {
            const untranslated = this.findUntranslated();
            
            // Remover resaltados anteriores
            document.querySelectorAll('.translation-highlight').forEach(el => {
                el.classList.remove('translation-highlight');
            });
            
            // Agregar estilo si no existe
            if (!document.getElementById('translation-highlight-style')) {
                const style = document.createElement('style');
                style.id = 'translation-highlight-style';
                style.textContent = `
                    .translation-highlight {
                        background: rgba(255, 255, 0, 0.3) !important;
                        outline: 2px dashed red !important;
                        position: relative !important;
                    }
                    .translation-highlight::before {
                        content: '⚠️ Needs translation';
                        position: absolute;
                        top: -25px;
                        left: 0;
                        background: red;
                        color: white;
                        padding: 2px 8px;
                        font-size: 12px;
                        font-weight: bold;
                        border-radius: 3px;
                        z-index: 10000;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Resaltar elementos
            untranslated.forEach(item => {
                item.element.classList.add('translation-highlight');
            });
            
            console.log(`✅ Highlighted ${untranslated.length} elements on the page`);
            console.log('Scroll down to see them marked with yellow background and red border');
            
            return untranslated;
        },
        
        // Remover resaltado
        removeHighlight() {
            document.querySelectorAll('.translation-highlight').forEach(el => {
                el.classList.remove('translation-highlight');
            });
            console.log('✅ Highlights removed');
        }
    };
    
    // Auto-ejecutar reporte al cargar
    if (document.readyState === 'complete') {
        setTimeout(() => {
            window.TranslationDetector.report();
        }, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.TranslationDetector.report();
            }, 1000);
        });
    }
    
    // Agregar métodos globales para fácil acceso
    window.checkTranslations = () => window.TranslationDetector.report();
    window.highlightUntranslated = () => window.TranslationDetector.highlight();
    window.copyToTranslate = () => window.TranslationDetector.copyTextsToTranslate();
    
    console.log('%c💡 Translation Helper Loaded!', 'background: #985E6D; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
    console.log('%cAvailable commands:', 'font-weight: bold;');
    console.log('  • checkTranslations()    - Show translation report');
    console.log('  • highlightUntranslated() - Highlight texts that need translation');
    console.log('  • copyToTranslate()      - Copy all texts to clipboard');
    console.log('  • TranslationDetector.removeHighlight() - Remove highlights');
    
})();
